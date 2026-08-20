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

const formatTime = (iso) => {
if (!iso || !iso.includes("T")) return "All day";
return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const formatDate = (iso) => {
const d = new Date(iso);
return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

return (
<main style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "2rem", boxSizing: "border-box" }}>
<h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Maywand Dashboard</h1>

{/* Calendar - full width on top */}
<div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
<h2 style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>UPCOMING EVENTS</h2>
{loading ? <p>Loading...</p> : calendar ? (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
{calendar.events.map((e, i) => (
<div key={i} style={{ background: "#222", borderRadius: "8px", padding: "0.75rem" }}>
<p style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>{e.title}</p>
<p style={{ color: "#888", fontSize: "0.85rem" }}>{formatDate(e.start)}</p>
<p style={{ color: "#666", fontSize: "0.8rem" }}>{e.allDay ? "All day" : formatTime(e.start)}</p>
</div>
))}
</div>
) : <p>No data</p>}
{calendar && <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "1rem" }}>Updated {new Date(calendar.lastUpdated).toLocaleString()}</p>}
</div>

{/* Bank - below, left-aligned card */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
<div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem" }}>
<h2 style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: "0.1em" }}>BANK BALANCES</h2>
{loading ? <p>Loading...</p> : bank ? (
<div>
<p style={{ marginBottom: "0.5rem" }}>Checking: ${bank.checking}</p>
<p style={{ marginBottom: "0.5rem" }}>Savings: ${bank.savings}</p>
<p style={{ marginBottom: "0.5rem" }}>Credit Card: ${bank.creditCardOwed} / ${bank.creditLimit}</p>
<p style={{ color: "#555", fontSize: "0.75rem", marginTop: "1rem" }}>Updated {new Date(bank.lastUpdated).toLocaleString()}</p>
</div>
) : <p>No data</p>}
</div>
</div>

</main>
);
}
