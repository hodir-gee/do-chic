
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
  const brand = document.getElementById('place').value.trim();
  const product = document.getElementById('product').value.trim();
  const keywords = document.getElementById('keywords').value.trim();
  const season = document.getElementById('season').value.trim();

  if (!brand || !product || !keywords || !season || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500 text-center">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    resultBox.classList.remove("opacity-0");
    resultBox.classList.add("opacity-100");
    return;
  }

  resultBox.innerHTML = '<p class="text-gray-500 animate-pulse text-center">🐱 두식이 츄르 먹는 중...</p>';
  resultBox.classList.remove("opacity-0");
  resultBox.classList.add("opacity-100");

  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, product, keywords, season, style: selectedStyle })
    });

    const data = await response.json();

    if (data.result) {
      console.log("GPT 응답 원문:", data.result); // 디버깅용 로그

      const sections = data.result.split('---').map(s => s.trim()).filter(Boolean);

      const formatted = sections.map(section => {
        const lines = section.split('\n').filter(Boolean);
        const head = lines.find(line => line.startsWith('헤드 카피:')) || '';
        const sub = lines.find(line => line.startsWith('서브 카피:')) || '';
        const desc = lines.find(line => line.startsWith('설명:')) || '';

        return `
          <div class="border rounded-xl p-4 shadow bg-white">
            <p class="font-bold mb-1">${head}</p>
            <p class="mb-2">${sub}</p>
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">${desc}</p>
          </div>
        `;
      }).join('<hr class="my-4">');

      resultBox.innerHTML = formatted;
    } else {
      resultBox.innerHTML = '<p class="text-red-500 text-center">결과를 받아오는 데 실패했어요.</p>';
    }
  } catch (error) {
    resultBox.innerHTML = '<p class="text-red-500 text-center">오류가 발생했어요. 다시 시도해주세요.</p>';
  }
});
