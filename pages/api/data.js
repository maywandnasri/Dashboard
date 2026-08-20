export default async function handler(req, res) {
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const response = await fetch(SUPABASE_URL + "/rest/v1/dashboard_data?order=created_at.desc&limit=10", {
headers: {
"apikey": SUPABASE_SECRET_KEY,
"Authorization": "Bearer " + SUPABASE_SECRET_KEY
}
});

const rows = await response.json();

const result = {};
for (const row of rows) {
if (!result[row.data_type]) {
result[row.data_type] = row.content;
}
}

return res.status(200).json(result);
}
