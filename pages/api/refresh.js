export default async function handler(req, res) {
res.status(200).json({ refreshedAt: new Date().toISOString() });
}
