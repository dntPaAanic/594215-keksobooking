'use strict';

var mapElement = document.querySelector('.map');
var mapFiltersElement = document.querySelector('.map__filters-container');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');

var mapCardElement = document.querySelector('template').content.querySelector('.map__card');

var mapPinMainWidth = mapPinMainElement.offsetWidth;
var mapPinMainHeight = mapPinMainElement.offsetHeight;
var mapPinMainLeft = mapPinMainElement.offsetLeft;
var mapPinMainTop = mapPinMainElement.offsetTop;
var offerTitle = OFFER_TITLE.slice();

var makePins = function (offerObjects) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < offerObjects.length; i++) {
    docFragment.appendChild(window.pin.makePin(offerObjects[i], i));
  }
  mapPinsElement.appendChild(docFragment);
};

var accomodationType = function (val) {
  var typeOffer = '';
  switch (val) {
    case 'flat':
      typeOffer = 'Квартира';
      break;
    case 'bungalo':
      typeOffer = 'Бунгало';
      break;
    case 'house':
      typeOffer = 'Дом';
      break;
    case 'palace':
      typeOffer = 'Дворец';
      break;
  }
  return typeOffer;
};

// Переключает карту из неактивного состояния
var toggleMapDisabled = function (mapDisabled) {
  mapElement.classList.toggle('map--faded', mapDisabled);
};

// Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
var onClickActivatePage = function () {
  toggleMapDisabled(false);
  window.form.toggleFormDisabled(false);
  makePins(offers);
  mapElement.addEventListener('click', onMapPinClick);
  mapPinMainElement.removeEventListener('mouseup', onClickActivatePage);
  window.form.validateGuests();
};

// удаляет попап
var removePopup = function () {
  var popupElement = mapElement.querySelector('.popup');
  if (popupElement) {
    mapElement.removeChild(popupElement);
  }
};



// добавляет обработчик клика по карте
var onMapPinClick = function (evt) {
  var targetPinElement = evt.target.closest('.map__pin');
  if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
    showOffer(offers[targetPinElement.dataset.index]);
    var popupCloseElement = document.querySelector('.popup__close');
    popupCloseElement.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscapePress);
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
    var calculationStartMainPinMinCoordY = LOCATION_Y_MIN - mapPinMainHeight - MAP_MAIN_PIN_TAIL;
    var calculationStartMainPinMaxCoordY = LOCATION_Y_MAX - mapPinMainHeight - MAP_MAIN_PIN_TAIL;
    shiftOffsetY = shiftOffsetY < calculationStartMainPinMinCoordY ? calculationStartMainPinMinCoordY : shiftOffsetY;
    shiftOffsetY = shiftOffsetY > calculationStartMainPinMaxCoordY ? calculationStartMainPinMaxCoordY : shiftOffsetY;

    shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
    shiftOffsetX = shiftOffsetX > MAP_MAIN_PIN_MAX_COORD_X ? MAP_MAIN_PIN_MAX_COORD_X : shiftOffsetX;

    mapPinMainElement.style.top = shiftOffsetY + 'px';
    mapPinMainElement.style.left = shiftOffsetX + 'px';
    window.form.setAddress(Math.round(shiftOffsetX + mapPinMainWidth / 2), shiftOffsetY + LOCATION_Y_INFELICITY);
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
