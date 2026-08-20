import { useEffect, useState } from "react";

export default function Home() {
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch("/api/data")
.then((r) => r.json())
.then((d) => { setData(d); setLoading(false); })
.catch(() => setLoading(false));
}, []);

const bank = data?.bank;
const calendar = data?.calendar;

const days = [];
const today = new Date();
today.setHours(0, 0, 0, 0);
for (let i = 0; i < 7; i++) {
const d = new Date(today);
d.setDate(today.getDate() + i);
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

<div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
<h2 style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>UPCOMING EVENTS</h2>
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
