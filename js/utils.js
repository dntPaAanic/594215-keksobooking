'use strict';

(function () {
  var ESCAPE_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var errorElement = document.createElement('div');

  // ивент по нажатию клавиши escape
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESCAPE_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  var hideErrorMessage = function () {
    setTimeout(function () {
      errorElement.classList.add('hidden');
    }, 10000);
  };

  var onError = function (errorMessage) {
    errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    errorElement.style.color = '#000000';
    errorElement.style.textAlign = 'center';
    errorElement.style.margin = 'center auto';
    errorElement.style.position = 'fixed';
    errorElement.style.left = '0';
    errorElement.style.right = '0';
    errorElement.style.fontSize = '30px';
    errorElement.style.zIndex = '2';
    errorElement.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorElement);
    hideErrorMessage();
  };

  window.utils = {
    onError: onError,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };
})();
