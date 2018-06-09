'use strict';

var OFFERS_COUNT = 8;

var AVATAR_LINK_PATH = 'img/avatars/user';
var AVATAR_NAME_PREFIX = 0;
var avatarID = 0;
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

// var getRandomLengthArray = function (arr) {
//   return arr.slice(getRandomNumber(1, arr.length));
// };

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
// делает случайный массив
var getShuffleArrayWithRandomLength = function (array) {
  return getShuffleArray(array).slice(0, getRandomNumber(1, array.length + 1));
};

var getOfferInfo = function () {
  var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);
  avatarID++;

  return {
    'author': {
      'avatar': AVATAR_LINK_PATH + AVATAR_NAME_PREFIX + avatarID + AVATAR_FILENAME_EXTENSION
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
    offers.push(getOfferInfo());
  }
  return offers;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');

var makePin = function (offerObject) {
  var newPin = mapPin.cloneNode(true);
  var addNewPin = newPin.querySelector('.map__pin img');
  // var left = offerObject.location.x - PIN_WIDTH / 2;
  // var top = offerObject.location.y - PIN_HEIGHT;
  // newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
  newPin.style.left = offerObject.location.x - PIN_WIDTH / 2 + 'px';
  newPin.style.top = offerObject.location.y - PIN_HEIGHT + 'px';
  addNewPin.src = offerObject.author.avatar;
  addNewPin.alt = offerObject.offer.title;
  return newPin;
};

var makePins = function (offerObjects) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < offerObjects.length; i++) {
    docFragment.appendChild(makePin(offerObjects[i]));
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

var getFeaturesList = function (features) {
  var featuresList = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var liElement = document.createElement('li');
    liElement.classList.add('popup__feature');
    liElement.classList.add('popup__feature--' + features[i]);
    featuresList.appendChild(liElement);
  }
  return featuresList;
};

var getPhotosList = function (photosArray) {
  var photoList = document.createDocumentFragment();
  for (var i = 0; i < photosArray.length; i++) {
    var mapCardPhoto = document.createElement('img');
    mapCardPhoto.classList.add('popup__photo');
    mapCardPhoto.src = photosArray[i];
    mapCardPhoto.width = '45';
    mapCardPhoto.height = '40';
    mapCardPhoto.alt = 'Фотография жилья';
    photoList.appendChild(mapCardPhoto);
  }
  return photoList;
};

var createAdvert = function (offerData) {
  var advert = mapCard.cloneNode(true);
  advert.querySelector('.popup__title').textContent = offerData.offer.title;
  advert.querySelector('.popup__text--address').textContent = offerData.offer.address;
  advert.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  advert.querySelector('.popup__type').textContent = accomodationType(offerData.offer.type);
  advert.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  // todo как лучше очистить контейнер?????
  // var featureListSearch = advert.querySelector('.popup__features');
  //
  // var deleteInner = function (element) {
  //   while (element.firstChild) {
  //     element.removeChild(element.firstChild);
  //   }
  //   return element;
  // };
  //
  // deleteInner(featureListSearch);
  // featureListSearch.appendChild(getFeaturesList(offerData.offer.features));
  advert.querySelector('.popup__features').innerHTML = null;
  advert.querySelector('.popup__features').appendChild(getFeaturesList(offerData.offer.features));
  advert.querySelector('.popup__description').textContent = offerData.offer.description;
  advert.querySelector('.popup__photos').innerHTML = null;
  advert.querySelector('.popup__photos').appendChild(getPhotosList(offerData.offer.photos));
  advert.querySelector('.popup__avatar').src = offerData.author.avatar;
  return advert;
};

var showAdvert = function (adverts, number) {
  var currentAdvert = createAdvert(adverts[number]);
  map.appendChild(currentAdvert);
};

var offers = getOffers(OFFERS_COUNT);
makePins(offers);
showAdvert(offers, 0);
