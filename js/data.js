'use strict';

(function () {
  var OFFERS_COUNT = 5;

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

  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_Y_INFELICITY = 80;

  var MAIN_PIN_MAX_COORD_X = 1140;
  var MAIN_PIN_TAIL = 15;

  window.data = {
    offersCount: OFFERS_COUNT,
    mainPinTail: MAIN_PIN_TAIL,
    roomsAmountAndCapacity: ROOMS_AMOUNT_AND_CAPACITIES,
    minPriceForNight: MIN_PRICES_FOR_NIGHT,
    locationMinY: LOCATION_Y_MIN,
    locationMaxY: LOCATION_Y_MAX,
    mainPinMaxX: MAIN_PIN_MAX_COORD_X,
    locationInfelicityY: LOCATION_Y_INFELICITY
  };
})();
