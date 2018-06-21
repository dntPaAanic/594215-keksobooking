'use strict';

(function () {
  var ESCAPE_KEYCODE = 27;
  // ивент по нажатию клавиши escape
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESCAPE_KEYCODE) {
      action();
    }
  };

  // Функции для работы с переменными и массивами
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var getRandomIndex = function (arr) {
    return Math.round(Math.random() * (arr.length - 1));
  };

  var getRandomUniqueElement = function (arr) {
    var randomIndex = getRandomIndex(arr);
    var randomItem = arr.splice(randomIndex, 1);
    return randomItem[0];
  };

  // Fisher–Yates shuffle
  var getShuffleArray = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var rand = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[rand];
      arr[rand] = temp;
    }
    return arr;
  };

  var getShuffleArrayWithRandomLength = function (array) {
    return getShuffleArray(array).slice(0, getRandomNumber(1, array.length + 1));
  };

  window.utils = {
    isEscEvent: isEscEvent,
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getRandomUniqueElement: getRandomUniqueElement,
    getShuffleArrayWithRandomLength: getShuffleArrayWithRandomLength,
    getShuffleArray: getShuffleArray
  };
})();
