'use strict';

var mapElement = document.querySelector('.map');

var mapPinsElement = document.querySelector('.map__pins');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');

var mapPinMainWidth = mapPinMainElement.offsetWidth;
var mapPinMainHeight = mapPinMainElement.offsetHeight;
var mapPinMainLeft = mapPinMainElement.offsetLeft;
var mapPinMainTop = mapPinMainElement.offsetTop;


var makePins = function (offerObjects) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < offerObjects.length; i++) {
    docFragment.appendChild(window.pin.makePin(offerObjects[i], i));
  }
  mapPinsElement.appendChild(docFragment);
};

// Переключает карту из неактивного состояния
var toggleMapDisabled = function (mapDisabled) {
  mapElement.classList.toggle('map--faded', mapDisabled);
};

// Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
var onClickActivatePage = function () {
  toggleMapDisabled(false);
  window.form.toggleFormDisabled(false);
  makePins(window.data.offers);
  mapElement.addEventListener('click', onMapPinClick);
  mapPinMainElement.removeEventListener('mouseup', onClickActivatePage);
  window.form.validateGuests();
};

// добавляет обработчик клика по карте
var onMapPinClick = function (evt) {
  var targetPinElement = evt.target.closest('.map__pin');
  if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
    window.card.showOffer(window.data.offers[targetPinElement.dataset.index]);
    var popupCloseElement = document.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', window.card.onPopupCloseClick);
    document.addEventListener('keydown', window.card.onPopupEscapePress);
  }
};

// Создает обработчик отпускания кнопки мыши
if (mapPinMainElement) {
  mapPinMainElement.addEventListener('mouseup', onClickActivatePage);
}

mapPinMainElement.addEventListener('mousedown', function (evt) {
  toggleMapDisabled(false);
  window.form.toggleFormDisabled(false);
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: moveEvt.clientX - startCoords.x,
      y: moveEvt.clientY - startCoords.y
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    var shiftOffsetY = mapPinMainElement.offsetTop + shift.y;
    var shiftOffsetX = mapPinMainElement.offsetLeft + shift.x;
    var calculationStartMainPinMinCoordY = window.data.locationMinY - mapPinMainHeight - window.data.mapMainPinTail;
    var calculationStartMainPinMaxCoordY = window.data.locationMaxY - mapPinMainHeight - window.data.mapMainPinTail;
    shiftOffsetY = shiftOffsetY < calculationStartMainPinMinCoordY ? calculationStartMainPinMinCoordY : shiftOffsetY;
    shiftOffsetY = shiftOffsetY > calculationStartMainPinMaxCoordY ? calculationStartMainPinMaxCoordY : shiftOffsetY;

    shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
    shiftOffsetX = shiftOffsetX > window.data.mainPinMaxX ? window.data.mainPinMaxX : shiftOffsetX;

    mapPinMainElement.style.top = shiftOffsetY + 'px';
    mapPinMainElement.style.left = shiftOffsetX + 'px';
    window.form.setAddress(Math.round(shiftOffsetX + mapPinMainWidth / 2), shiftOffsetY + window.data.locationInfelicityY);
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// по-умолчанию карта и формы отключены
toggleMapDisabled(true);

window.map = {
  mapPinMainLeft: mapPinMainLeft,
  mapPinMainWidth: mapPinMainWidth,
  mapPinMainTop: mapPinMainTop,
  mapPinMainHeight: mapPinMainHeight,
};
