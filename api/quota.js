module.exports = async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ดึงค่าจาก Environment Variables ที่ตั้งไว้ใน Vercel อย่างปลอดภัย
    const pid = process.env.NHSO_PID;
    const cookie = process.env.NHSO_COOKIE;

    if (!pid || !cookie) {
        return res.status(400).json({ error: 'ยังไม่ได้ตั้งค่าตัวแปร NHSO_PID หรือ NHSO_COOKIE ใน Vercel Environment Variables' });
    }

    const url = 'https://liffquota.nhso.go.th/api/citizen/services';
    const payload = { "pid": pid };

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': 'https://liffquota.nhso.go.th',
            'Referer': 'https://liffquota.nhso.go.th/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cookie': cookie 
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(url, options);
        const dataText = await response.text();
        
        try {
            const jsonData = JSON.parse(dataText);
            return res.status(response.status).json(jsonData);
        } catch(e) {
            return res.status(response.status).send(dataText);
        }
    } catch (error) {
        return res.status(500).json({ error: "Fetch failed: " + error.message });
    }
};
