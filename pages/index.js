import { useEffect, useState } from "react";

export default function Home() {
const [bankData, setBankData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetch("/api/data")
.then((r) => r.json())
.then((d) => {
setBankData(d.bank);
setLoading(false);
})
.catch(() => setLoading(false));
}, []);

return (
<main style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "2rem" }}>
<h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Maywand Dashboard</h1>

<div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "1.5rem", maxWidth: "400px" }}>
<h2 style={{ color: "#aaa", fontSize: "1rem", marginBottom: "1rem" }}>BANK BALANCES</h2>
{loading ? (
<p>Loading...</p>
) : bankData ? (
<div>
<p>Checking: ${bankData.checking}</p>
<p>Savings: ${bankData.savings}</p>
<p>Credit Card Owed: ${bankData.creditCardOwed} / ${bankData.creditLimit}</p>
<p style={{ color: "#555", fontSize: "0.8rem", marginTop: "1rem" }}>Last updated: {new Date(bankData.lastUpdated).toLocaleString()}</p>
</div>
) : (
<p>No data yet. Hit /api/refresh first.</p>
)}
</div>
</main>
);
}
