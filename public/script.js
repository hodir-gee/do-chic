console.log("스크립트가 제대로 실행됨");


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
  const brand = document.getElementById('brand')?.value.trim() || '';
  const product = document.getElementById('product')?.value.trim() || '';

  if (!keywords || !season || !place || !selectedStyle) {
    resultBox.innerHTML = '<p class="text-red-500">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    return;
  }

  // 👉 로딩 중 문구 출력
  resultBox.innerHTML = '<p class="text-gray-500 animate-pulse">두식이 츄르 먹는 중...</p>';
  resultBox.classList.remove("opacity-0");
  resultBox.classList.add("opacity-100");

  const response = await fetch('/api/gpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords, season, place, style: selectedStyle, brand, product })
  });

  const data = await response.json();

  if (data.result) {
    resultBox.innerHTML = `<p class="whitespace-pre-line">${data.result}</p>`;
  } else {
    resultBox.innerHTML = '<p class="text-red-500">결과를 받아오는 데 실패했어요.</p>';
  }
});
