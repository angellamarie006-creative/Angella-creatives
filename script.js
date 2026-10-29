// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', open);
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Project filter
const filters = document.querySelectorAll('.filter');
const tiles = document.querySelectorAll('.tile');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((f) => f.classList.remove('is-active'));
    btn.classList.add('is-active');

    const choice = btn.dataset.filter;
    tiles.forEach((tile) => {
      const show = choice === 'all' || tile.dataset.category === choice;
      tile.classList.toggle('is-hidden', !show);
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const media = lightbox.querySelector('.lightbox-media');
const title = lightbox.querySelector('.lightbox-title');
const desc = lightbox.querySelector('.lightbox-desc');

tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    media.innerHTML = '';
    media.appendChild(tile.querySelector('.tile-art').cloneNode(true));
    title.textContent = tile.dataset.title;
    desc.textContent = tile.dataset.desc;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());

// Close when clicking the dark area outside the box
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact pop-up
const contactDialog = document.getElementById('contact-dialog');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

document.querySelectorAll('[data-open-contact]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    contactDialog.showModal();
  });
});

contactDialog.querySelector('.lightbox-close').addEventListener('click', () => contactDialog.close());
contactDialog.addEventListener('click', (e) => {
  if (e.target === contactDialog) contactDialog.close();
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);

  // Until you add your Formspree ID, open the visitor's email app instead
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    const subject = encodeURIComponent(data.get('topic') + ' enquiry from ' + data.get('name'));
    const body = encodeURIComponent(data.get('message') + '\n\nFrom: ' + data.get('name') + ' (' + data.get('email') + ')');
    window.location.href = 'mailto:yourname@example.com?subject=' + subject + '&body=' + body;
    return;
  }

  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  formStatus.textContent = 'Sending...';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      contactForm.reset();
      formStatus.textContent = 'Thank you! Your message has been sent. I will reply within two working days.';
    } else {
      formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    formStatus.textContent = 'Could not send. Check your connection or email me directly.';
  }
  button.disabled = false;
});