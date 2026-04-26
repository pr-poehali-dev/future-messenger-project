"""
Авторизация пользователей NeonChat: регистрация, вход, выход, получение профиля, обновление профиля.
Параметр action в query: register | login | me | profile | logout
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg: str, code: int = 400) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    headers = event.get("headers") or {}
    session_token = headers.get("X-Session-Token") or headers.get("x-session-token")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # REGISTER
    if action == "register":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        display_name = (body.get("display_name") or username).strip()
        avatar_emoji = body.get("avatar_emoji") or "🚀"

        if not username or not email or not password:
            return err("Заполни все поля")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")
        if len(username) < 3:
            return err("Ник минимум 3 символа")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            conn.close()
            return err("Такой ник или email уже занят", 409)

        pw_hash = hash_password(password)
        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (username, email, password_hash, display_name, avatar_emoji, session_token) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, username, display_name, avatar_emoji, level, xp, status, created_at",
            (username, email, pw_hash, display_name, avatar_emoji, token)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return ok({
            "success": True,
            "session_token": token,
            "user": {
                "id": row[0], "username": row[1], "display_name": row[2],
                "avatar_emoji": row[3], "level": row[4], "xp": row[5],
                "status": row[6], "created_at": str(row[7])
            }
        })

    # LOGIN
    if action == "login":
        login = (body.get("login") or "").strip().lower()
        password = body.get("password") or ""

        if not login or not password:
            return err("Введи логин и пароль")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, display_name, avatar_emoji, level, xp, status, bio FROM {SCHEMA}.users WHERE (LOWER(username) = %s OR LOWER(email) = %s) AND password_hash = %s",
            (login, login, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный логин или пароль", 401)

        token = secrets.token_hex(32)
        cur.execute(f"UPDATE {SCHEMA}.users SET session_token = %s, last_seen = NOW() WHERE id = %s", (token, row[0]))
        conn.commit()
        conn.close()

        return ok({
            "success": True,
            "session_token": token,
            "user": {
                "id": row[0], "username": row[1], "display_name": row[2],
                "avatar_emoji": row[3], "level": row[4], "xp": row[5],
                "status": row[6], "bio": row[7]
            }
        })

    # ME
    if action == "me":
        if not session_token:
            return err("Не авторизован", 401)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, username, display_name, avatar_emoji, level, xp, status, bio, email, created_at FROM {SCHEMA}.users WHERE session_token = %s",
            (session_token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return err("Сессия недействительна", 401)

        return ok({
            "user": {
                "id": row[0], "username": row[1], "display_name": row[2],
                "avatar_emoji": row[3], "level": row[4], "xp": row[5],
                "status": row[6], "bio": row[7], "email": row[8],
                "created_at": str(row[9])
            }
        })

    # PROFILE UPDATE
    if action == "profile" and method == "PUT":
        if not session_token:
            return err("Не авторизован", 401)

        display_name = body.get("display_name")
        avatar_emoji = body.get("avatar_emoji")
        bio = body.get("bio")
        status = body.get("status")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE session_token = %s", (session_token,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Сессия недействительна", 401)

        user_id = row[0]
        fields = []
        values = []
        if display_name is not None:
            fields.append("display_name = %s"); values.append(display_name)
        if avatar_emoji is not None:
            fields.append("avatar_emoji = %s"); values.append(avatar_emoji)
        if bio is not None:
            fields.append("bio = %s"); values.append(bio)
        if status is not None:
            fields.append("status = %s"); values.append(status)

        if fields:
            values.append(user_id)
            cur.execute(f"UPDATE {SCHEMA}.users SET {', '.join(fields)} WHERE id = %s", values)
            conn.commit()

        cur.execute(
            f"SELECT id, username, display_name, avatar_emoji, level, xp, status, bio FROM {SCHEMA}.users WHERE id = %s",
            (user_id,)
        )
        r = cur.fetchone()
        conn.close()
        return ok({
            "success": True,
            "user": {
                "id": r[0], "username": r[1], "display_name": r[2],
                "avatar_emoji": r[3], "level": r[4], "xp": r[5],
                "status": r[6], "bio": r[7]
            }
        })

    # LOGOUT
    if action == "logout":
        if session_token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.users SET session_token = NULL WHERE session_token = %s", (session_token,))
            conn.commit()
            conn.close()
        return ok({"success": True})

    return err("Неизвестное действие", 404)
