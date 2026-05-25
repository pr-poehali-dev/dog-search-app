import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/b7f3182f-e86b-4189-bd75-ea609bcaba2c/files/7f71c90d-a94b-4edb-814e-44e6956396a5.jpg";

const DOG_AVATARS = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop",
];

const DISTRICTS = ["Митино", "Строгино", "Крылатское", "Кунцево", "Хорошёво", "Мякинино", "Щукино", "Тушино", "Химки", "Одинцово"];

type AdType = { id: number; type: "lost" | "found"; name: string; breed: string; age: string; district: string; date: string; description: string; photo: string; reward: string | null; contact: string; ownerId?: string; resolved?: boolean };

const INITIAL_ADS: AdType[] = [
  { id: 1, type: "lost", name: "Барон", breed: "Лабрадор", age: "3 года", district: "Митино", date: "22 мая", description: "Светло-рыжий лабрадор, без ошейника. Убежал во время прогулки в парке.", photo: DOG_AVATARS[0], reward: "10 000 ₽", contact: "Алёна" },
  { id: 2, type: "found", name: "Неизвестна", breed: "Похожа на хаски", age: "~2 года", district: "Строгино", date: "23 мая", description: "Нашла собаку у метро, синие глаза, очень дружелюбная.", photo: DOG_AVATARS[1], reward: null, contact: "Марина" },
  { id: 3, type: "lost", name: "Пуговка", breed: "Той-терьер", age: "5 лет", district: "Крылатское", date: "20 мая", description: "Маленькая рыжая собачка, в красном свитере. Отзывается на имя.", photo: DOG_AVATARS[2], reward: "5 000 ₽", contact: "Сергей" },
  { id: 4, type: "found", name: "Неизвестен", breed: "Дворняга", age: "~1 год", district: "Хорошёво", date: "24 мая", description: "Молодой пёс, чёрно-белый окрас. Сидит у подъезда уже второй день.", photo: DOG_AVATARS[3], reward: null, contact: "Дмитрий" },
  { id: 5, type: "lost", name: "Граф", breed: "Немецкая овчарка", age: "4 года", district: "Кунцево", date: "21 мая", description: "Крупная овчарка, чёрно-рыжий окрас. В ошейнике с адресником, но убежал.", photo: DOG_AVATARS[4], reward: "15 000 ₽", contact: "Виктор" },
  { id: 6, type: "found", name: "Неизвестна", breed: "Шпиц", age: "~3 года", district: "Мякинино", date: "23 мая", description: "Белый пушистый шпиц, очень ухоженный. Явно домашняя.", photo: DOG_AVATARS[5], reward: null, contact: "Ольга" },
];

const tips = [
  { icon: "🔍", title: "Первые 24 часа", text: "Обойдите район в радиусе 1 км. Собаки часто прячутся недалеко от места побега.", color: "#FBE8C8" },
  { icon: "📢", title: "Оповестите всех", text: "Свяжитесь с ветклиниками, приютами и волонтёрами в своём районе.", color: "#E6F5ED" },
  { icon: "🌙", title: "Поиск ночью", text: "Возьмите фонарик и любимое лакомство. Ночью собаки спокойнее реагируют на зов.", color: "#FDEAEA" },
  { icon: "📸", title: "Хорошее фото", text: "Используйте свежие чёткие фото — анфас и сбоку. Это ускорит опознавание.", color: "#EEF2FF" },
  { icon: "🏘️", title: "Обход дворов", text: "Разговаривайте с дворниками, консьержами — они многое видят и запоминают.", color: "#FFF8E6" },
  { icon: "🤝", title: "Волонтёры", text: "Не отказывайтесь от помощи. Чем больше людей ищут — тем выше шанс.", color: "#F0FFF4" },
];

const INIT_MESSAGES: Record<number, { id: number; from: string; text: string; time: string }[]> = {
  1: [
    { id: 1, from: "other", text: "Здравствуйте! Я нашла вашего Барона в парке Митино 🐕", time: "14:32" },
    { id: 2, from: "me", text: "Правда?! Расскажите подробнее, пожалуйста!", time: "14:33" },
    { id: 3, from: "other", text: "Да, он сидел у фонтана. Светло-рыжий, без ошейника — точь-в-точь ваш!", time: "14:34" },
  ],
  2: [
    { id: 1, from: "other", text: "Добрый день, это ваша собака?", time: "10:10" },
    { id: 2, from: "me", text: "Нет, у меня нет хаски. Но готова помочь!", time: "10:12" },
  ],
};

type Page = "home" | "search" | "create" | "map" | "tips" | "my" | "profile" | "chat";

type Profile = { name: string; email: string; phone: string; district: string; helped: number };

function Toast({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm animate-fade-in-up"
      style={{ background: "#4A9B6F", color: "white", minWidth: 220, textAlign: "center" }}>
      {text}
      <button onClick={onClose} className="ml-3 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

function AdCard({
  ad, delay, onChat, isOwn, onResolve, onDelete
}: {
  ad: AdType; delay: number; onChat: () => void;
  isOwn?: boolean; onResolve?: () => void; onDelete?: () => void;
}) {
  return (
    <div className="card-warm p-4 animate-fade-in-up" style={{ animationDelay: `${delay * 0.07}s`, animationFillMode: "both", opacity: ad.resolved ? 0.6 : 1 }}>
      <div className="flex gap-3">
        <img src={ad.photo} alt={ad.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {ad.resolved ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E6F5ED", color: "#4A9B6F", border: "1px solid #B0DBBF" }}>✅ Нашлась</span>
            ) : (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ad.type === "lost" ? "tag-lost" : "tag-found"}`}>
                {ad.type === "lost" ? "Потерялась" : "Найдена"}
              </span>
            )}
            <span className="text-xs" style={{ color: "#A0855A" }}>{ad.date}</span>
          </div>
          <h3 className="font-bold" style={{ color: "#4A3020" }}>{ad.name}</h3>
          <p className="text-xs" style={{ color: "#A0855A" }}>{ad.breed} · {ad.age} · {ad.district}</p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "#6B5040" }}>{ad.description}</p>
          {ad.reward && <p className="text-xs font-bold mt-1" style={{ color: "#E8821A" }}>💰 Вознаграждение: {ad.reward}</p>}
        </div>
      </div>
      {isOwn ? (
        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #F0E0C8" }}>
          {!ad.resolved && (
            <button onClick={onResolve} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: "#E6F5ED", color: "#4A9B6F" }}>
              ✅ Нашлась!
            </button>
          )}
          <button onClick={onDelete} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "#FDEAEA", color: "#C84B4B" }}>
            Удалить
          </button>
        </div>
      ) : (
        !ad.resolved && (
          <button onClick={onChat} className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01]"
            style={{ background: "#FBE8C8", color: "#8B5E3C" }}>
            💬 Написать {ad.contact}
          </button>
        )
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [ads, setAds] = useState<AdType[]>(INITIAL_ADS);
  const [filterType, setFilterType] = useState<"all" | "lost" | "found">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createType, setCreateType] = useState<"lost" | "found">("lost");
  const [chatOpen, setChatOpen] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState(INIT_MESSAGES);
  const [mapFilter, setMapFilter] = useState<"all" | "lost" | "found">("all");
  const [selectedDot, setSelectedDot] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState<Profile>({ name: "Алексей Петров", email: "alex@example.com", phone: "+7 900 000 00 00", district: "Митино", helped: 3 });
  const [profileDraft, setProfileDraft] = useState<Profile>(profile);

  // Create form state
  const [form, setForm] = useState({ name: "", breed: "", age: "", district: "", date: "", description: "", reward: "", contact: "" });
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 3000);
  };

  const today = new Date().toLocaleDateString("ru", { day: "numeric", month: "long" });

  const filteredAds = ads.filter(ad => {
    const matchType = filterType === "all" || ad.type === filterType;
    const matchSearch = searchQuery === "" ||
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const myAds = ads.filter(ad => ad.ownerId === "me");

  const handlePublish = () => {
    if (!form.name.trim() || !form.breed.trim() || !form.district) {
      showToast("⚠️ Заполните кличку, породу и район");
      return;
    }
    const newAd: AdType = {
      id: Date.now(),
      type: createType,
      name: form.name || "Неизвестен",
      breed: form.breed,
      age: form.age || "неизвестен",
      district: form.district,
      date: today,
      description: form.description,
      photo: formPhoto || DOG_AVATARS[Math.floor(Math.random() * DOG_AVATARS.length)],
      reward: form.reward || null,
      contact: profile.name,
      ownerId: "me",
    };
    setAds(prev => [newAd, ...prev]);
    setForm({ name: "", breed: "", age: "", district: "", date: "", description: "", reward: "", contact: "" });
    setFormPhoto(null);
    showToast("🐾 Объявление опубликовано!");
    setPage("my");
  };

  const handleResolve = (id: number) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    showToast("🎉 Отлично! Рады за вас!");
  };

  const handleDelete = (id: number) => {
    setAds(prev => prev.filter(a => a.id !== id));
    showToast("🗑️ Объявление удалено");
  };

  const sendMessage = () => {
    if (!newMessage.trim() || chatOpen === null) return;
    const time = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    setAllMessages(prev => ({
      ...prev,
      [chatOpen]: [...(prev[chatOpen] || []), { id: Date.now(), from: "me", text: newMessage, time }]
    }));
    setNewMessage("");
  };

  const saveProfile = () => {
    setProfile(profileDraft);
    setEditingProfile(false);
    showToast("✅ Профиль сохранён");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setFormPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const mapDots = ads.slice(0, 8).map((ad, i) => ({
    x: 15 + ((i * 47 + 13) % 70),
    y: 15 + ((i * 31 + 21) % 65),
    type: ad.type,
    name: ad.name,
    district: ad.district,
    id: ad.id,
  }));

  const currentMessages = chatOpen !== null ? (allMessages[chatOpen] || []) : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FDF6EC" }}>
      {toast && <Toast text={toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <header className="sticky top-0 z-40" style={{ background: "rgba(253,246,236,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F0E0C8" }}>
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-caveat text-2xl font-bold" style={{ color: "#E8821A" }}>ПёсПоиск</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => { setChatOpen(null); setPage("chat"); }} className="relative p-2 rounded-xl hover:bg-amber-100 transition-colors" style={{ color: "#8B5E3C" }}>
              <Icon name="MessageCircle" size={22} />
              {Object.keys(allMessages).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#E8821A" }}></span>
              )}
            </button>
            <button onClick={() => setPage("profile")} className="p-2 rounded-xl hover:bg-amber-100 transition-colors" style={{ color: "#8B5E3C" }}>
              <Icon name="User" size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-24">

        {/* HOME */}
        {page === "home" && (
          <div>
            <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ height: 220 }}>
              <img src={HERO_IMAGE} alt="ПёсПоиск" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,10,0,0.65) 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-caveat text-3xl font-bold text-white mb-1">Найдём вместе 🐾</p>
                <p className="text-sm text-white/80">Единая база потерявшихся и найденных собак</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mx-4 mt-4">
              {[
                { num: ads.length.toString(), label: "объявлений", icon: "📋" },
                { num: ads.filter(a => a.resolved).length.toString(), label: "нашлись", icon: "🏠" },
                { num: ads.filter(a => a.type === "lost" && !a.resolved).length.toString(), label: "ищут сейчас", icon: "🔍" },
              ].map((s, i) => (
                <div key={i} className="card-warm p-3 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-bold text-lg" style={{ color: "#E8821A" }}>{s.num}</div>
                  <div className="text-xs" style={{ color: "#A0855A" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
              <button onClick={() => { setCreateType("lost"); setPage("create"); }}
                className="p-4 rounded-2xl font-semibold text-white flex flex-col items-start gap-2 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #C84B4B, #E06060)" }}>
                <span className="text-2xl">😢</span>
                <span className="text-base">Я потерял</span>
                <span className="text-xs opacity-80 font-normal">Создать объявление о пропаже</span>
              </button>
              <button onClick={() => { setCreateType("found"); setPage("create"); }}
                className="p-4 rounded-2xl font-semibold text-white flex flex-col items-start gap-2 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #4A9B6F, #62B885)" }}>
                <span className="text-2xl">🐕</span>
                <span className="text-base">Я нашёл</span>
                <span className="text-xs opacity-80 font-normal">Помочь найти хозяина</span>
              </button>
            </div>

            <div className="mx-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg" style={{ color: "#4A3020" }}>Последние объявления</h2>
                <button onClick={() => setPage("search")} className="text-sm font-medium" style={{ color: "#E8821A" }}>Все →</button>
              </div>
              <div className="space-y-3">
                {ads.slice(0, 4).map((ad, i) => (
                  <AdCard key={ad.id} ad={ad} delay={i}
                    isOwn={ad.ownerId === "me"}
                    onChat={() => { setChatOpen(ad.id); setPage("chat"); }}
                    onResolve={() => handleResolve(ad.id)}
                    onDelete={() => handleDelete(ad.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCH */}
        {page === "search" && (
          <div className="px-4 pt-4">
            <h1 className="font-bold text-2xl mb-4" style={{ color: "#4A3020" }}>Поиск объявлений</h1>
            <div className="relative mb-4">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#A0855A" }} />
              <input type="text" placeholder="Порода, район, кличка..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl outline-none text-sm font-medium"
                style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
            </div>
            <div className="flex gap-2 mb-5">
              {(["all", "lost", "found"] as const).map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: filterType === t ? "#E8821A" : "#FBE8C8", color: filterType === t ? "white" : "#8B5E3C" }}>
                  {t === "all" ? "Все" : t === "lost" ? "😢 Потерялись" : "🐕 Найденные"}
                </button>
              ))}
            </div>
            {filteredAds.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🔍</span>
                <p className="font-semibold" style={{ color: "#8B5E3C" }}>Ничего не найдено</p>
                <p className="text-sm mt-1" style={{ color: "#A0855A" }}>Попробуйте изменить запрос</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAds.map((ad, i) => (
                  <AdCard key={ad.id} ad={ad} delay={i}
                    isOwn={ad.ownerId === "me"}
                    onChat={() => { setChatOpen(ad.id); setPage("chat"); }}
                    onResolve={() => handleResolve(ad.id)}
                    onDelete={() => handleDelete(ad.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREATE */}
        {page === "create" && (
          <div className="px-4 pt-4 pb-6">
            <h1 className="font-bold text-2xl mb-1" style={{ color: "#4A3020" }}>Новое объявление</h1>
            <p className="text-sm mb-5" style={{ color: "#A0855A" }}>Заполните данные, чтобы другие могли помочь</p>

            <div className="flex gap-3 mb-5">
              <button onClick={() => setCreateType("lost")} className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{ background: createType === "lost" ? "#C84B4B" : "#FDEAEA", color: createType === "lost" ? "white" : "#C84B4B" }}>
                😢 Потерял
              </button>
              <button onClick={() => setCreateType("found")} className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{ background: createType === "found" ? "#4A9B6F" : "#E6F5ED", color: createType === "found" ? "white" : "#4A9B6F" }}>
                🐕 Нашёл
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo upload */}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div onClick={() => fileRef.current?.click()}
                className="card-warm p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-amber-50 transition-colors"
                style={{ minHeight: 120, borderStyle: "dashed", borderWidth: 2, borderColor: "#E8C48A" }}>
                {formPhoto ? (
                  <img src={formPhoto} alt="preview" className="w-full h-32 object-cover rounded-xl" />
                ) : (
                  <>
                    <span className="text-3xl">📸</span>
                    <p className="font-semibold text-sm" style={{ color: "#8B5E3C" }}>Добавить фото</p>
                    <p className="text-xs" style={{ color: "#A0855A" }}>Нажмите, чтобы выбрать из галереи</p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Кличка собаки</label>
                <input type="text" placeholder={createType === "lost" ? "Барон" : "Неизвестна"}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Порода <span style={{ color: "#C84B4B" }}>*</span></label>
                <input type="text" placeholder="Лабрадор, хаски, дворняга..."
                  value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Возраст</label>
                <input type="text" placeholder="3 года"
                  value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                  style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Район <span style={{ color: "#C84B4B" }}>*</span></label>
                <select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none appearance-none"
                  style={{ background: "white", border: "1.5px solid #F0E0C8", color: form.district ? "#4A3020" : "#A0855A" }}>
                  <option value="">Выберите район</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Описание</label>
                <textarea placeholder="Особые приметы, одежда, поведение..." rows={3}
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
              </div>
              {createType === "lost" && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#4A3020" }}>Вознаграждение (необязательно)</label>
                  <input type="text" placeholder="10 000 ₽"
                    value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "white", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
                </div>
              )}

              <div className="card-warm p-3 flex items-center gap-3" style={{ background: "#FBE8C8" }}>
                <span className="text-lg">👤</span>
                <div>
                  <p className="text-xs" style={{ color: "#8B5E3C" }}>Публикуется от имени</p>
                  <p className="font-semibold text-sm" style={{ color: "#4A3020" }}>{profile.name} · {profile.phone}</p>
                </div>
              </div>

              <button onClick={handlePublish}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: createType === "lost" ? "linear-gradient(135deg, #C84B4B, #E06060)" : "linear-gradient(135deg, #4A9B6F, #62B885)" }}>
                {createType === "lost" ? "😢 Опубликовать объявление о пропаже" : "🐕 Опубликовать объявление о находке"}
              </button>
            </div>
          </div>
        )}

        {/* MAP */}
        {page === "map" && (
          <div className="px-4 pt-4">
            <h1 className="font-bold text-2xl mb-1" style={{ color: "#4A3020" }}>Карта объявлений</h1>
            <p className="text-sm mb-4" style={{ color: "#A0855A" }}>Нажмите на метку для подробностей</p>
            <div className="flex gap-2 mb-4">
              {(["all", "lost", "found"] as const).map(t => (
                <button key={t} onClick={() => setMapFilter(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: mapFilter === t ? "#E8821A" : "#FBE8C8", color: mapFilter === t ? "white" : "#8B5E3C" }}>
                  {t === "all" ? "Все" : t === "lost" ? "😢 Потерялись" : "🐕 Найденные"}
                </button>
              ))}
            </div>
            <div className="card-warm relative overflow-hidden" style={{ height: 380 }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 50%, #FFF8E1 100%)" }}>
                <svg width="100%" height="100%" className="absolute inset-0 opacity-30">
                  <line x1="0" y1="40%" x2="100%" y2="38%" stroke="#90A4AE" strokeWidth="3" />
                  <line x1="0" y1="65%" x2="100%" y2="63%" stroke="#90A4AE" strokeWidth="2" />
                  <line x1="30%" y1="0" x2="32%" y2="100%" stroke="#90A4AE" strokeWidth="3" />
                  <line x1="60%" y1="0" x2="58%" y2="100%" stroke="#90A4AE" strokeWidth="2" />
                  <line x1="0" y1="20%" x2="100%" y2="22%" stroke="#B0BEC5" strokeWidth="1" />
                  <line x1="15%" y1="0" x2="17%" y2="100%" stroke="#B0BEC5" strokeWidth="1" />
                  <rect x="5%" y="10%" width="20%" height="12%" rx="4" fill="#C8E6C9" opacity="0.6" />
                  <rect x="62%" y="50%" width="15%" height="18%" rx="4" fill="#C8E6C9" opacity="0.6" />
                </svg>
                {mapDots.filter(d => mapFilter === "all" || d.type === mapFilter).map((dot, i) => (
                  <button key={i} onClick={() => setSelectedDot(selectedDot === i ? null : i)}
                    className="absolute transition-all"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%, -50%)" }}>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-lg border-2 border-white transition-transform hover:scale-110"
                        style={{ background: dot.type === "lost" ? "#C84B4B" : "#4A9B6F" }}>
                        {dot.type === "lost" ? "😢" : "🐕"}
                      </div>
                      {selectedDot === i && (
                        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-3 min-w-[140px] z-10"
                          style={{ border: "1px solid #F0E0C8" }}>
                          <p className="font-bold text-sm" style={{ color: "#4A3020" }}>{dot.name}</p>
                          <p className="text-xs" style={{ color: "#A0855A" }}>{dot.district}</p>
                          <button onClick={() => { setChatOpen(dot.id); setPage("chat"); }}
                            className="mt-2 w-full py-1.5 rounded-lg text-xs font-semibold"
                            style={{ background: "#FBE8C8", color: "#8B5E3C" }}>
                            💬 Написать
                          </button>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
                <button className="w-8 h-8 card-warm flex items-center justify-center font-bold text-lg" style={{ color: "#8B5E3C" }}>+</button>
                <button className="w-8 h-8 card-warm flex items-center justify-center font-bold text-lg" style={{ color: "#8B5E3C" }}>−</button>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs" style={{ color: "#8B5E3C" }}>Потерялись</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: "#4A9B6F" }}></div><span className="text-xs" style={{ color: "#8B5E3C" }}>Найденные</span></div>
            </div>
          </div>
        )}

        {/* TIPS */}
        {page === "tips" && (
          <div className="px-4 pt-4">
            <h1 className="font-bold text-2xl mb-1" style={{ color: "#4A3020" }}>Советы по поиску</h1>
            <p className="text-sm mb-5" style={{ color: "#A0855A" }}>Руководства от опытных волонтёров</p>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="card-warm p-4 flex gap-4 items-start animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
                  <div className="text-3xl w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: tip.color }}>{tip.icon}</div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: "#4A3020" }}>{tip.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6B5040" }}>{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-warm p-5 mt-4" style={{ background: "linear-gradient(135deg, #FBE8C8, #FFF3E0)" }}>
              <p className="font-caveat text-xl font-bold mb-2" style={{ color: "#8B5E3C" }}>Нужна помощь волонтёра?</p>
              <p className="text-sm mb-3" style={{ color: "#6B5040" }}>Наши волонтёры помогут организовать поиск и дадут персональный совет.</p>
              <button onClick={() => { setChatOpen(1); setPage("chat"); }}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: "#E8821A", color: "white" }}>
                Связаться с волонтёром
              </button>
            </div>
          </div>
        )}

        {/* MY ADS */}
        {page === "my" && (
          <div className="px-4 pt-4">
            <h1 className="font-bold text-2xl mb-1" style={{ color: "#4A3020" }}>Мои объявления</h1>
            <p className="text-sm mb-5" style={{ color: "#A0855A" }}>История ваших публикаций</p>
            {myAds.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">📋</span>
                <p className="font-semibold" style={{ color: "#8B5E3C" }}>Пока нет объявлений</p>
                <p className="text-sm mt-1 mb-5" style={{ color: "#A0855A" }}>Создайте первое объявление</p>
                <button onClick={() => setPage("create")} className="px-6 py-3 rounded-2xl font-semibold text-sm"
                  style={{ background: "#E8821A", color: "white" }}>
                  + Создать объявление
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {myAds.map((ad, i) => (
                    <AdCard key={ad.id} ad={ad} delay={i} isOwn
                      onChat={() => { setChatOpen(ad.id); setPage("chat"); }}
                      onResolve={() => handleResolve(ad.id)}
                      onDelete={() => handleDelete(ad.id)}
                    />
                  ))}
                </div>
                <div className="text-center py-6">
                  <button onClick={() => setPage("create")} className="px-6 py-3 rounded-2xl font-semibold text-sm"
                    style={{ background: "#E8821A", color: "white" }}>
                    + Новое объявление
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-bold text-2xl" style={{ color: "#4A3020" }}>Профиль</h1>
              <button onClick={() => { setEditingProfile(!editingProfile); setProfileDraft(profile); }}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: editingProfile ? "#FDEAEA" : "#FBE8C8", color: editingProfile ? "#C84B4B" : "#8B5E3C" }}>
                {editingProfile ? "Отмена" : "✏️ Изменить"}
              </button>
            </div>

            <div className="card-warm p-5 mb-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "#FBE8C8" }}>🐾</div>
              <div className="flex-1 min-w-0">
                {editingProfile ? (
                  <input value={profileDraft.name} onChange={e => setProfileDraft(d => ({ ...d, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-base font-bold outline-none mb-1"
                    style={{ background: "#FDF6EC", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
                ) : (
                  <h2 className="font-bold text-lg" style={{ color: "#4A3020" }}>{profile.name}</h2>
                )}
                <p className="text-sm" style={{ color: "#A0855A" }}>{profile.email}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: "#E8821A" }}>🏆 Помог {profile.helped} собакам найти дом</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[{ num: myAds.length.toString(), label: "Объявления" }, { num: Object.keys(allMessages).length.toString(), label: "Диалогов" }, { num: myAds.filter(a => a.resolved).length.toString(), label: "Нашлось" }].map((s, i) => (
                <div key={i} className="card-warm p-3 text-center">
                  <div className="font-bold text-xl" style={{ color: "#E8821A" }}>{s.num}</div>
                  <div className="text-xs" style={{ color: "#A0855A" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {editingProfile ? (
              <div className="space-y-3 mb-4">
                {[
                  { label: "Телефон", field: "phone" as const, placeholder: "+7 900 000 00 00" },
                  { label: "Email", field: "email" as const, placeholder: "email@example.com" },
                ].map(item => (
                  <div key={item.field} className="card-warm p-4">
                    <label className="block text-xs font-semibold mb-2" style={{ color: "#A0855A" }}>{item.label}</label>
                    <input value={profileDraft[item.field]}
                      onChange={e => setProfileDraft(d => ({ ...d, [item.field]: e.target.value }))}
                      placeholder={item.placeholder}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: "#FDF6EC", border: "1.5px solid #F0E0C8", color: "#4A3020" }} />
                  </div>
                ))}
                <div className="card-warm p-4">
                  <label className="block text-xs font-semibold mb-2" style={{ color: "#A0855A" }}>Район</label>
                  <select value={profileDraft.district} onChange={e => setProfileDraft(d => ({ ...d, district: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none appearance-none"
                    style={{ background: "#FDF6EC", border: "1.5px solid #F0E0C8", color: "#4A3020" }}>
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <button onClick={saveProfile}
                  className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: "#E8821A", color: "white" }}>
                  ✅ Сохранить изменения
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { icon: "Bell", label: "Уведомления", desc: "Новые совпадения в вашем районе" },
                  { icon: "MapPin", label: "Мой район", desc: profile.district },
                  { icon: "Phone", label: "Контакт", desc: profile.phone },
                  { icon: "Shield", label: "Безопасность", desc: "Изменить пароль" },
                  { icon: "HelpCircle", label: "Помощь", desc: "Вопросы и ответы" },
                ].map((item, i) => (
                  <button key={i} className="card-warm w-full p-4 flex items-center gap-3 hover:bg-amber-50 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#FBE8C8" }}>
                      <Icon name={item.icon} fallback="CircleAlert" size={18} style={{ color: "#E8821A" }} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm" style={{ color: "#4A3020" }}>{item.label}</div>
                      <div className="text-xs" style={{ color: "#A0855A" }}>{item.desc}</div>
                    </div>
                    <Icon name="ChevronRight" size={16} style={{ color: "#C0A080" }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {page === "chat" && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
            <div className="px-4 pt-4 pb-2 flex-shrink-0" style={{ borderBottom: "1px solid #F0E0C8" }}>
              <div className="flex items-center gap-3 mb-1">
                {chatOpen !== null && (
                  <button onClick={() => setChatOpen(null)} className="p-1" style={{ color: "#E8821A" }}>
                    <Icon name="ArrowLeft" size={20} />
                  </button>
                )}
                <h1 className="font-bold text-xl" style={{ color: "#4A3020" }}>
                  {chatOpen === null ? "Сообщения" : (ads.find(a => a.id === chatOpen)?.contact ?? "Чат")}
                </h1>
              </div>
              {chatOpen !== null && (
                <p className="text-xs pl-8" style={{ color: "#A0855A" }}>
                  по объявлению: {ads.find(a => a.id === chatOpen)?.name} · {ads.find(a => a.id === chatOpen)?.district}
                </p>
              )}
            </div>

            {chatOpen === null ? (
              <div className="px-4 pt-3 space-y-2 overflow-y-auto flex-1">
                {ads.filter(ad => allMessages[ad.id]?.length > 0).length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-5xl block mb-3">💬</span>
                    <p className="font-semibold" style={{ color: "#8B5E3C" }}>Нет сообщений</p>
                    <p className="text-sm mt-1" style={{ color: "#A0855A" }}>Нажмите «Написать» в объявлении</p>
                  </div>
                ) : (
                  ads.filter(ad => allMessages[ad.id]?.length > 0).map(ad => {
                    const msgs = allMessages[ad.id];
                    const last = msgs[msgs.length - 1];
                    return (
                      <button key={ad.id} onClick={() => setChatOpen(ad.id)}
                        className="card-warm w-full p-3 flex items-center gap-3 hover:bg-amber-50 transition-colors">
                        <img src={ad.photo} alt={ad.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-sm" style={{ color: "#4A3020" }}>{ad.contact}</div>
                          <div className="text-xs truncate" style={{ color: "#A0855A" }}>{last.text}</div>
                        </div>
                        <div className="text-xs flex-shrink-0" style={{ color: "#A0855A" }}>{last.time}</div>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {currentMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] px-4 py-3 text-sm ${msg.from === "me" ? "chat-bubble-out" : "chat-bubble-in"}`}>
                        <p style={{ color: msg.from === "me" ? "white" : "#4A3020" }}>{msg.text}</p>
                        <p className="text-xs mt-1 text-right" style={{ color: msg.from === "me" ? "rgba(255,255,255,0.7)" : "#A0855A" }}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 flex gap-2 flex-shrink-0" style={{ borderTop: "1px solid #F0E0C8" }}>
                  <input type="text" value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Написать сообщение..."
                    className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "#FBE8C8", color: "#4A3020" }} />
                  <button onClick={sendMessage}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{ background: "#E8821A" }}>
                    <Icon name="Send" size={18} style={{ color: "white" }} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40"
        style={{ background: "rgba(253,246,236,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid #F0E0C8" }}>
        <div className="flex items-center justify-around px-2 py-2 max-w-2xl mx-auto">
          {[
            { id: "home", icon: "Home", label: "Главная" },
            { id: "search", icon: "Search", label: "Поиск" },
            { id: "create", icon: "PlusCircle", label: "Создать" },
            { id: "map", icon: "Map", label: "Карта" },
            { id: "tips", icon: "BookOpen", label: "Советы" },
            { id: "my", icon: "FileText", label: "Мои" },
          ].map(item => (
            <button key={item.id} onClick={() => setPage(item.id as Page)} className={`nav-item ${page === item.id ? "active" : ""}`}>
              <Icon name={item.icon} fallback="Home" size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
