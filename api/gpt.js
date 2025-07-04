export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { place, product, keywords, season, style, brand } = req.body;
  const prompt = generatePrompt({ place, product, keywords, season, style, brand });

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
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0].message.content) {
      return res.status(200).json({ result: data.choices[0].message.content.trim() });
    } else {
      return res.status(500).json({ error: 'No result from OpenAI.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Request to OpenAI failed.' });
  }
}

function generatePrompt({ place, product, keywords, season, style, brand }) {
  return `
당신은 창의적인 패션 마케터를 위한 기획전 작명 도우미입니다.
아래 정보를 바탕으로 기획전 이름 후보 3가지를 제안해주세요.

- 브랜드: ${brand}
- 주제: ${place}
- 시즌: ${season}
- 카테고리: ${keywords}
- 제품: ${product}
- 스타일: ${style}

각 작명은 아래와 같은 형식으로 구성되어야 합니다:

1. 헤드 카피: (최대 16바이트, 한 줄 제목)
   서브 카피: (최대 32바이트, 부제/혜택/기간 등 보조 문구)

   설명: 작명 배경과 브랜드/주제/시즌/카테고리를 바탕으로 한 맥락 설명

💡주의사항:
- 반드시 위의 출력 형식을 따르세요.
- 헤드카피와 서브카피는 따옴표 없이 출력해주세요.
- 숫자나 시각적 강조어도 자연스럽게 활용해주세요.
- 브랜드 톤앤매너를 고려해 매력적이고 직관적으로 작명하세요.
`.trim();
}
