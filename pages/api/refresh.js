import { google } from "googleapis";

const bankData = {
accounts: [
{ bank: "OnePay", name: "Checking", type: "checking", balance: 260.75 },
{ bank: "OnePay", name: "Savings", type: "savings", balance: 4.57 },
{ bank: "OnePay", name: "Cash Rewards Card", type: "credit", balance: 211.83, limit: 3000 },
{ bank: "American Express", name: "Blue Cash Everyday", type: "credit", balance: 22.25, limit: 1000 },
{ bank: "Truist", name: "Checking 0855", type: "checking", balance: 0.55 },
{ bank: "Truist", name: "Visa Card 1501", type: "credit", balance: 4587.64, limit: 10500 },
],
lastUpdated: new Date().toISOString(),
};

async function getCalendarEvents() {
const auth = new google.auth.JWT(
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
null,
process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
const calendar = google.calendar({ version: "v3", auth });
["https://www.googleapis.com/auth/" + "calendar.readonly"],const now = new Date();
const future = new Date();
future.setDate(future.getDate() + 60);

const res = await calendar.events.list({
calendarId: "maywandnasri@gmail.com",
timeMin: now.toISOString(),
timeMax: future.toISOString(),
singleEvents: true,
orderBy: "startTime",
maxResults: 100,
});

return (res.data.items || []).map((e) => ({
title: e.summary || "(No title)",
start: e.start.dateTime || e.start.date,
allDay: !e.start.dateTime,
}));
}

export default async function handler(req, res) {
try {
const events = await getCalendarEvents();
const calendarData = {
events,
lastUpdated: new Date().toISOString(),
};

const supabaseUrl = process.env.SUPABASE_URL + "/rest/v1/dashboard_data";
const headers = {
"Content-Type": "application/json",
apikey: process.env.SUPABASE_SECRET_KEY,
Authorization: "Bearer " + process.env.SUPABASE_SECRET_KEY,
};

await fetch(supabaseUrl, {
method: "POST",
headers,
body: JSON.stringify({ data_type: "bank", data: bankData }),
});

await fetch(supabaseUrl, {
method: "POST",
headers,
body: JSON.stringify({ data_type: "calendar", data: calendarData }),
});

res.status(200).json({ ok: true, eventCount: events.length });
} catch (err) {
res.status(500).json({ ok: false, error: err.message });
}
}
