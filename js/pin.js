'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
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


  window.pin = {
    makePin: makePin
  };
})();
