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
  const target = document.getElementById('target').value.trim();
  const season = document.getElementById('season').value.trim();
  const brand = document.getElementById('brand').value.trim();

  if (!keywords || !target || !season || !brand || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    return;
  }

  const response = await fetch('https://do-chic-v1.gr8-honour.workers.dev', {

    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, target, season, brand, style: selectedStyle })
  });

  const data = await response.json();
  resultBox.textContent = data.result || '이름 생성 실패';
});
