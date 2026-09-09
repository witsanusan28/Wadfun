export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, age } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
      return res.status(400).json({ error: 'กรุณาใส่ไอเดียก่อน' });
    }

    const safePrompt = `Create a child-friendly black-and-white coloring page for a child aged ${age || '5–8 years'}.
Subject: ${prompt.trim()}
Style: clean simple line art, thick smooth black outlines, white background, large enclosed areas for coloring, cute friendly shapes, no text, no letters, no numbers, no logos, no shading, no gray fills, no frightening or violent content.
The result must look like a printable coloring-book page, centered with generous empty margins.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: safePrompt,
        size: '1024x1024',
        quality: 'low',
        background: 'opaque'
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI image error:', data);
      return res.status(response.status).json({ error: 'AI สร้างภาพไม่สำเร็จ ลองใหม่อีกครั้ง' });
    }

    const image = data?.data?.[0]?.b64_json;
    if (!image) {
      return res.status(502).json({ error: 'ไม่พบภาพจาก AI' });
    }

    return res.status(200).json({ image: `data:image/png;base64,${image}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'ระบบ AI ขัดข้องชั่วคราว' });
  }
}