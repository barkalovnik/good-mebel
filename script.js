document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DUAL FILTERING LOGIC (TYPE & STYLE)
  // =========================================================================
  let currentType = 'all';
  let currentStyle = 'all';

  const typeButtons = document.querySelectorAll('#typeFilters .filter-btn');
  const styleButtons = document.querySelectorAll('#styleFilters .filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  function applyFilters() {
    portfolioCards.forEach(card => {
      const cardType = card.getAttribute('data-type');
      const cardStyle = card.getAttribute('data-style');

      const matchType = (currentType === 'all' || cardType === currentType);
      const matchStyle = (currentStyle === 'all' || cardStyle === currentStyle);

      if (matchType && matchStyle) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-type');
      applyFilters();
    });
  });

  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStyle = btn.getAttribute('data-style');
      applyFilters();
    });
  });

  // =========================================================================
  // 2. KASPI INSTALLMENT CALCULATOR LOGIC
  // =========================================================================
  const amountSlider = document.getElementById('kaspiAmountRange');
  const amountDisplay = document.getElementById('kaspiAmountDisplay');
  const termButtons = document.querySelectorAll('#kaspiTerms .term-btn');
  const monthlyPaymentEl = document.getElementById('kaspiMonthlyPayment');
  const selectedTermText = document.getElementById('kaspiSelectedTermText');
  const totalSummaryEl = document.getElementById('kaspiTotalSummary');
  const applyKaspiBtn = document.getElementById('applyKaspiBtn');

  let currentMonths = 12;

  function formatMoney(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
  }

  function updateKaspiCalculation() {
    const amount = parseInt(amountSlider.value, 10);
    amountDisplay.innerText = formatMoney(amount);
    totalSummaryEl.innerText = formatMoney(amount);

    let monthly = 0;
    if (currentMonths === 24) {
      // 24 months credit
      selectedTermText.innerText = '24 месяца (кредитный тариф)';
      monthly = (amount * 1.18) / 24;
    } else {
      // 3, 6, 12 months 0-0-12
      selectedTermText.innerText = `${currentMonths} месяцев (рассрочка 0-0-${currentMonths})`;
      monthly = amount / currentMonths;
    }

    monthlyPaymentEl.innerText = formatMoney(monthly) + ' / мес';
  }

  if (amountSlider) {
    amountSlider.addEventListener('input', updateKaspiCalculation);
  }

  termButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      termButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMonths = parseInt(btn.getAttribute('data-months'), 10);
      updateKaspiCalculation();
    });
  });

  // Initial calc run
  updateKaspiCalculation();

  // =========================================================================
  // 3. SMOOTH SCROLL & AUTOFOCUS ON 3D PROJECT FORM
  // =========================================================================
  const formBox = document.getElementById('formBox');
  const clientNameInput = document.getElementById('clientName');
  const clientCommentInput = document.getElementById('clientComment');
  const mebelTypeSelect = document.getElementById('mebelType');

  function scrollTo3DForm(extraComment = '', presetType = '') {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (presetType && mebelTypeSelect) {
      for (let i = 0; i < mebelTypeSelect.options.length; i++) {
        if (mebelTypeSelect.options[i].value.toLowerCase().includes(presetType.toLowerCase())) {
          mebelTypeSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (extraComment && clientCommentInput) {
      clientCommentInput.value = extraComment;
    }

    setTimeout(() => {
      if (clientNameInput) {
        clientNameInput.focus();
      }
      if (formBox) {
        formBox.classList.add('highlighted');
        setTimeout(() => {
          formBox.classList.remove('highlighted');
        }, 1800);
      }
    }, 600);
  }

  // Header 3D button
  const cta3dBtn = document.querySelector('.btn-cta-3d');
  if (cta3dBtn) {
    cta3dBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo3DForm();
    });
  }

  // Hero 3D button
  const hero3dBtn = document.querySelector('.btn-hero-3d');
  if (hero3dBtn) {
    hero3dBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo3DForm();
    });
  }

  // Kaspi Apply button
  if (applyKaspiBtn) {
    applyKaspiBtn.addEventListener('click', () => {
      const amount = parseInt(amountSlider.value, 10);
      const comment = `Рассрочка Kaspi: ${formatMoney(amount)} на ${currentMonths} мес.`;
      scrollTo3DForm(comment);
    });
  }

  // Select project buttons in portfolio cards
  const selectProjectButtons = document.querySelectorAll('.btn-select-project');
  selectProjectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project') || '';
      let presetType = 'Кухонный';
      if (projectName.toLowerCase().includes('шкаф')) presetType = 'Шкаф';
      if (projectName.toLowerCase().includes('гардеробная')) presetType = 'Гардеробная';

      scrollTo3DForm(`Интересует проект: ${projectName}`, presetType);
    });
  });

  // =========================================================================
  // 4. FORM SUBMISSION HANDLER
  // =========================================================================
  const form = document.getElementById('mebelForm');
  const alertBox = document.getElementById('mebelAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const type = document.getElementById('mebelType').value;
      const comment = clientCommentInput ? clientCommentInput.value.trim() : '';

      if (!phone) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Отправка...</span>';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = `Спасибо, ${name || 'клиент'}! Заявка на бесплатный 3D-проект принята. Дизайнер GOOD MEBEL свяжется с вами по номеру ${phone} для согласования выезда с образцами материалов на ул. Бажова или у вас дома.`;
        }

        submitBtn.innerHTML = '<span>Заявка отправлена</span>';
        submitBtn.style.background = '#15803d';

        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = '';
          submitBtn.style.opacity = '1';
        }, 3000);
      }, 500);
    });
  }
});
