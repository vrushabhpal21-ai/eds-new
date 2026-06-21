export default function decorate(block) {
  const rows = [...block.children];

  const slidesData = rows.map((row) => {
    const cols = [...row.children];

    // only consider rows with at least 2 columns
    if (cols.length < 2) return null;

    const title = cols[0]?.textContent?.trim() || '';
    const content = cols[1]?.textContent?.trim() || '';

    // ignore arrow/helper rows like << / >>
    if (
      title === '<<'
      || content === '>>'
      || `${title} ${content}`.trim() === '<< >>'
    ) {
      return null;
    }

    // ignore fully empty rows
    if (!title && !content) return null;

    return {
      title: cols[0]?.innerHTML?.trim() || '',
      content: cols[1]?.innerHTML?.trim() || '',
    };
  }).filter(Boolean);

  if (!slidesData.length) {
    block.innerHTML = '<p>No carousel slides found.</p>';
    return;
  }

  let currentIndex = 0;

  block.innerHTML = `
    <div class="carousel-viewport">
      <div class="carousel-track">
        ${slidesData.map((slide) => `
          <div class="carousel-slide">
            <div class="carousel-card">
              ${slide.title ? `<h3 class="carousel-card-title">${slide.title}</h3>` : ''}
              ${slide.content ? `<div class="carousel-card-content">${slide.content}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <button class="carousel-nav carousel-prev" aria-label="Previous slide">&lt;</button>
    <button class="carousel-nav carousel-next" aria-label="Next slide">&gt;</button>

    <div class="carousel-dots" aria-label="Carousel pagination">
      ${slidesData.map((_, index) => `
        <button
          class="carousel-dot ${index === 0 ? 'active' : ''}"
          aria-label="Go to slide ${index + 1}"
          data-index="${index}">
        </button>
      `).join('')}
    </div>
  `;

  const track = block.querySelector('.carousel-track');
  const prevBtn = block.querySelector('.carousel-prev');
  const nextBtn = block.querySelector('.carousel-next');
  const dots = [...block.querySelectorAll('.carousel-dot')];
  const viewport = block.querySelector('.carousel-viewport');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slidesData.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slidesData.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      currentIndex = Number(dot.dataset.index);
      updateCarousel();
    });
  });

  // mobile swipe support
  let startX = 0;
  let endX = 0;

  viewport.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < slidesData.length - 1) {
        currentIndex += 1;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex -= 1;
      }
      updateCarousel();
    }
  }, { passive: true });

  updateCarousel();
}