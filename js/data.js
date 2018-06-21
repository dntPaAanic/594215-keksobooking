'use strict';

(function () {
  var OFFERS_COUNT = 8;

  var AVATAR_LINK_PATH = 'img/avatars/user';
  var AVATAR_NAME_PREFIX = 0;

  var AVATAR_FILENAME_EXTENSION = '.png';

  var OFFERS_TITLE = [
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
  var CHECK_IN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CHECK_OUT_TIMES = [
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

  var ROOMS_AMOUNT_AND_CAPACITIES = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var MIN_PRICES_FOR_NIGHT = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_Y_INFELICITY = 80;

  var MAIN_PIN_MAX_COORD_X = 1140;
  var MAIN_PIN_TAIL = 15;

  var offerTitle = OFFERS_TITLE.slice();
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
        'checkin': window.utils.getRandomElement(CHECK_IN_TIMES),
        'checkout': window.utils.getRandomElement(CHECK_OUT_TIMES),
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

  var offers = getOffers(OFFERS_COUNT);
  window.data = {
    mainPinTail: MAIN_PIN_TAIL,
    roomsAmountAndCapacity: ROOMS_AMOUNT_AND_CAPACITIES,
    minPriceForNight: MIN_PRICES_FOR_NIGHT,
    offers: offers,
    locationMinY: LOCATION_Y_MIN,
    locationMaxY: LOCATION_Y_MAX,
    mainPinMaxX: MAIN_PIN_MAX_COORD_X,
    locationInfelicityY: LOCATION_Y_INFELICITY
  };
})();
