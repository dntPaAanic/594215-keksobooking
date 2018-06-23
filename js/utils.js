'use strict';

(function () {
  var ESCAPE_KEYCODE = 27;
  // ивент по нажатию клавиши escape
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESCAPE_KEYCODE) {
      action();
    }
  };

  window.utils = {
    isEscEvent: isEscEvent
  };
})();
