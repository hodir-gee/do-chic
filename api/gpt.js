export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = '';
  try {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => (data += chunk));
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { keywords, season, place, style } = body;

  const prompt = `당신은 패션 기획자입니다. 다음 요소를 반영한 패션 기획전 제목을 하나 만들어주세요.
- 키워드: ${keywords}
- 시즌: ${season}
- 장소: ${place}
- 스타일: ${style}
제목만 간결하게 한 줄로 생성해주세요.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    const result = data.choices?.[0]?.message?.content ?? '작명 실패';

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: 'OpenAI 요청 실패', detail: error.message });
  }
}
