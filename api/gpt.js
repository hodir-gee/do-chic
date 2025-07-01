export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body;
  try {
    body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = JSON.parse(Buffer.concat(buffers).toString());
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { keywords, season, place, style } = body;

  const prompt = `
다음 조건에 맞는 감각적이고 세련된 패션 기획전 이름을 추천해줘.

- 키워드: ${keywords}
- 계절: ${season}
- 장소: ${place}
- 스타일: ${style}

최대한 짧고 임팩트 있게, 트렌디한 느낌으로 만들어줘. 한글로 3개만 제안해줘.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const result = data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ result });
  } catch (error) {
    console.error('API 호출 실패:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
