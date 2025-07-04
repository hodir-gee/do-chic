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
  const brand = document.getElementById('brand').value.trim();
  const product = document.getElementById('product').value.trim();
  const season = document.getElementById('season').value.trim();
  const category = document.getElementById('category').value.trim();

  if (!brand || !product || !season || !category || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500 text-center">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    return;
  }

  resultBox.innerHTML = '<p class="text-center mt-6">🐱 두식이 츄르 먹는 중...</p>';

  try {
    const response = await fetch('/api/gpt.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        brand,
        product,
        season,
        category,
        style: selectedStyle
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // 결과 3세트를 구분해서 보여주기
    const parts = content.split('---').map(part => part.trim()).filter(Boolean);
    const formatted = parts.map(block => {
      const lines = block.split('\n').filter(Boolean);
      if (lines.length < 3) return '';
      const [head, sub, ...desc] = lines;
      return `
        <div class="mb-6 text-left">
          <p class="font-bold text-lg mb-1">${head}</p>
          <p class="text-base mb-2">${sub}</p>
          <p class="text-sm text-gray-600 whitespace-pre-line">${desc.join('\n')}</p>
        </div>
      `;
    }).join('');

    resultBox.innerHTML = formatted || '<p class="text-center">결과를 불러오지 못했습니다.</p>';
  } catch (error) {
    resultBox.innerHTML = '<p class="text-red-500 text-center">문제가 발생했습니다. 다시 시도해주세요.</p>';
  }
});
