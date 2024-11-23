const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const indicators = document.querySelectorAll('.indicator');

let currentSlide = 0;

function showSlide(n) {
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === n) {
      slide.classList.add('active');
    }
  });

  // Update the active indicator
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === n) {
      indicator.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// Show the first slide on page load
showSlide(currentSlide);

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

let autoSlideInterval = setInterval(nextSlide, 6000); // Auto slide every 10 seconds



