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
var LOCATION_Y_INFELICITY = 50;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var ESCAPE_KEYCODE = 27;

var MIN_PRICE_FOR_NIGHT = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var ROOM_NUMBER_AND_CAPACITY = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var MAP_MAIN_PIN_MIN_COORD_Y = 130;
var MAP_MAIN_PIN_MAX_COORD_Y = 630;
var MAP_MAIN_PIN_MAX_COORD_X = 1140;
var MAP_MAIN_PIN_TAIL = 15;

var mapElement = document.querySelector('.map');
var mapFiltersElement = document.querySelector('.map__filters-container');
var mapPinsElement = document.querySelector('.map__pins');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var mapPinElement = document.querySelector('template').content.querySelector('.map__pin');
var mapCardElement = document.querySelector('template').content.querySelector('.map__card');

var adFormElement = document.querySelector('.ad-form');
var adFormFieldsetsElement = document.querySelectorAll('fieldset');
var addressFieldElement = adFormElement.querySelector('#address');
var timeInFieldElement = adFormElement.querySelector('#timein');
var timeOutFieldElement = adFormElement.querySelector('#timeout');
var roomTypeFieldElement = adFormElement.querySelector('#type');
var priceForNightFieldElement = adFormElement.querySelector('#price');
var roomNumberElement = adFormElement.querySelector('#room_number');
var capacityElement = adFormElement.querySelector('#capacity');
var mapPinMainWidth = mapPinMainElement.offsetWidth;
var mapPinMainHeight = mapPinMainElement.offsetHeight;
var mapPinMainLeft = mapPinMainElement.offsetLeft;
var mapPinMainTop = mapPinMainElement.offsetTop;

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

// Переключает форму из неактивного состояния
var toggleFormDisabled = function (formDisabled) {
  adFormElement.classList.toggle('ad-form--disabled', formDisabled);
  for (var i = 0; i < adFormFieldsetsElement.length; i++) {
    adFormFieldsetsElement[i].disabled = formDisabled;
  }
};

// Переключает карту из неактивного состояния
var toggleMapDisabled = function (mapDisabled) {
  mapElement.classList.toggle('map--faded', mapDisabled);
};

// Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
var onClickActivatePage = function () {
  toggleMapDisabled(false);
  toggleFormDisabled(false);
  makePins(offers);
  mapElement.addEventListener('click', onMapPinClick);
  mapPinMainElement.removeEventListener('mouseup', onClickActivatePage);
  validateGuests();
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
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closePopup();
  }
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
var setAddressMainPinFieldValue = function (pinLeft, pinTop) {
  addressFieldElement.value = pinLeft + ', ' + pinTop;
};

// добавляет координаты пина при неактивной карте
var getAddress = function () {
  var pinLeft = Math.round((mapPinMainLeft + (mapPinMainWidth / 2)));
  var pinTop = Math.round((mapPinMainTop - mapPinMainHeight - MAP_MAIN_PIN_TAIL));
  setAddressMainPinFieldValue(pinLeft, pinTop);
};

var changeTimeSelection = function (checkIn, checkOut) {
  checkOut.value = checkIn.value;
};

// меняет минимальное значение цены и placeholder поля "Цена за ночь" в зависимости от выбора типа жилья
var changeTypeSelection = function () {
  var minValuePrice = MIN_PRICE_FOR_NIGHT[roomTypeFieldElement.value];
  priceForNightFieldElement.setAttribute('min', minValuePrice);
  priceForNightFieldElement.setAttribute('placeholder', minValuePrice);
};

// Определяет соответствие количества комнат и гостей
var validateGuests = function () {
  var roomNumberValue = roomNumberElement.value;
  var capacityValue = capacityElement.value;
  var capacityArray = ROOM_NUMBER_AND_CAPACITY[roomNumberValue];
  roomNumberElement.setCustomValidity('');
  roomNumberElement.checkValidity();
  if (capacityArray.indexOf(capacityValue) < 0) {
    roomNumberElement.setCustomValidity('Количество комнат не подходит для количества гостей');
  }
};
// Создает обработчик отпускания кнопки мыши
if (mapPinMainElement) {
  mapPinMainElement.addEventListener('mouseup', onClickActivatePage);
}

timeInFieldElement.addEventListener('change', function () {
  changeTimeSelection(timeInFieldElement, timeOutFieldElement);
});
timeOutFieldElement.addEventListener('change', function () {
  changeTimeSelection(timeOutFieldElement, timeInFieldElement);
});
roomTypeFieldElement.addEventListener('change', changeTypeSelection);
roomNumberElement.addEventListener('change', validateGuests);
capacityElement.addEventListener('change', validateGuests);

mapPinMainElement.addEventListener('mousedown', function (evt) {
  toggleMapDisabled(false);
  toggleFormDisabled(false);
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
    var calculationStartMainPinMinCoordY = MAP_MAIN_PIN_MIN_COORD_Y - mapPinMainHeight - MAP_MAIN_PIN_TAIL;
    var calculationStartMainPinMaxCoordY = MAP_MAIN_PIN_MAX_COORD_Y - mapPinMainHeight - MAP_MAIN_PIN_TAIL;
    shiftOffsetY = shiftOffsetY < calculationStartMainPinMinCoordY ? calculationStartMainPinMinCoordY : shiftOffsetY;
    shiftOffsetY = shiftOffsetY > calculationStartMainPinMaxCoordY ? calculationStartMainPinMaxCoordY : shiftOffsetY;

    shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
    shiftOffsetX = shiftOffsetX > MAP_MAIN_PIN_MAX_COORD_X ? MAP_MAIN_PIN_MAX_COORD_X : shiftOffsetX;

    mapPinMainElement.style.top = shiftOffsetY + 'px';
    mapPinMainElement.style.left = shiftOffsetX + 'px';
    setAddressMainPinFieldValue(Math.round(shiftOffsetX + mapPinMainWidth / 2), shiftOffsetY - LOCATION_Y_INFELICITY);
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

getAddress();
// по-умолчанию карта и формы отключены
toggleMapDisabled(true);
toggleFormDisabled(true);

var offers = getOffers(OFFERS_COUNT);
