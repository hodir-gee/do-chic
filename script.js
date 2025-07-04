const styleButtons = document.querySelectorAll('.style-btn');
let selectedStyle = null;

styleButtons.forEach(button => {
  button.addEventListener('click', () => {
    styleButtons.forEach(btn => btn.classList.remove('bg-black', 'text-white'));
    button.classList.add('bg-black', 'text-white');
    selectedStyle = button.dataset.style;
  });
});

const generateButton = document.getElementById('generate');
const resultBox = document.getElementById('result');

generateButton.addEventListener('click', async () => {
  const keywords = document.getElementById('keywords').value.trim();
  const season = document.getElementById('season').value.trim();
  const place = document.getElementById('place')?.value.trim() || '';
  const brand = document.getElementById('brand')?.value.trim() || '';
  const product = document.getElementById('product')?.value.trim() || '';

  if (!keywords || !season || !place || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    resultBox.classList.remove("opacity-0");
    resultBox.classList.add("opacity-100");
    return;
  }

  // ✅ 로딩 메시지 출력
  resultBox.innerHTML = '<p class="text-gray-500 animate-pulse">😻 두식이 츄르 먹는 중...</p>';
  resultBox.classList.remove("opacity-0");
  resultBox.classList.add("opacity-100");

  // ✅ 렌더링 보장
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, season, place, style: selectedStyle, brand, product })
    });

    const data = await response.json();

    if (data.result) {
      const formatted = data.result
        .split(/\n\s*\n/) // 빈 줄 기준으로 블록 나누기
        .map(block => {
          const lines = block.split('\n').map(line => line.trim());
          const head = lines.find(l => l.startsWith("헤드 카피:")) || '';
          const sub = lines.find(l => l.startsWith("서브 카피:")) || '';
          const desc = lines.find(l => l.startsWith("설명:")) || '';

          return `
            <div>
              <p class="font-semibold">${head.replace("헤드 카피:", "").trim()}</p>
              <p class="mb-2">${sub.replace("서브 카피:", "").trim()}</p>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">${desc.replace("설명:", "").trim()}</p>
            </div>
          `;
        }).join('');

      resultBox.innerHTML = formatted;
    } else {
      resultBox.innerHTML = '<p class="text-red-500">결과를 받아오는 데 실패했어요.</p>';
    }
  } catch (error) {
    resultBox.innerHTML = '<p class="text-red-500">오류가 발생했어요. 다시 시도해주세요.</p>';
  }
});
