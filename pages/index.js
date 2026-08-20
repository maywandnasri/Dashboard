import { useEffect, useState } from "react";

const REMINDERS = [
'Verily, with hardship comes ease. Surah Ash-Sharh, 94:6',
'The best of you are those who are best to their families.',
'Whoever is not thankful for small things will not be thankful for big things.',
'Speak good or remain silent.',
'Allah does not burden a soul beyond what it can bear.',
'The strong is not the one who overcomes people by his strength, but the one who controls himself when angry.',
'A good word is charity.',
'Do not lose hope, nor be sad.',
'Verily, in the remembrance of Allah do hearts find rest.',
'The best charity is that given when one is in need and struggling.',
'Smiling at your brother is charity.',
'Whoever helps ease a difficulty, Allah will ease a difficulty for them in this life and the next.',
'Modesty brings nothing except good.',
'The most beloved deeds to Allah are those done consistently, even if small.',
'Make things easy, not difficult, and cheer people up.',
'Trust in Allah, but tie your camel.',
'None of you truly believes until he loves for his brother what he loves for himself.',
'Actions are judged by intentions.',
'The world is a prison for the believer and a paradise for the disbeliever.',
'Whoever guarantees me what is between his jaws and what is between his legs, I guarantee him Paradise.',
'A believer is affair is amazing, all of it is good.',
'Patience is light.',
'Allah loves those who are patient.',
'Kindness is a mark of faith.',
'Every good deed is charity.',
'The believer keeps on doing good even if disaster befalls him.',
'Seeking knowledge is a path to Paradise.',
'Whoever plants a tree and it bears fruit, its reward continues.',
'Gentleness is never put in anything except that it beautifies it.',
'Fear Allah wherever you are.'
];

export default function Home() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [weekOffset, setWeekOffset] = useState(0);

useEffect(() => {
fetch("/api/data")
.then((r) => r.json())
.then((d) => { setData(d); setLoading(false); })
.catch(() => setLoading(false));
}, []);

const bank = data?.bank;
const calendar = data?.calendar;

const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const todayReminder = REMINDERS[dayOfYear % REMINDERS.length];

const days = [];
const base = new Date();
base.setHours(0, 0, 0, 0);
base.setDate(base.getDate() + weekOffset * 7);
for (let i = 0; i < 7; i++) {
const d = new Date(base);
d.setDate(base.getDate() + i);
days.push(d);
}

const eventsForDay = (day) => {
if (!calendar?.events) return [];
return calendar.events.filter((e) => {
const eDate = new Date(e.start);
return (
eDate.getFullYear() === day.getFullYear() &&
eDate.getMonth() === day.getMonth() &&
eDate.getDate() === day.getDate()
);
});
};

const formatTime = (iso) => {
if (!iso || !iso.includes("T")) return "All day";
return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const formatMoney = (n) => "$" + n;

return (
<main style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "2rem", boxSizing: "border-box" }}>
<h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Maywand Dashboard</h1>

<div style={{ background: "#14321f", borderRadius: "10px", padding: "0.9rem 1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
<p style={{ color: "#8fd19e", fontSize: "0.95rem", fontStyle: "italic" }}>{todayReminder}</p>
</div>

<div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
<button
onClick={() => setWeekOffset(weekOffset - 1)}
style={{ background: "#222", color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "1rem" }}
>
<-
</button>
<h2 style={{ color: "#aaa", fontSize: "0.9rem", letterSpacing: "0.1em", margin: 0 }}>UPCOMING EVENTS</h2>
<button
onClick={() => setWeekOffset(weekOffset + 1)}
style={{ background: "#222", color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 0.8rem", cursor: "pointer", fontSize: "1rem" }}
>
->
</button>
</div>
{loading ? <p>Loading...</p> : (
<div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem" }}>
{days.map((day, i) => {
const dayEvents = eventsForDay(day);
return (
<div key={i} style={{ background: "#222", borderRadius: "8px", padding: "0.6rem", minHeight: "100px" }}>
<p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.5rem", fontWeight: "bold" }}>
{day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
</p>
{dayEvents.length === 0 ? (
<p style={{ fontSize: "0.75rem", color: "#555" }}>-</p>
) : (
dayEvents.map((e, j) => (
<div key={j} style={{ marginBottom: "0.4rem" }}>
<p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{e.title}</p>
<p style={{ fontSize: "0.7rem", color: "#777" }}>{e.allDay ? "All day" : formatTime(e.start)}</p>
</div>
))
)}
</div>
);
})}
</div>
)}
{calendar && <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "1rem" }}>Updated {new Date(calendar.lastUpdated).toLocaleString()}</p>}
</div>

<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "500px" }}>
{loading ? (
<p>Loading...</p>
) : bank ? (
["OnePay", "American Express", "Truist"].map((bankName) => {
const accounts = bank.accounts.filter((a) => a.bank === bankName);
if (accounts.length === 0) return null;
return (
<div key={bankName} style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
<h2 style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>{bankName.toUpperCase()}</h2>
{accounts.map((a, i) => (
<p key={i} style={{ marginBottom: "0.5rem" }}>
{a.name}: {formatMoney(a.balance)}{a.limit ? " / " + formatMoney(a.limit) : ""}
</p>
))}
</div>
);
})
) : (
<p>No data</p>
)}
</div>
{bank && <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "1rem" }}>Updated {new Date(bank.lastUpdated).toLocaleString()}</p>}

</main>
);
}
