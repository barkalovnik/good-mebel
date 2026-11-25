document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mebelForm');
  const alertBox = document.getElementById('mebelAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      if (!phone) return;

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `Спасибо, ${name || 'клиент'}! Дизайнер GOOD MEBEL свяжется с вами по номеру ${phone} для согласования удобного времени замера на ул. Бажова или у вас дома.`;
      }
      form.reset();
    });
  }
});
