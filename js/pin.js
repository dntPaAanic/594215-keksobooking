'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var activePin;

  var mapPinElement = document.querySelector('template').content.querySelector('.map__pin');

  // функция убирает активное состояние у метки
  var removePinActiveState = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // функция добавляет активное состояние для текущей метки
  var addCurrentPinActiveState = function (currentPin) {
    removePinActiveState();
    currentPin.classList.add('map__pin--active');
    activePin = currentPin;
  };

  var makePin = function (offerObject, offerNumber) {
    var newPinElement = mapPinElement.cloneNode(true);
    var newPinIconElement = newPinElement.querySelector('.map__pin img');
    newPinElement.style.left = offerObject.location.x - PIN_WIDTH / 2 + 'px';
    newPinElement.style.top = offerObject.location.y - PIN_HEIGHT + 'px';
    newPinIconElement.src = offerObject.author.avatar;
    newPinIconElement.alt = offerObject.offer.title;
    newPinElement.tabIndex = offerNumber;
    newPinElement.addEventListener('click', function (evt) {
      window.card.onMapPinClick(evt, offerObject);
    });
    return newPinElement;
  };


  window.pin = {
    make: makePin,
    addCurrentActiveState: addCurrentPinActiveState,
    removeActiveState: removePinActiveState
  };
})();
