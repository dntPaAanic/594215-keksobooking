'use strict';

var OFFERS_COUNT = 8;

var AVATAR_LINK_PATH = 'img/avatars/user';
var AVATAR_NAME_PREFIX = 0;
var AVATAR_FILENAME_EXTENSION = '.png';

var OFFER_TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUEST_MIN = 1;
var GUEST_MAX = 15;
var TIME_CHECK_IN = [
  '12:00',
  '13:00',
  '14:00'
];
var TIME_CHECK_OUT = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var LOCATION_Y_INFELICITY = 80;

var MAP_MAIN_PIN_MAX_COORD_X = 1140;
var MAP_MAIN_PIN_TAIL = 15;

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

var getOfferInfo = function (index) {
  var locationX = window.utils.getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = window.utils.getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

  return {
    'author': {
      'avatar': AVATAR_LINK_PATH + AVATAR_NAME_PREFIX + (index + 1) + AVATAR_FILENAME_EXTENSION
    },
    'offer': {
      'title': window.utils.getRandomUniqueElement(offerTitle),
      'address': locationX + ',' + locationY,
      'price': window.utils.getRandomNumber(PRICE_MIN, PRICE_MAX),
      'type': window.utils.getRandomElement(TYPES),
      'rooms': window.utils.getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      'guests': window.utils.getRandomNumber(GUEST_MIN, GUEST_MAX),
      'checkin': window.utils.getRandomElement(TIME_CHECK_IN),
      'checkout': window.utils.getRandomElement(TIME_CHECK_OUT),
      'features': window.utils.getShuffleArrayWithRandomLength(FEATURES),
      'description': '',
      'photos': window.utils.getShuffleArray(PHOTOS)
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

var getOffers = function (offersCount) {
  var offers = [];
  for (var i = 0; i < offersCount; i++) {
    offers.push(getOfferInfo(i));
  }
  return offers;
};

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

var createFeaturesList = function (features) {
  var featuresList = document.createDocumentFragment();
  for (var i = 0; i < features.length; i++) {
    var liElement = document.createElement('li');
    liElement.classList.add('popup__feature');
    liElement.classList.add('popup__feature--' + features[i]);
    featuresList.appendChild(liElement);
  }
  return featuresList;
};

var createPhotosList = function (photosArray) {
  var photoList = document.createDocumentFragment();
  for (var i = 0; i < photosArray.length; i++) {
    var mapCardPhotoElement = document.createElement('img');
    mapCardPhotoElement.classList.add('popup__photo');
    mapCardPhotoElement.src = photosArray[i];
    mapCardPhotoElement.width = 45;
    mapCardPhotoElement.height = 40;
    mapCardPhotoElement.alt = 'Фотография жилья';
    photoList.appendChild(mapCardPhotoElement);
  }
  return photoList;
};

// создает текст объявления
var createCardOffer = function (offerData) {
  var cardElement = mapCardElement.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = accomodationType(offerData.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = '';
  cardElement.querySelector('.popup__features').appendChild(createFeaturesList(offerData.offer.features));
  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(createPhotosList(offerData.offer.photos));
  cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
  return cardElement;
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

// показывает новый попап после удаления первоначального (если попап сначала есть, то он удаляется, потом создается новый)
var showOffer = function (offer) {
  removePopup();
  var currentOfferElement = createCardOffer(offer);
  mapElement.insertBefore(currentOfferElement, mapFiltersElement);
};

// закрытие попапа
var closePopup = function () {
  removePopup();
  document.removeEventListener('keydown', onPopupEscapePress);
};

// функция нажатия Esc
var onPopupEscapePress = function (evt) {
  window.utils.isEscEvent(evt, closePopup);
};

// функция клика на крестик
var onPopupCloseClick = function () {
  closePopup();
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

var offers = getOffers(OFFERS_COUNT);

window.map = {
  mapPinMainLeft: mapPinMainLeft,
  mapPinMainWidth: mapPinMainWidth,
  mapPinMainTop: mapPinMainTop,
  mapPinMainHeight: mapPinMainHeight,
  MAP_MAIN_PIN_TAIL: MAP_MAIN_PIN_TAIL
};
