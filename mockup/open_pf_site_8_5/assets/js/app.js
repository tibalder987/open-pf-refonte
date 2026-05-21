const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const group = button.closest('[data-filter-group]');
    if (!group) return;
    group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const value = button.dataset.filter;
    const target = group.dataset.target;
    document.querySelectorAll(`[data-${target}]`).forEach(card => {
      const show = value === 'all' || card.dataset[target]?.includes(value);
      card.hidden = !show;
    });
  });
});