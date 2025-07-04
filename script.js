<script>
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
      resultBox.className = "mt-6 text-center text-lg font-medium opacity-100";
      return;
    }

    // ✅ 로딩 메시지는 중앙정렬 유지
    resultBox.innerHTML = '<p class="text-gray-500 animate-pulse">🐱 두식이 츄르 먹는 중...</p>';
    resultBox.className = "mt-6 text-center text-lg font-medium opacity-100";

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
        // ✅ 결과는 좌측 정렬 + 설명은 작은 회색 글씨
        resultBox.innerHTML = `<div class="text-left">
  ${data.result
    .replace(/설명:/g, '<div class="mt-4 text-sm text-gray-700 leading-relaxed">설명:')
    .replace(/\n/g, '<br>')}
</div>`;
        resultBox.className = "mt-6 text-left text-lg font-medium opacity-100";
      } else {
        resultBox.innerHTML = '<p class="text-red-500">결과를 받아오는 데 실패했어요.</p>';
        resultBox.className = "mt-6 text-center text-lg font-medium opacity-100";
      }
    } catch (error) {
      resultBox.innerHTML = '<p class="text-red-500">오류가 발생했어요. 다시 시도해주세요.</p>';
      resultBox.className = "mt-6 text-center text-lg font-medium opacity-100";
    }
  });
</script>
