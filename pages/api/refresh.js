export default async function handler(req, res) {
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const bankData = {
accounts: [
{ bank: "OnePay", name: "Checking", type: "checking", balance: 260.75 },
{ bank: "OnePay", name: "Savings", type: "checking", balance: 4.57 },
{ bank: "OnePay", name: "Cash Rewards Card", type: "credit_card", balance: 211.83, limit: 3000 },
{ bank: "American Express", name: "Blue Cash Everyday", type: "credit_card", balance: 22.25, limit: 1000 },
{ bank: "Truist", name: "Checking 0855", type: "checking", balance: 0.55 },
{ bank: "Truist", name: "Visa Card 1501", type: "credit_card", balance: 4587.64, limit: 10500 }
],
lastUpdated: new Date().toISOString()
};

const calendarData = {
events: [
{ title: "Jummah Prayer", start: "2026-08-21T14:00:00-04:00", allDay: false },
{ title: "Work", start: "2026-08-23T07:45:00-04:00", allDay: false },
{ title: "Work", start: "2026-08-24T07:45:00-04:00", allDay: false },
{ title: "Mason payment due", start: "2026-08-24T00:00:00-04:00", allDay: true },
{ title: "Going to UVA", start: "2026-08-25T00:00:00-04:00", allDay: true },
{ title: "Work", start: "2026-08-25T07:45:00-04:00", allDay: false },
{ title: "Work", start: "2026-08-26T07:45:00-04:00", allDay: false },
{ title: "Jummah Prayer", start: "2026-08-28T14:00:00-04:00", allDay: false },
{ title: "Work", start: "2026-08-30T07:45:00-04:00", allDay: false }
],
lastUpdated: new Date().toISOString()
};

try {
const bankRes = await fetch(SUPABASE_URL + "/rest/v1/dashboard_data", {
method: "POST",
headers: {
"Content-Type": "application/json",
"apikey": SUPABASE_SECRET_KEY,
"Authorization": "Bearer " + SUPABASE_SECRET_KEY,
"Prefer": "return=representation"
},
body: JSON.stringify({ data_type: "bank", content: bankData })
});

const calendarRes = await fetch(SUPABASE_URL + "/rest/v1/dashboard_data", {
method: "POST",
headers: {
"Content-Type": "application/json",
"apikey": SUPABASE_SECRET_KEY,
"Authorization": "Bearer " + SUPABASE_SECRET_KEY,
"Prefer": "return=representation"
},
body: JSON.stringify({ data_type: "calendar", content: calendarData })
});

res.status(200).json({
ok: true,
bankStatus: bankRes.status,
calendarStatus: calendarRes.status
});
} catch (err) {
res.status(500).json({ error: err.message });
}
}
