
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { brand, product, season, category, style } = req.body;

  const prompt = `
너는 뛰어난 카피라이터다. 아래 조건에 맞춰 마케팅 작명 결과를 3가지 생성해줘.

브랜드: ${brand}
주제: ${product}
시즌: ${season}
카테고리: ${category}
스타일: ${style} 스타일

각 결과는 다음과 같은 형식으로 출력해줘:

1. 헤드 카피 (16바이트 이하, 굵게)
2. 서브 카피 (32바이트 이하, 한 줄 띄움)
3. 해석 및 설명 (작은 글씨 스타일로)

형식 예시:
---
[헤드카피]
[서브카피]

[설명]
---

총 3세트를 만들어줘. 불릿이나 번호는 붙이지 마.
`.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        n: 1
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate names.' });
  }
}
