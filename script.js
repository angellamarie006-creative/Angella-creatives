// Mobile menu
// const keeps a page element in a named variable, like saving its address.
// querySelector finds the first HTML element matching this CSS class.
const menuBtn = document.querySelector('.menu-btn');
// getElementById finds the navigation element whose id is "nav".
const nav = document.getElementById('nav');

// An event listener means: when this event happens, run this function.
// The arrow function (=>) is the action that runs when the button is clicked.
menuBtn.addEventListener('click', () => {
  // toggle adds .is-open if missing, or removes it if already there.
  const open = nav.classList.toggle('is-open');
  // Keep the button's accessibility state in sync with the menu.
  menuBtn.setAttribute('aria-expanded', open);
});

// Listen for clicks inside the navigation links.
nav.addEventListener('click', (e) => {
  // e.target is what was clicked; A means an HTML link.
  if (e.target.tagName === 'A') {
    // Hide the menu and report that it is closed.
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Project filter learning notes: the filter code is not currently in this file.
// querySelectorAll('.filter') would collect filter controls; forEach handles each one.
// A click could read data-filter and compare it with each tile's data-category.
// classList adds/removes .is-active and .is-hidden so CSS can style or hide elements.
const tiles = document.querySelectorAll('.tile');

// Lightbox
// Find the <dialog> popup by its id, then find its content by class inside it.
const lightbox = document.getElementById('lightbox');
const media = lightbox.querySelector('.lightbox-media');
const title = lightbox.querySelector('.lightbox-title');
const desc = lightbox.querySelector('.lightbox-desc');

// Run this once for every project tile so each one can respond to a click.
tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    // Clear the previous preview before adding the newly selected artwork.
    media.innerHTML = '';
    // Find this tile's image, make a copy, and place the copy in the dialog.
    media.appendChild(tile.querySelector('.tile-art img').cloneNode());
    // dataset reads the tile's data-title and data-desc HTML attributes.
    title.textContent = tile.dataset.title;
    desc.textContent = tile.dataset.desc;
    // showModal opens the <dialog> as a popup above the page.
    lightbox.showModal();
  });
});

// The close button calls close() to dismiss the dialog.
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());

// Close when clicking the dark area outside the box
lightbox.addEventListener('click', (e) => {
  // Only close when the dark backdrop itself was clicked, not dialog content.
  if (e.target === lightbox) lightbox.close();
});

// Footer year
// Find the footer's year placeholder by id and replace its text with this year's number.
document.getElementById('year').textContent = new Date().getFullYear();

// Contact pop-up
// Save the contact <dialog>, form, and message area by their HTML ids.
const contactDialog = document.getElementById('contact-dialog');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Find every element with data-open-contact; forEach sets up each opener.
document.querySelectorAll('[data-open-contact]').forEach((el) => {
  el.addEventListener('click', (e) => {
    // Stop the link's normal jump so the contact popup can open instead.
    e.preventDefault();
    // Clear an old message, then open the HTML <dialog> as a modal popup.
    formStatus.textContent = '';
    contactDialog.showModal();
  });
});

// The dialog's close button dismisses it; clicking its dark outside area does too.
contactDialog.querySelector('.lightbox-close').addEventListener('click', () => contactDialog.close());
contactDialog.addEventListener('click', (e) => {
  if (e.target === contactDialog) contactDialog.close();
});

// Listen for the form's submit event, such as clicking Send message.
contactForm.addEventListener('submit', async (e) => {
  // Stop the browser's normal page reload so JavaScript can handle the form.
  e.preventDefault();
  // FormData gathers the form fields, using their HTML name attributes.
  const data = new FormData(contactForm);

  // Until you add your Formspree ID, open the visitor's email app instead
  // YOUR_FORM_ID is the placeholder in the form action in index.html.
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    // Prepare the email subject and message using the visitor's form answers.
    const subject = encodeURIComponent(data.get('topic') + ' enquiry from ' + data.get('name'));
    const body = encodeURIComponent(data.get('message') + '\n\nFrom: ' + data.get('name') + ' (' + data.get('email') + ')');
    // Open the visitor's email app with these details filled in.
    window.location.href = 'mailto:yourname@example.com?subject=' + subject + '&body=' + body;
    // Leave this submit handler so it does not also try to send to Formspree.
    return;
  }

  // Find the Send message button, disable it to prevent repeat clicks, and show progress.
  const button = contactForm.querySelector('button[type="submit"]');
  button.disabled = true;
  formStatus.textContent = 'Sending...';

  // try runs the request; catch shows a message if the request cannot complete.
  try {
    // Send the form data to the form's action URL and wait for the reply.
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });
    // A successful reply clears the fields and displays a thank-you message.
    if (res.ok) {
      contactForm.reset();
      formStatus.textContent = 'Thank you! Your message has been sent. I will reply within two working days.';
    } else {
      // The server replied, but reported that it could not accept the message.
      formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    // A network problem or other request error is shown here.
    formStatus.textContent = 'Could not send. Check your connection or email me directly.';
  }
  // Re-enable the button after the request finishes or fails.
  button.disabled = false;
});