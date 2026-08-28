// Static prototype interactions — copy into app.js next to index.html
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  if (msg) msg.textContent = '✓ 已收到你的需求，我們將儘快與你聯繫！';
  e.target.reset();
  return false;
}

// Scroll-in reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .feat, .stat, .step').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});
