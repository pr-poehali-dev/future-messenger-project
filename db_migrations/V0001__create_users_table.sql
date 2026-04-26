CREATE TABLE t_p31522104_future_messenger_pro.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_emoji VARCHAR(10) DEFAULT '🚀',
    status VARCHAR(20) DEFAULT 'online',
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    bio TEXT DEFAULT '',
    session_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    last_seen TIMESTAMP DEFAULT NOW()
);
