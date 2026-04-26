import { useState } from "react";
import Icon from "@/components/ui/icon";

// Types
type Tab = "chats" | "channels" | "contacts" | "games" | "stories";
type ChatType = "personal" | "group" | "channel";

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "gaming" | "away" | "offline";
  level: number;
  lastSeen?: string;
  lastMsg?: string;
  unread?: number;
  type: ChatType;
  tag?: string;
}

interface Message {
  id: number;
  from: string;
  text?: string;
  time: string;
  isMe: boolean;
  type: "text" | "image" | "audio" | "sticker" | "achievement";
  img?: string;
  achievement?: string;
  reactions?: string[];
}

const contacts: Contact[] = [
  { id: 1, name: "Киберлис", avatar: "🦊", status: "gaming", level: 42, lastMsg: "Gg ez, пойдём на ремач?", unread: 3, type: "personal", tag: "PRO" },
  { id: 2, name: "Команда Omega", avatar: "⚡", status: "online", level: 99, lastMsg: "Стрим в 20:00!", unread: 12, type: "group", tag: "TEAM" },
  { id: 3, name: "NovaStar", avatar: "⭐", status: "online", level: 28, lastMsg: "Погнали в Minecraft", unread: 0, type: "personal" },
  { id: 4, name: "DragonByte", avatar: "🐉", status: "away", level: 55, lastMsg: "afk 10 min", unread: 0, type: "personal" },
  { id: 5, name: "PixelKing", avatar: "👾", status: "offline", level: 31, lastMsg: "ок, завтра", unread: 0, type: "personal" },
  { id: 6, name: "GG Squad", avatar: "🎮", status: "gaming", level: 77, lastMsg: "5 побед подряд!!! 🔥", unread: 5, type: "group", tag: "HOT" },
];

const channels = [
  { id: 10, name: "GameDev Central", avatar: "🛠️", subs: "12.4K", lastPost: "2 мин назад", tag: "DEV" },
  { id: 11, name: "Neon Beats", avatar: "🎵", subs: "89K", lastPost: "5 мин назад", tag: "MUSIC" },
  { id: 12, name: "CyberNews", avatar: "📡", subs: "234K", lastPost: "1 мин назад", tag: "NEWS" },
  { id: 13, name: "PixelArt World", avatar: "🎨", subs: "45K", lastPost: "10 мин назад", tag: "ART" },
];

const initialMessages: Message[] = [
  { id: 1, from: "Киберлис", text: "Привет! Готов к матчу?", time: "18:32", isMe: false, type: "text", reactions: ["🔥", "👍"] },
  { id: 2, from: "Я", text: "Да, уже в лобби жду!", time: "18:33", isMe: true, type: "text" },
  { id: 3, from: "Киберлис", text: "", time: "18:34", isMe: false, type: "sticker", img: "https://cdn.poehali.dev/projects/3785e638-34cc-45ed-97dc-85ea8d88557c/files/05f8c5ae-a854-47d8-93d5-442a2918d1ca.jpg" },
  { id: 4, from: "Киберлис", text: "Gg ez, пойдём на ремач?", time: "19:01", isMe: false, type: "text", reactions: ["💀", "😂"] },
  { id: 5, from: "Я", text: "Ха, ты просто читер 😂", time: "19:02", isMe: true, type: "text" },
  { id: 6, from: "Система", text: "🏆 Киберлис получил достижение «Легенда»", time: "19:03", isMe: false, type: "achievement" },
  { id: 7, from: "Я", text: "Кстати, глянь это видео!", time: "19:05", isMe: true, type: "image", img: "https://cdn.poehali.dev/projects/3785e638-34cc-45ed-97dc-85ea8d88557c/files/20aba06b-a8ae-481c-8895-91f47eef9d42.jpg" },
];

const games = [
  { id: 1, name: "Крестики-нолики", emoji: "❌", players: "2", time: "1 мин", color: "#a855f7", desc: "Классика, быстрая партия" },
  { id: 2, name: "Угадай слово", emoji: "🎯", players: "2-6", time: "5 мин", color: "#22d3ee", desc: "Объясняй без слов!" },
  { id: 3, name: "Викторина", emoji: "🧠", players: "2-10", time: "10 мин", color: "#4ade80", desc: "Кто умнее в команде?" },
  { id: 4, name: "Рисунок+Угадай", emoji: "🎨", players: "3-8", time: "15 мин", color: "#fb923c", desc: "Нарисуй и угадай" },
  { id: 5, name: "Мини-шахматы", emoji: "♟️", players: "2", time: "20 мин", color: "#f472b6", desc: "Быстрые партии" },
  { id: 6, name: "Слова", emoji: "💬", players: "2-4", time: "7 мин", color: "#facc15", desc: "Последняя буква" },
];

const stories = [
  { id: 1, name: "Киберлис", avatar: "🦊", hasNew: true, color: "#a855f7" },
  { id: 2, name: "Omega", avatar: "⚡", hasNew: true, color: "#22d3ee" },
  { id: 3, name: "NovaStar", avatar: "⭐", hasNew: false, color: "#4ade80" },
  { id: 4, name: "DragonByte", avatar: "🐉", hasNew: true, color: "#fb923c" },
  { id: 5, name: "Твоя история", avatar: "➕", hasNew: false, color: "#6b7280" },
];

const statusColor = (s: string) => {
  if (s === "online") return "status-online";
  if (s === "gaming") return "status-gaming";
  if (s === "away") return "status-away";
  return "bg-gray-600";
};

const statusLabel = (s: string) => {
  if (s === "online") return "онлайн";
  if (s === "gaming") return "🎮 играет";
  if (s === "away") return "отошёл";
  return "оффлайн";
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Contact | null>(contacts[0]);
  const [msgInput, setMsgInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rightPanel, setRightPanel] = useState<"profile" | "search" | "settings" | null>(null);
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const [tttBoard, setTttBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [tttTurn, setTttTurn] = useState<"X" | "O">("X");
  const [tttWinner, setTttWinner] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  const navItems: { tab: Tab; icon: string; label: string; badge?: number }[] = [
    { tab: "chats", icon: "MessageCircle", label: "Чаты", badge: contacts.reduce((a, c) => a + (c.unread || 0), 0) },
    { tab: "channels", icon: "Radio", label: "Каналы" },
    { tab: "contacts", icon: "Users", label: "Контакты" },
    { tab: "games", icon: "Gamepad2", label: "Игры" },
    { tab: "stories", icon: "Layers", label: "Истории" },
  ];

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkWinner = (board: Array<string | null>) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.every(Boolean) ? "Ничья" : null;
  };

  const handleTtt = (idx: number) => {
    if (tttBoard[idx] || tttWinner) return;
    const next = [...tttBoard];
    next[idx] = tttTurn;
    const winner = checkWinner(next);
    setTttBoard(next);
    setTttWinner(winner);
    if (!winner) setTttTurn(tttTurn === "X" ? "O" : "X");
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    const newMsg: Message = {
      id: chatMessages.length + 1,
      from: "Я",
      text: msgInput,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      type: "text",
    };
    setChatMessages([...chatMessages, newMsg]);
    setMsgInput("");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden grid-bg" style={{ background: "var(--dark-bg)", fontFamily: "'Rubik', sans-serif" }}>

      {/* Sidebar Navigation */}
      <div className="flex flex-col items-center py-4 gap-2 w-16 shrink-0 border-r" style={{ background: "var(--dark-panel)", borderColor: "rgba(168,85,247,0.15)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 animate-pulse-neon" style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
          <span className="font-orbitron font-black text-white text-lg">N</span>
        </div>

        {navItems.map(item => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: activeTab === item.tab ? "rgba(168,85,247,0.25)" : "transparent",
              color: activeTab === item.tab ? "#a855f7" : "#6b7280",
              boxShadow: activeTab === item.tab ? "0 0 12px rgba(168,85,247,0.3)" : "none",
            }}
            title={item.label}
          >
            <Icon name={item.icon} size={20} />
            {item.badge && item.badge > 0 ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center animate-badge-pop"
                style={{ background: "#a855f7", color: "white" }}>
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={() => setRightPanel(rightPanel === "profile" ? null : "profile")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all"
          style={{ background: rightPanel === "profile" ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.05)" }}
          title="Мой профиль"
        >
          🚀
        </button>
        <button
          onClick={() => setRightPanel(rightPanel === "settings" ? null : "settings")}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ color: rightPanel === "settings" ? "#a855f7" : "#6b7280" }}
          title="Настройки"
        >
          <Icon name="Settings" size={18} />
        </button>
      </div>

      {/* Left Panel */}
      <div className="flex flex-col w-72 shrink-0 border-r" style={{ background: "var(--dark-panel)", borderColor: "rgba(168,85,247,0.12)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: "#a855f7", textShadow: "0 0 10px rgba(168,85,247,0.6)" }}>
              {activeTab === "chats" ? "ЧАТЫ" : activeTab === "channels" ? "КАНАЛЫ" : activeTab === "contacts" ? "КОНТАКТЫ" : activeTab === "games" ? "МИНИ-ИГРЫ" : "ИСТОРИИ"}
            </h2>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-purple-500/20" style={{ color: "#6b7280" }}>
                <Icon name="Plus" size={14} />
              </button>
              <button
                onClick={() => setRightPanel(rightPanel === "search" ? null : "search")}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ color: rightPanel === "search" ? "#a855f7" : "#6b7280", background: rightPanel === "search" ? "rgba(168,85,247,0.2)" : "transparent" }}
              >
                <Icon name="Search" size={14} />
              </button>
            </div>
          </div>
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Найти..."
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.2)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === "chats" && filteredContacts.map(c => (
            <div key={c.id} onClick={() => setActiveChat(c)}
              className={`sidebar-item p-3 flex items-center gap-3 ${activeChat?.id === c.id ? "active" : ""}`}>
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}>
                  {c.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${statusColor(c.status)}`}
                  style={{ borderColor: "var(--dark-panel)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate" style={{ color: "#e2e8f0" }}>{c.name}</span>
                  {c.tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 shrink-0"
                      style={{ background: c.tag === "HOT" ? "rgba(251,146,60,0.2)" : "rgba(168,85,247,0.2)", color: c.tag === "HOT" ? "#fb923c" : "#a855f7", border: `1px solid ${c.tag === "HOT" ? "rgba(251,146,60,0.4)" : "rgba(168,85,247,0.4)"}` }}>
                      {c.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs truncate" style={{ color: "#6b7280" }}>{c.lastMsg}</span>
                  {c.unread && c.unread > 0 ? (
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{ background: "#a855f7", color: "white" }}>
                      {c.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {activeTab === "channels" && channels.map(ch => (
            <div key={ch.id} className="sidebar-item p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                {ch.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate" style={{ color: "#e2e8f0" }}>{ch.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" }}>
                    {ch.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Icon name="Users" size={10} style={{ color: "#6b7280" }} />
                  <span className="text-xs" style={{ color: "#6b7280" }}>{ch.subs}</span>
                  <span className="text-xs" style={{ color: "#4b5563" }}>• {ch.lastPost}</span>
                </div>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-cyan-500/20 shrink-0"
                style={{ border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee" }}>
                <Icon name="Plus" size={12} />
              </button>
            </div>
          ))}

          {activeTab === "contacts" && contacts.map(c => (
            <div key={c.id} className="sidebar-item p-3 flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  {c.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${statusColor(c.status)}`}
                  style={{ borderColor: "var(--dark-panel)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>{c.name}</span>
                  <span className="text-xs font-orbitron" style={{ color: "#a855f7" }}>Lv.{c.level}</span>
                </div>
                <span className="text-xs" style={{ color: "#6b7280" }}>{statusLabel(c.status)}</span>
              </div>
            </div>
          ))}

          {activeTab === "games" && games.map(g => (
            <div key={g.id} onClick={() => setActiveGame(g.id === 1 ? g.id : null)}
              className="sidebar-item p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${g.color}22`, border: `1px solid ${g.color}44` }}>
                {g.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>{g.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${g.color}22`, color: g.color, border: `1px solid ${g.color}44` }}>
                    {g.players}p
                  </span>
                </div>
                <span className="text-xs" style={{ color: "#6b7280" }}>{g.desc}</span>
              </div>
            </div>
          ))}

          {activeTab === "stories" && (
            <div className="p-2">
              <p className="text-xs mb-3 px-1" style={{ color: "#6b7280" }}>Активные истории</p>
              <div className="grid grid-cols-3 gap-2">
                {stories.map(s => (
                  <button key={s.id} onClick={() => setActiveStory(s.id)} className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl relative"
                      style={{ background: `${s.color}22`, border: `2px solid ${s.hasNew ? s.color : "rgba(255,255,255,0.1)"}`, boxShadow: s.hasNew ? `0 0 10px ${s.color}66` : "none" }}>
                      {s.avatar}
                      {s.hasNew && (
                        <div className="absolute top-0 right-0 w-3 h-3 rounded-full animate-badge-pop"
                          style={{ background: s.color, border: "2px solid var(--dark-panel)" }} />
                      )}
                    </div>
                    <span className="text-[10px] truncate w-full text-center" style={{ color: "#9ca3af" }}>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat && (
          <div className="flex items-center px-5 py-3 border-b shrink-0" style={{ background: "var(--dark-card)", borderColor: "rgba(168,85,247,0.12)" }}>
            <div className="relative mr-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                {activeChat.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${statusColor(activeChat.status)}`}
                style={{ borderColor: "var(--dark-card)" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: "#e2e8f0" }}>{activeChat.name}</span>
                <span className="font-orbitron text-xs px-2 py-0.5 rounded"
                  style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>
                  LV.{activeChat.level}
                </span>
              </div>
              <span className="text-xs" style={{ color: "#6b7280" }}>{statusLabel(activeChat.status)}</span>
            </div>
            <div className="flex items-center gap-2">
              {["Phone", "Video", "Gamepad2", "MoreVertical"].map(icon => (
                <button key={icon} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-purple-500/10 transition-all" style={{ color: "#6b7280" }}>
                  <Icon name={icon} size={16} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--dark-bg)" }}>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {stories.slice(0, 4).map(s => (
              <button key={s.id} onClick={() => setActiveStory(s.id)} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${s.color}22`, border: `2px solid ${s.hasNew ? s.color : "rgba(255,255,255,0.1)"}`, boxShadow: s.hasNew ? `0 0 8px ${s.color}55` : "none" }}>
                  {s.avatar}
                </div>
                <span className="text-[9px]" style={{ color: "#9ca3af" }}>{s.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {activeTab === "games" && activeGame === 1 ? (
            <div className="flex justify-center">
              <div className="game-card p-6 w-72">
                <div className="text-center mb-4">
                  <h3 className="font-orbitron font-bold text-lg" style={{ color: "#a855f7" }}>❌ Крестики-нолики</h3>
                  <p className="text-sm mt-1" style={{ color: tttWinner ? "#4ade80" : "#22d3ee" }}>
                    {tttWinner ? (tttWinner === "Ничья" ? "🤝 Ничья!" : `🏆 Победил ${tttWinner}!`) : `Ход: ${tttTurn}`}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {tttBoard.map((cell, i) => (
                    <button key={i} onClick={() => handleTtt(i)}
                      className="w-full aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition-all"
                      style={{
                        background: cell ? (cell === "X" ? "rgba(168,85,247,0.3)" : "rgba(34,211,238,0.3)") : "rgba(255,255,255,0.05)",
                        border: `1px solid ${cell === "X" ? "rgba(168,85,247,0.5)" : cell === "O" ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.1)"}`,
                        color: cell === "X" ? "#a855f7" : "#22d3ee",
                        boxShadow: cell ? `0 0 10px ${cell === "X" ? "rgba(168,85,247,0.3)" : "rgba(34,211,238,0.3)"}` : "none",
                      }}>
                      {cell}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setTttBoard(Array(9).fill(null)); setTttTurn("X"); setTttWinner(null); }}
                  className="game-btn w-full py-2 text-sm">
                  Новая игра
                </button>
              </div>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`flex animate-msg-in ${msg.isMe ? "justify-end" : "justify-start"}`}>
                {!msg.isMe && msg.type !== "achievement" && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-2 shrink-0 mt-1"
                    style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {activeChat?.avatar}
                  </div>
                )}
                <div className={`max-w-xs ${msg.type === "achievement" ? "w-full" : ""}`}>
                  {msg.type === "achievement" ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl mx-auto w-fit"
                      style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}>
                      <span className="text-sm font-semibold" style={{ color: "#fbbf24" }}>{msg.text}</span>
                    </div>
                  ) : msg.type === "image" ? (
                    <div className={msg.isMe ? "chat-bubble-out p-1" : "chat-bubble-in p-1"}>
                      <img src={msg.img} alt="" className="w-48 h-32 object-cover rounded-xl" />
                    </div>
                  ) : msg.type === "sticker" ? (
                    <img src={msg.img} alt="sticker" className="w-24 h-24 rounded-2xl object-cover" />
                  ) : (
                    <div className={`px-4 py-2.5 ${msg.isMe ? "chat-bubble-out" : "chat-bubble-in"}`}>
                      <p className="text-sm" style={{ color: "#e2e8f0" }}>{msg.text}</p>
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? "justify-end" : ""}`}>
                    {msg.reactions?.map((r, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded-full cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {r}
                      </span>
                    ))}
                    <span className="text-[10px]" style={{ color: "#4b5563" }}>{msg.time}</span>
                    {msg.isMe && <Icon name="CheckCheck" size={12} style={{ color: "#22d3ee" }} />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t shrink-0" style={{ background: "var(--dark-card)", borderColor: "rgba(168,85,247,0.12)" }}>
          <div className="flex items-center gap-2">
            {["Smile", "Paperclip", "Image"].map(icon => (
              <button key={icon} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-purple-500/15" style={{ color: "#6b7280" }}>
                <Icon name={icon} size={18} />
              </button>
            ))}
            <div className="flex-1 relative">
              <input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Напиши сообщение..."
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }}
              />
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-purple-500/15" style={{ color: "#6b7280" }}>
              <Icon name="Mic" size={18} />
            </button>
            <button onClick={sendMessage}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: msgInput.trim() ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(168,85,247,0.15)",
                color: msgInput.trim() ? "white" : "#6b7280",
                boxShadow: msgInput.trim() ? "0 0 12px rgba(168,85,247,0.4)" : "none",
              }}>
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {rightPanel && (
        <div className="w-72 shrink-0 border-l flex flex-col animate-slide-in-right" style={{ background: "var(--dark-panel)", borderColor: "rgba(168,85,247,0.12)" }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(168,85,247,0.12)" }}>
            <h3 className="font-orbitron font-bold text-sm tracking-wider" style={{ color: "#a855f7" }}>
              {rightPanel === "profile" ? "МОЙ ПРОФИЛЬ" : rightPanel === "search" ? "ПОИСК" : "НАСТРОЙКИ"}
            </h3>
            <button onClick={() => setRightPanel(null)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "#6b7280" }}>
              <Icon name="X" size={14} />
            </button>
          </div>

          {rightPanel === "profile" && (
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl animate-float"
                    style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2))", border: "2px solid rgba(168,85,247,0.5)", boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}>
                    🚀
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center status-online border-2" style={{ borderColor: "var(--dark-panel)" }} />
                </div>
                <div className="text-center">
                  <p className="font-orbitron font-bold" style={{ color: "#e2e8f0" }}>КосмоГеймер</p>
                  <p className="text-xs mt-0.5" style={{ color: "#a855f7" }}>@cosmo_gamer</p>
                </div>
                <div className="flex gap-2">
                  {["🏆", "⚡", "🎯", "💎"].map((b, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm achievement-badge">{b}</div>
                  ))}
                </div>
              </div>

              <div className="game-card p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold" style={{ color: "#9ca3af" }}>Уровень</span>
                  <span className="font-orbitron font-bold text-sm" style={{ color: "#a855f7" }}>LV.42</span>
                </div>
                <div className="h-1.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="xp-bar h-1.5" style={{ width: "68%" }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: "#6b7280" }}>6,800 XP</span>
                  <span className="text-[10px]" style={{ color: "#6b7280" }}>10,000 XP</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Сообщений", value: "12,483", icon: "MessageCircle", color: "#a855f7" },
                  { label: "Побед", value: "847", icon: "Trophy", color: "#fbbf24" },
                  { label: "Друзей", value: "156", icon: "Users", color: "#22d3ee" },
                  { label: "Каналов", value: "23", icon: "Radio", color: "#4ade80" },
                ].map(s => (
                  <div key={s.label} className="game-card p-3 text-center">
                    <Icon name={s.icon} size={16} style={{ color: s.color, margin: "0 auto 4px" }} />
                    <p className="font-orbitron font-bold text-sm" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="game-card p-3 space-y-1">
                <p className="text-xs font-semibold mb-2" style={{ color: "#9ca3af" }}>Статус</p>
                {["🎮 В игре", "🟢 Онлайн", "💤 Не беспокоить", "👻 Невидимый"].map((st, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-purple-500/10"
                    style={{ color: i === 0 ? "#a855f7" : "#9ca3af" }}>
                    {st}
                    {i === 0 && <span className="float-right text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rightPanel === "search" && (
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
                <input placeholder="Поиск по всему..." className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(168,85,247,0.25)", color: "#e2e8f0", fontFamily: "'Rubik', sans-serif" }} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold px-2 mb-2" style={{ color: "#6b7280" }}>КАТЕГОРИИ</p>
                {[
                  { label: "Сообщения", icon: "MessageCircle" },
                  { label: "Контакты", icon: "Users" },
                  { label: "Медиа", icon: "Image" },
                  { label: "Файлы", icon: "File" },
                  { label: "Ссылки", icon: "Link" },
                ].map(cat => (
                  <button key={cat.label} className="sidebar-item w-full px-3 py-2.5 flex items-center gap-3 text-sm text-left" style={{ color: "#9ca3af" }}>
                    <Icon name={cat.icon} size={16} style={{ color: "#6b7280" }} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {rightPanel === "settings" && (
            <div className="p-4 space-y-2 overflow-y-auto">
              {[
                { icon: "Bell", label: "Уведомления", sub: "Настройка звуков" },
                { icon: "Lock", label: "Приватность", sub: "Кто видит мой профиль" },
                { icon: "Palette", label: "Темы", sub: "Игровые темы и цвета" },
                { icon: "Shield", label: "Безопасность", sub: "Двухфактор, сессии" },
                { icon: "Volume2", label: "Звук", sub: "Звуки уведомлений" },
                { icon: "Smartphone", label: "Устройства", sub: "Управление сессиями" },
              ].map(s => (
                <button key={s.label} className="sidebar-item w-full px-3 py-3 flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    <Icon name={s.icon} size={15} style={{ color: "#a855f7" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{s.label}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{s.sub}</p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="ml-auto shrink-0" style={{ color: "#4b5563" }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Story overlay */}
      {activeStory && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setActiveStory(null)}>
          <div className="w-80 h-[500px] rounded-3xl overflow-hidden relative animate-scale-in"
            style={{ border: "2px solid rgba(168,85,247,0.5)", boxShadow: "0 0 40px rgba(168,85,247,0.3)" }}
            onClick={e => e.stopPropagation()}>
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2), rgba(74,222,128,0.15))" }}>
              <div className="text-6xl animate-float mb-4">
                {stories.find(s => s.id === activeStory)?.avatar}
              </div>
              <p className="font-orbitron font-bold text-xl" style={{ color: "#e2e8f0" }}>
                {stories.find(s => s.id === activeStory)?.name}
              </p>
              <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>История активна 4 ч</p>
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full"
                    style={{ background: i === 1 ? "#a855f7" : "rgba(255,255,255,0.2)" }} />
                ))}
              </div>
              <button onClick={() => setActiveStory(null)}
                className="absolute top-6 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}