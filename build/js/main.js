'use strict';

(function () {

  const navigation = document.querySelector('.nav');
  const navigationButton = navigation.querySelector('.nav__toggle');
  const contacts = document.querySelector('.contacts');
  const contactsButton = contacts.querySelector('.contacts__toggle');
  const consultationButton = document.querySelector('.main-screen__link');
  const CONTACTS_CLOSE_CLASS = 'contacts--close';
  const CONTACTS_OPEN_CLASS = 'contacts--open';
  const NAV_CLOSE_CLASS = 'nav--close';
  const NAV_OPEN_CLASS = 'nav--open';

  navigation.classList.remove('nav--no-js');
  contacts.classList.remove('contacts--no-js');
  navigation.classList.add(NAV_CLOSE_CLASS);
  contacts.classList.add(CONTACTS_CLOSE_CLASS);

  navigationButton.addEventListener('click', () => {
    if (navigation.classList.contains(NAV_CLOSE_CLASS) && contacts.classList.contains(CONTACTS_OPEN_CLASS)) {
      navigation.classList.add(NAV_OPEN_CLASS);
      navigation.classList.remove(NAV_CLOSE_CLASS);
      contacts.classList.add(CONTACTS_CLOSE_CLASS);
      contacts.classList.remove(CONTACTS_OPEN_CLASS);
    } else if (navigation.classList.contains(NAV_OPEN_CLASS)) {
      navigation.classList.add(NAV_CLOSE_CLASS);
      navigation.classList.remove(NAV_OPEN_CLASS);
    } else {
      navigation.classList.add(NAV_OPEN_CLASS);
      navigation.classList.remove(NAV_CLOSE_CLASS);
    }
  });

  contactsButton.addEventListener('click', () => {
    if (navigation.classList.contains(NAV_OPEN_CLASS) && contacts.classList.contains(CONTACTS_CLOSE_CLASS)) {
      navigation.classList.add(NAV_CLOSE_CLASS);
      navigation.classList.remove(NAV_OPEN_CLASS);
      contacts.classList.add(CONTACTS_OPEN_CLASS);
      contacts.classList.remove(CONTACTS_CLOSE_CLASS);
    } else if (contacts.classList.contains(CONTACTS_OPEN_CLASS)) {
      contacts.classList.add(CONTACTS_CLOSE_CLASS);
      contacts.classList.remove(CONTACTS_OPEN_CLASS);
    } else {
      contacts.classList.add(CONTACTS_OPEN_CLASS);
      contacts.classList.remove(CONTACTS_CLOSE_CLASS);
    }
  });

  consultationButton.addEventListener('click', (event) => {
    const scrollSection = document.querySelector('.consultation');

    if (scrollSection) {
      const linkID = document.querySelector(consultationButton.getAttribute('href'));
      event.preventDefault();
      linkID.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
})();

(function () {

  const consultationPhone = document.querySelector('.consultation__field--phone input');
  const modalConsultationPhone = document.querySelector('.modal-consultation__field--phone input');
  const MATRIX = '+7 (___) ___ ____';

  function setCursorPosition(pos, el) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }

  function setMask(event) {
    let i = 0;
    const def = MATRIX.replace(/\D/g, '');
    let val = event.target.value.replace(/\D/g, '');
    if (def.length >= val.length) {
      val = def;
    }
    event.target.value = MATRIX.replace(/./g, function (a) {
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

  if (consultationPhone) {
    consultationPhone.addEventListener('input', setMask, false);
    consultationPhone.addEventListener('focus', setMask, false);
    consultationPhone.addEventListener('blur', setMask, false);
  }

  if (modalConsultationPhone) {
    modalConsultationPhone.addEventListener('input', setMask, false);
    modalConsultationPhone.addEventListener('focus', setMask, false);
    modalConsultationPhone.addEventListener('blur', setMask, false);
  }
})();

(function () {
  const modal = document.querySelector('.modal');
  const consultationButton = document.querySelector('.page-header__button');
  const modalForm = document.querySelector('.modal-consultation__form');
  const modalOverlay = document.querySelector('.modal__overlay');
  const pageBody = document.querySelector('body');
  const focusManagerLib = focusManager; // eslint-disable-line
  const storage = window.localStorage;

  const openModal = function (item, evt) {
    evt.preventDefault();
    if (item) {
      item.classList.add('modal--open');
      modalOverlay.classList.add('lock');
      pageBody.classList.add('lock');
      focusManagerLib.capture(modal);
      const closeModalButton = item.querySelector('.modal__close-button');
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
    const closeModalButton = modal.querySelector('.modal__close-button');
    closeModalButton.removeEventListener('click', onCloseButtonPress);
    modalOverlay.removeEventListener('click', onOverlayClick);
    focusManagerLib.release(modal);
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
