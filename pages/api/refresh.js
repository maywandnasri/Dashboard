export default async function handler(req, res) {
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const headers = {
"apikey": SUPABASE_SECRET_KEY,
"Authorization": "Bearer " + SUPABASE_SECRET_KEY,
"Content-Type": "application/json",
"Prefer": "return=minimal"
};

try {
const bankSummary = {
checking: 260.75,
savings: 4.57,
creditCardOwed: 211.83,
creditLimit: 3000,
lastUpdated: new Date().toISOString()
};

const calendarEvents = [
{ title: "Jummah Prayer", start: "2026-08-21T14:00:00-04:00", end: "2026-08-21T15:00:00-04:00" },
{ title: "Work", start: "2026-08-23T07:45:00-04:00", end: "2026-08-23T18:15:00-04:00" },
{ title: "Mason payment due", start: "2026-08-24", end: "2026-08-24", allDay: true },
{ title: "Going to UVA", start: "2026-08-25", end: "2026-08-25", allDay: true },
{ title: "Work", start: "2026-08-24T07:45:00-04:00", end: "2026-08-24T18:15:00-04:00" },
{ title: "Work", start: "2026-08-25T07:45:00-04:00", end: "2026-08-25T18:15:00-04:00" },
{ title: "Work", start: "2026-08-26T07:45:00-04:00", end: "2026-08-26T18:15:00-04:00" },
{ title: "Jummah Prayer", start: "2026-08-28T14:00:00-04:00", end: "2026-08-28T15:00:00-04:00" },
{ title: "Work", start: "2026-08-30T07:45:00-04:00", end: "2026-08-30T18:15:00-04:00" }
];

await fetch(SUPABASE_URL + "/rest/v1/dashboard_data", {
method: "POST",
headers,
body: JSON.stringify({ data_type: "bank", content: bankSummary })
});

await fetch(SUPABASE_URL + "/rest/v1/dashboard_data", {
method: "POST",
headers,
body: JSON.stringify({ data_type: "calendar", content: { events: calendarEvents, lastUpdated: new Date().toISOString() } })
});

return res.status(200).json({ ok: true, refreshedAt: new Date().toISOString() });
} catch (err) {
return res.status(500).json({ ok: false, error: String(err) });
}
}
