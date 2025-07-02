export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { place, product, keywords, season, style } = req.body;

  const prompt = generatePrompt({ place, product, keywords, season, style });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function generatePrompt({ place, product, keywords, season, style }) {
  if (style === '직관적') {
    return `너는 패션 기획전 이름을 제안하는 작명가야.

사용자가 입력한 조건은 다음과 같아:
- 브랜드: ${place}
- 제품: ${product}
- 카테고리 키워드: ${keywords}
- 시즌: ${season}
- 작명 스타일: 직관적

요청:
- 이름은 직관적이고 실용적인 방향으로 지어줘.
- 사용자들이 한눈에 어떤 기획전인지 알 수 있도록 명확하게 표현해.
- 1~2단어의 한글 또는 영어 이름을 3개 제안해줘.
- 각 이름마다 짧은 설명을 붙여줘.`;
  }

  if (style === '감각적') {
    return `너는 패션 기획전 이름을 제안하는 작명가야.

사용자가 입력한 조건은 다음과 같아:
- 브랜드: ${place}
- 제품: ${product}
- 카테고리 키워드: ${keywords}
- 시즌: ${season}
- 작명 스타일: 감각적

요청:
- 이름은 감각적이고 트렌디한 인상을 주되, 너무 낯설지는 않게 해줘.
- 젊은 타겟에게 어필할 수 있는 세련된 단어를 사용해.
- 한글/영문 혼용 가능, 1~2단어, 3개 제안
- 각 이름에 대한 간단한 의미와 설명도 함께 제공해.`;
  }

  return `너는 예술성과 감성을 겸비한 패션 기획전 작명가야.

사용자가 입력한 조건은 다음과 같아:
- 브랜드: ${place}
- 제품: ${product}
- 카테고리 키워드: ${keywords}
- 시즌: ${season}
- 작명 스타일: 창의적

요청:
- 이름은 상징적이고 창의적인 방향으로 제안해줘.
- 은유나 시적인 언어, 감각적인 조합을 자유롭게 활용해도 좋아.
- 다소 추상적이어도 매력적인 이름이면 OK.
- 영어, 한글 혼용 가능. 1~2단어, 총 3개 제안.
- 각 이름에는 그 의미를 짧고 시적으로 해석해서 설명해줘.`;
}
