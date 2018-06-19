'use strict';

(function () {


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

  var makePins = function (offerObjects) {
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < offerObjects.length; i++) {
      docFragment.appendChild(makePin(offerObjects[i], i));
    }
    mapPinsElement.appendChild(docFragment);
  };
})();
