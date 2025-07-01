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
  const place = document.getElementById('place').value.trim();

  if (!keywords || !season || !place || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    return;
  }

  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keywords,
        season,
        place,
        style: selectedStyle
      })
    });

    const data = await response.json();
    resultBox.innerHTML = `<p class="text-green-600 font-semibold whitespace-pre-line">${data.result}</p>`;
  } catch (error) {
    resultBox.innerHTML = '<p class="text-red-500">작명 요청 실패. 다시 시도해주세요.</p>';
  }
});
