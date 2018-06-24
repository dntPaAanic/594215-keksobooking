'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var OFFERS_COUNT = 5;

  var pinsElement = document.querySelector('.map__pins');
  var mapPinElement = document.querySelector('template').content.querySelector('.map__pin');

  var makePin = function (offerObject, offerNumber) {
    var newPinElement = mapPinElement.cloneNode(true);
    var newPinIconElement = newPinElement.querySelector('.map__pin img');
    newPinElement.style.left = offerObject.location.x - PIN_WIDTH / 2 + 'px';
    newPinElement.style.top = offerObject.location.y - PIN_HEIGHT + 'px';
    newPinIconElement.src = offerObject.author.avatar;
    newPinIconElement.alt = offerObject.offer.title;
    newPinElement.tabIndex = offerNumber;
    newPinElement.dataset.index = offerNumber;
    return newPinElement;
  };

  // Создает пины
  var makePins = function (pins) {
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < OFFERS_COUNT; i++) {
      docFragment.appendChild(makePin(pins[i], i));
    }
    pinsElement.appendChild(docFragment);
  };

  // Удаляет пины
  var deletePins = function () {
    var pinElement = pinsElement.querySelectorAll('.map__pin');
    for (var i = 1; i < pinElement.length; i++) {
      pinsElement.removeChild(pinElement[i]);
    }
  };

  window.pin = {
    deletePins: deletePins,
    makePins: makePins
  };
})();
