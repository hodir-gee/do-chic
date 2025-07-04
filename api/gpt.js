
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { brand, product, keywords, season, style } = req.body;

  const messages = [
    {
      role: 'system',
      content: `너는 패션 마케터의 작명을 도와주는 GPT 어시스턴트야.
각 작명은 아래 포맷을 따르고, 정확히 3개 세트를 생성해야 해:

---
헤드 카피: (16바이트 이내)
서브 카피: (32바이트 이내)

설명: (왜 이런 작명이 나왔는지 설명)
---

헤드 카피와 서브 카피는 아래 예시 스타일을 참고해서 자연스럽고 마케팅에 적합한 문장으로 작성해줘:

예시 1) 헤드 카피: 단 하루 더 낮을 순 없다 / 서브 카피: 24시간 한정 혜택, 시즌오프 최대 30%
예시 2) 헤드 카피: 여름 에센셜 저점에서 만나요 / 서브 카피: 25 S/S 시즌오프 최대 30%
예시 3) 헤드 카피: 지금이 최적가 윈터 라스트 찬스 / 서브 카피: 시즌오프 마감 임박, 최대 50% 할인

모든 카피는 자연어 문장이어야 하고, 줄바꿈 없이 한 줄로 구성돼야 해.`
    },
    {
      role: 'user',
      content: `브랜드: ${brand}
주제: ${product}
시즌: ${season}
카테고리: ${keywords}
스타일: ${style} 느낌으로 작명해줘.`
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '결과가 없습니다.';
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI API 호출 실패' });
  }
}
