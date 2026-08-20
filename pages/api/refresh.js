export default async function handler(req, res) {
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

try {
const bankSummary = {
checking: 260.75,
savings: 4.57,
creditCardOwed: 211.83,
creditLimit: 3000,
lastUpdated: new Date().toISOString()
};

const payload = {
data_type: "bank",
content: bankSummary
};

const response = await fetch(SUPABASE_URL + "/rest/v1/dashboard_data", {
method: "POST",
headers: {
"apikey": SUPABASE_SECRET_KEY,
"Authorization": "Bearer " + SUPABASE_SECRET_KEY,
"Content-Type": "application/json",
"Prefer": "return=minimal"
},
body: JSON.stringify(payload)
});

if (!response.ok) {
const errText = await response.text();
return res.status(500).json({ ok: false, error: errText });
}

return res.status(200).json({ ok: true, refreshedAt: new Date().toISOString() });
} catch (err) {
return res.status(500).json({ ok: false, error: String(err) });
}
}
