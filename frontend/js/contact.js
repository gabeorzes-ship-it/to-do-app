// Global Variables

const contactForm = document.getElementById('contactForm');

const contactName = document.getElementById('contactName');

const contactEmail = document.getElementById('contactEmail');

const contactMessage = document.getElementById('contactMessage');

const contactButton = document.getElementById('contactButton');

const contactFormMessage = document.getElementById('contactFormMessage');

// Handle Messages

function showContactMessage(message, type = 'success') {

    contactFormMessage.textContent = message;

    contactFormMessage.className = `message ${type}`;

    contactFormMessage.hidden = false;

}

// Buttons

function setContactButtonLoading(isLoading) {

    if (isLoading) {

        contactButton.textContent = 'Sending...';

        contactButton.disabled = true;

    } else {

        contactButton.textContent = 'Send Message';

        contactButton.disabled = false;

    }

}

// CONTACT FORM

function finishContactSubmission() {

    const name = contactName.value.trim();

    setContactButtonLoading(false);

    showContactMessage(`Thanks, ${name}. Your Message passed validation`);

    contactForm.focus();

}

function submitContactForm() {

    const name = contactName.value.trim();

    const email = contactEmail.value.trim();

    const message = contactMessage.value.trim();

    if (!name || !email || !message) {

        showContactMessage('Please fill in all fields', 'error');

        return;

    }

    if (!contactEmail.validity.valid) {

        showContactMessage('Please enter a valid email address', 'error');

        return;

    }

    if (message.length < 10) {

        showContactMessage('Your message must be at least 10 characters', 'error');

        return;

    }

    setContactButtonLoading(true);

    setTimeout(finishContactSubmission, 600);

}

function handleContactFormSubmit(event) {

    event.preventDefault();

    submitContactForm();

}

function setupContactPage() {

    if (contactForm) {

        contactForm.addEventListener('submit', handleContactFormSubmit);

    }

}

document.addEventListener('DOMContentLoaded', setupContactPage);