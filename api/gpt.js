// 📄 api/gpt.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { keywords, season, place, style } = await req.body; // 변경 포인트!

    const prompt = `
다음 조건에 맞는 감각적이고 세련된 패션 기획전 이름을 추천해줘.

- 키워드: ${keywords}
- 계절: ${season}
- 장소: ${place}
- 스타일: ${style}

최대한 짧고 임팩트 있게, 트렌디한 느낌으로 만들어줘. 한글로 3개만 제안해줘.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // ✅ 에러 확인용 로그 추가
    console.error("OpenAI API response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ result: data.choices[0].message.content.trim() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
