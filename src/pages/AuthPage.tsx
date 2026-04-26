import { useState } from "react";
import { register, login, User } from "@/lib/auth";
import Icon from "@/components/ui/icon";

const AVATARS = ["🚀","🦊","⭐","🐉","👾","🎮","⚡","🔥","💎","🎯","🧠","🌙","🦁","🐺","🤖"];

interface Props {
  onAuth: (user: User) => void;
}

export default function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🚀");
  const [showAvatars, setShowAvatars] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await login({ login: loginField, password });
      onAuth(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await register({
        username,
        email,
        password: regPassword,
        display_name: displayName || username,
        avatar_emoji: selectedAvatar,
      });
      onAuth(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg" style={{ background: "var(--dark-bg)" }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }} />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 animate-pulse-neon"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)", boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
            <span className="font-orbitron font-black text-white text-2xl">N</span>
          </div>
          <h1 className="font-orbitron font-black text-2xl tracking-wider"
            style={{ color: "#e2e8f0", textShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
            NEONCHAT
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Игровой мессенджер нового поколения
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}>
          {(["login", "register"] as const).map(tab => (
            <button key={tab} onClick={() => { setMode(tab); setError(""); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: mode === tab ? "linear-gradient(135deg, rgba(168,85,247,0.8), rgba(139,92,246,0.9))" : "transparent",
                color: mode === tab ? "white" : "#6b7280",
                boxShadow: mode === tab ? "0 0 15px rgba(168,85,247,0.3)" : "none",
                fontFamily: "'Rubik', sans-serif",
              }}>
              {tab === "login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6" style={{ background: "var(--dark-card)", border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 0 40px rgba(168,85,247,0.1)" }}>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <Icon name="AlertCircle" size={16} style={{ color: "#ef4444" }} />
              <span className="text-sm" style={{ color: "#ef4444" }}>{error}</span>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>НИК ИЛИ EMAIL</label>
                <div className="relative">
                  <Icon name="User" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                  <input
                    value={loginField}
                    onChange={e => setLoginField(e.target.value)}
                    placeholder="gamertag или email"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>ПАРОЛЬ</label>
                <div className="relative">
                  <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="game-btn w-full py-3 text-base font-semibold mt-2 flex items-center justify-center gap-2"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={18} />
                    Войти
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Avatar picker */}
              <div className="flex flex-col items-center gap-2 pb-2">
                <button type="button" onClick={() => setShowAvatars(!showAvatars)}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all hover:scale-105"
                  style={{ background: "rgba(168,85,247,0.2)", border: "2px solid rgba(168,85,247,0.5)", boxShadow: "0 0 15px rgba(168,85,247,0.3)" }}>
                  {selectedAvatar}
                </button>
                <span className="text-xs" style={{ color: "#6b7280" }}>Нажми для выбора аватара</span>
                {showAvatars && (
                  <div className="grid grid-cols-5 gap-2 p-3 rounded-xl w-full animate-scale-in"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {AVATARS.map(av => (
                      <button key={av} type="button"
                        onClick={() => { setSelectedAvatar(av); setShowAvatars(false); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110"
                        style={{ background: selectedAvatar === av ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)", border: selectedAvatar === av ? "1px solid rgba(168,85,247,0.6)" : "1px solid transparent" }}>
                        {av}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>НИК *</label>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="gamertag" required minLength={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>ИМЯ</label>
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Отображаемое имя"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>EMAIL *</label>
                <div className="relative">
                  <Icon name="Mail" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    type="email" placeholder="your@email.com" required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>ПАРОЛЬ * (мин. 6 символов)</label>
                <div className="relative">
                  <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                  <input value={regPassword} onChange={e => setRegPassword(e.target.value)}
                    type="password" placeholder="••••••••" required minLength={6}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="game-btn w-full py-3 text-base font-semibold flex items-center justify-center gap-2"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Создаём аккаунт...
                  </>
                ) : (
                  <>
                    <Icon name="Rocket" size={18} />
                    Создать аккаунт
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-4 text-xs" style={{ color: "#4b5563" }}>
          NeonChat · Игровой мессенджер © 2025
        </p>
      </div>
    </div>
  );
}