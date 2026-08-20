import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_KEY
);

const CAL_SCOPE = "https://www.google.com/url?q=https://www.googleapis.com/auth/&source=gmail&ust=1787347884062000&sa=E" + "calendar.readonly";
const CAL_ID = "maywandnasri" + "@" + "https://www.google.com/url?q=http://gmail.com&source=gmail&ust=1787347884062000&sa=E";

export default async function handler(req, res) {
try {
const auth = new google.auth.JWT(
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
null,
process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
[CAL_SCOPE]
);

const calendar = google.calendar({ version: "v3", auth });

const now = new Date();
const future = new Date();
future.setDate(future.getDate() + 60);

const eventsResult = await calendar.events.list({
calendarId: CAL_ID,
timeMin: now.toISOString(),
timeMax: future.toISOString(),
singleEvents: true,
orderBy: "startTime",
});

const items = eventsResult.data.items || [];

const calendarData = items.map((ev) => {
const startRaw = ev.start.dateTime || ev.start.date;
const isAllDay = !ev.start.dateTime;
return {
title: ev.summary || "Untitled event",
start: startRaw,
allDay: isAllDay,
};
});

const bankData = [
{ name: "OnePay Checking", balance: 260.75 },
{ name: "OnePay Savings", balance: 4.57 },
{ name: "OnePay Cash Rewards Card", balance: 211.83, limit: 3000 },
{ name: "Amex Blue Cash Everyday", balance: 22.25, limit: 1000 },
{ name: "Truist Checking 0855", balance: 0.55 },
{ name: "Truist Visa Card 1501", balance: 4587.64, limit: 10500 }
];

await supabase.from("dashboard_data").insert([
{ data_type: "calendar", payload: calendarData },
{ data_type: "bank", payload: bankData },
]);

res.status(200).json({ ok: true, eventCount: calendarData.length });
} catch (err) {
res.status(500).json({ ok: false, error: err.message });
}
}
