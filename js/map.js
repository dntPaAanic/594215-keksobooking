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

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var ESCAPE_KEYCODE = 27;

var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
var mapPins = document.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = document.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');

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
  var indexRandom = getRandomIndex(arr);
  var splicedElement = arr.splice(indexRandom, 1);
  return splicedElement[0];
};

var offerTitle = OFFER_TITLE.slice();

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

var getOfferInfo = function (index) {
  var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

  return {
    'author': {
      'avatar': AVATAR_LINK_PATH + AVATAR_NAME_PREFIX + (index + 1) + AVATAR_FILENAME_EXTENSION
    },
    'offer': {
      'title': getRandomUniqueElement(offerTitle),
      'address': locationX + ',' + locationY,
      'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
      'type': getRandomElement(TYPES),
      'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      'guests': getRandomNumber(GUEST_MIN, GUEST_MAX),
      'checkin': getRandomElement(TIME_CHECK_IN),
      'checkout': getRandomElement(TIME_CHECK_OUT),
      'features': getShuffleArrayWithRandomLength(FEATURES),
      'description': '',
      'photos': getShuffleArray(PHOTOS)
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


var makePin = function (offerObject, offerNumber) {
  var newPin = mapPin.cloneNode(true);
  var addNewPin = newPin.querySelector('.map__pin img');
  newPin.style.left = offerObject.location.x - PIN_WIDTH / 2 + 'px';
  newPin.style.top = offerObject.location.y - PIN_HEIGHT + 'px';
  addNewPin.src = offerObject.author.avatar;
  addNewPin.alt = offerObject.offer.title;
  newPin.tabIndex = offerNumber;
  return newPin;
};

var makePins = function (offerObjects) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < offerObjects.length; i++) {
    docFragment.appendChild(makePin(offerObjects[i], i));
  }
  mapPins.appendChild(docFragment);
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
  var CardElement = mapCard.cloneNode(true);
  CardElement.querySelector('.popup__title').textContent = offerData.offer.title;
  CardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
  CardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  CardElement.querySelector('.popup__type').textContent = accomodationType(offerData.offer.type);
  CardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  CardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  CardElement.querySelector('.popup__features').innerHTML = '';
  CardElement.querySelector('.popup__features').appendChild(createFeaturesList(offerData.offer.features));
  CardElement.querySelector('.popup__photos').innerHTML = '';
  CardElement.querySelector('.popup__photos').appendChild(createPhotosList(offerData.offer.photos));
  CardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
  return CardElement;
};


// ******************** module4-task-1 ***************************//
// Переключает форму из неактивного состояния
var toggleFormDisabled = function (formDisabled) {
  adForm.classList.toggle('ad-form--disabled', formDisabled);
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = formDisabled;
  }
};

// Переключает карту из неактивного состояния
var toggleMapDisabled = function (mapDisabled) {
  map.classList.toggle('map--faded', mapDisabled);
};

// Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
var onClickActivatePage = function () {
  toggleMapDisabled(false);
  toggleFormDisabled(false);
  makePins(offers);
  map.addEventListener('click', onMapPinClick);
  mapPinMain.removeEventListener('mouseup', onClickActivatePage);
};

// удаляет попап
var removePopup = function () {
  var popup = map.querySelector('.popup');
  if (popup) {
    map.removeChild(popup);
  }
};

// показывает новый попап после удаления первоначального (если попап сначала есть, то он удаляется, потом создается новый)
var showAdvert = function (offer) {
  removePopup();
  var currentAdvert = createCardOffer(offer);
  map.insertBefore(currentAdvert, mapFilters);
};

// убирает активное состояние у пина
var removeActivePin = function () {
  var activePin = mapPins.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// Добавляет активное состояние пину
var addCurrentActivePin = function (currentPin) {
  removeActivePin();
  currentPin.classList.add('map__pin--active');
};

// закрытие попапа
var closePopup = function () {
  removePopup();
  removeActivePin();
  document.removeEventListener('keydown', onPopupEscapePress);
};

// функция нажатия Esc
var onPopupEscapePress = function (evt) {
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closePopup();
  }
};

// функция клика на крестик
var onPopupCloseClick = function () {
  closePopup();
};

// Создает обработчик отпускания кнопки мыши
if (mapPinMain) {
  mapPinMain.addEventListener('mouseup', onClickActivatePage);
}

// добавляет обработчик клика по карте
var onMapPinClick = function (evt) {
  var targetPin = evt.target.closest('.map__pin');
  if (targetPin && targetPin.classList.contains('map__pin') && !targetPin.classList.contains('map__pin--main')) {
    showAdvert(offers[targetPin.tabIndex]);
    addCurrentActivePin(targetPin);
    var popup = document.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscapePress);
  }
};

// Получает координаты адреса по умолчанию
var getAddress = function () {
  if (mapPinMain) {
    var pinLeft = window.getComputedStyle(mapPinMain, null).getPropertyValue('left').slice(0, -2);
    var pinTop = window.getComputedStyle(mapPinMain, null).getPropertyValue('top').slice(0, -2);
    addressField.value = pinLeft + ', ' + pinTop;
  }
};

getAddress();

// по-умолчанию карта и формы отключены
toggleMapDisabled(true);
toggleFormDisabled(true);

var offers = getOffers(OFFERS_COUNT);
