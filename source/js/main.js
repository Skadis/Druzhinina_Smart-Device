'use strict';

(function () {

  const navigation = document.querySelector('.nav');
  const navigationButton = navigation.querySelector('.nav__toggle');
  const contacts = document.querySelector('.contacts');
  const contactsButton = contacts.querySelector('.contacts__toggle');
  const consultationButton = document.querySelector('.main-screen__link');

  navigation.classList.remove('nav--no-js');
  contacts.classList.remove('contacts--no-js');
  navigation.classList.add('nav--close');
  contacts.classList.add('contacts--close');

  navigationButton .addEventListener('click', () => {
    if (navigation.classList.contains('nav--close') && contacts.classList.contains('contacts--open')) {
      navigation.classList.add('nav--open');
      navigation.classList.remove('nav--close');
      contacts.classList.add('contacts--close');
      contacts.classList.remove('contacts--open');
    } else if (navigation.classList.contains('nav--open')) {
      navigation.classList.add('nav--close');
      navigation.classList.remove('nav--open');
    } else {
      navigation.classList.add('nav--open');
      navigation.classList.remove('nav--close');
    }
  });

  contactsButton.addEventListener('click', () => {
    if (navigation.classList.contains('nav--open') && contacts.classList.contains('contacts--close')) {
      navigation.classList.add('nav--close');
      navigation.classList.remove('nav--open');
      contacts.classList.add('contacts--open');
      contacts.classList.remove('contacts--close');
    } else if (contacts.classList.contains('contacts--open')) {
      contacts.classList.add('contacts--close');
      contacts.classList.remove('contacts--open');
    } else {
      contacts.classList.add('contacts--open');
      contacts.classList.remove('contacts--close');
    }

  });

  consultationButton.addEventListener('click', (event) => {
    const linkID = document.querySelector(consultationButton.getAttribute('href'));
    event.preventDefault();
    linkID.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
})();

(function () {
  function setCursorPosition(pos, el) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }

  function mask(event) {
    const matrix = '+7 (___) ___ ____';
    let i = 0;
    const def = matrix.replace(/\D/g, '');
    const val = event.target.value.replace(/\D/g, '');
    if (def.length >= val.length) {
      val = def;
    }
    event.target.value = matrix.replace(/./g, function (a) {
      if (/[_\d]/.test(a) && i < val.length) {
        return val.charAt(i++);
      } else {
        if (i >= val.length) {
          return '';
        } else {
          return a;
        }
      }
    });
    if (event.type === 'blur') {
      if (event.target.value.length === 2) {
        event.target.value = '';
      }
    } else {
      setCursorPosition(event.target.value.length, event.target);
    }
  }
  const consultationPhone = document.querySelector('.consultation__field--phone .consultation__input');
  const modalConsultationPhone = document.querySelector('.modal-consultation__field--phone .modal-consultation__input');

  if (consultationPhone) {
    consultationPhone.addEventListener('input', mask, false);
    consultationPhone.addEventListener('focus', mask, false);
    consultationPhone.addEventListener('blur', mask, false);
  }

  if (modalConsultationPhone) {
    modalConsultationPhone.addEventListener('input', mask, false);
    modalConsultationPhone.addEventListener('focus', mask, false);
    modalConsultationPhone.addEventListener('blur', mask, false);
  }
})();

(function () {
  const modal = document.querySelector('.modal');
  const consultationButton = document.querySelector('.page-header__button');
  const modalForm = document.querySelector('.modal-consultation__form');
  const pageBody = document.querySelector('body');
  const storage = window.localStorage;

  const openModal = function (item, evt) {
    evt.preventDefault();
    if (item) {
      item.classList.add('modal--open');
      pageBody.classList.add('lock');
      const closeModalButton = item.querySelector('.modal__close-button');
      const modalOverlay = pageBody;
      const nameField = item.querySelector('.modal-consultation__field--name input');
      const phoneField = item.querySelector('.modal-consultation__field--phone input');
      const messageField = item.querySelector('.modal-consultation__field--question textarea');

      if (storage.name || storage.tel) {
        nameField.value = storage.getItem('name');
        phoneField.value = storage.getItem('tel');
        messageField.focus();
      } else {
        nameField.focus();
      }
      closeModalButton.addEventListener('click', onCloseButtonPress);
      modalOverlay.addEventListener('click', onOverlayClick);
      window.addEventListener('keydown', onEscKeyPress);
    }
  };

  const closeModal = function () {
    modal.classList.remove('modal--open');
    pageBody.classList.remove('lock');
    const modalOverlay = modal.querySelector('.lock');
    const closeModalButton = modal.querySelector('.modal__close-button');
    closeModalButton.removeEventListener('click', onCloseButtonPress);
    modalOverlay.removeEventListener('click', onOverlayClick);

    window.removeEventListener('keydown', onEscKeyPress);
  };

  const onModalSubmit = function (evt) {
    const tel = evt.target.querySelector('.modal-consultation__field--phone input');
    const name = evt.target.querySelector('.modal-consultation__field--name input');
    const question = evt.target.querySelector('.modal-consultation__field--question textarea');
    if (tel.value && name.value && question.value !== '') {
      evt.preventDefault();
      storage.setItem('tel', tel.value);
      storage.setItem('name', name.value);
      closeModal();
    }
  };

  const onModalOpen = function (evt) {
    openModal(modal, evt);
  };

  const onCloseButtonPress = () => {
    closeModal();
  };

  var onOverlayClick = function (evt) {
    if (evt.target.matches('.lock')) {
      closeModal();
    }
  };

  const onEscKeyPress = function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closeModal();
    }
  };

  if (consultationButton) {
    consultationButton.addEventListener('click', onModalOpen);
  }

  if (modalForm) {
    modalForm.addEventListener('submit', onModalSubmit);
  }
})();
