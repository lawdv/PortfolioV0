// Smooth Scroll para los enlaces de navegación
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Manejo del formulario y modal
const contactForm = document.getElementById('contact-form');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');

// Función para mostrar el modal
function showModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.style.display = 'flex';
}

// Función para cerrar el modal
function closeModal() {
  modal.style.display = 'none';
}

// Cerrar modal al hacer clic en la X
modalClose.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Validación y envío del formulario con AJAX
contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita el envío por defecto

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    showModal('Error', 'Por favor, completa todos los campos.');
    return;
  }

  // Enviar datos a Formspree usando AJAX
  const formData = new FormData(contactForm);
  fetch(contactForm.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        showModal('¡Mensaje Enviado!', 'Gracias por contactarme. Te responderé pronto.');
        contactForm.reset(); // Limpia el formulario
      } else {
        showModal('Error', 'Hubo un problema al enviar el mensaje. Intenta de nuevo.');
      }
    })
    .catch(() => {
      showModal('Error', 'No se pudo conectar con el servidor. Verifica tu conexión.');
    });
});

// Cambio de tema
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Función para alternar tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Actualizar ícono
  themeIcon.classList.remove(newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
  themeIcon.classList.add(newTheme === 'dark' ? 'fa-moon' : 'fa-sun');
}

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.classList.add(savedTheme === 'dark' ? 'fa-moon' : 'fa-sun');

// Evento para el botón
themeToggle.addEventListener('click', toggleTheme);