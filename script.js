const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const orderForm = document.querySelector('#orderForm');
const formMessage = document.querySelector('#formMessage');

menuButton.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const planType = document.querySelector('#planType').value;
  const message = document.querySelector('#message').value.trim();

  const subject = encodeURIComponent(`Demande de plan - ${planType}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nJe m'appelle ${name}.\nMon e-mail : ${email}\nType de plan : ${planType}\n\nMon projet :\n${message}\n\nMerci.`
  );

  formMessage.textContent = 'Ton application e-mail va s’ouvrir. Pense à remplacer l’adresse de contact dans le code.';
  window.location.href = `mailto:anqbr317@gmail.com?subject=${subject}&body=${body}`;
});
