export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { place, product, keywords, season, style } = req.body;

  const prompt = `
당신은 브랜드 마케터입니다.
다음 정보를 바탕으로 기획전 제목을 작명해 주세요.

브랜드명: ${place}
제품 종류: ${product}
주제 키워드: ${keywords}
시즌: ${season}
스타일 성향: ${style}

작명은 다음 형식에 맞춰 출력해주세요:

헤드 카피: (임팩트 있는 한 줄, 16바이트 이내)
서브 카피: (혜택이나 설명을 담은 한 줄, 32바이트 이내)

설명: (이 작명의 의미와 맥락을 마케터 입장에서 친절하게 해석)

각 항목은 라벨을 포함해 출력하며, 라벨과 본문 사이에는 콜론(:)을 붙이고 줄바꿈으로 구분해주세요.
예시:
헤드 카피: 단 하루 더 낮을 순 없다
서브 카피: 24시간 한정 혜택 25S/S 시즌오프 최대 30%

설명: ‘단 하루’라는 긴박감을 강조하고 ‘더 낮을 순 없다’는 가격 메리트를 직관적으로 전달한 문장입니다. 쇼핑몰 내 시즌오프 혜택을 명확하게 설명하며 클릭을 유도합니다.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: '당신은 마케팅 전문가 카피라이터입니다.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || null;

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI API 요청 중 오류가 발생했습니다.' });
  }
}
