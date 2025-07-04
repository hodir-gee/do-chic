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
    resultBox.className = "mt-6 text-center text-lg font-medium opacity-100 transition-opacity duration-700";
    resultBox.innerHTML = '<p class="text-red-500">모든 항목을 입력하고 스타일을 선택해주세요.</p>';
    return;
  }

  // ✅ 중앙정렬로 로딩 메시지 표시
  resultBox.className = "mt-6 text-center text-lg font-medium opacity-100 transition-opacity duration-700";
  resultBox.innerHTML = '<p class="text-gray-500">😺 두식이 츄르 먹는 중...</p>';

  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, product, keywords, season, style: selectedStyle })
    });

    const data = await response.json();

    if (data.result) {
      // ✅ 결과는 좌정렬 + 서브텍스트 스타일 적용
      resultBox.className = "mt-6 text-left text-lg font-medium opacity-100 transition-opacity duration-700";
      resultBox.innerHTML = data.result;
    } else {
      resultBox.innerHTML = '<p class="text-red-500">결과를 받아오는 데 실패했어요.</p>';
    }
  } catch (error) {
    resultBox.innerHTML = '<p class="text-red-500">오류가 발생했어요. 다시 시도해주세요.</p>';
  }
});
