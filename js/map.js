'use strict';
(function () {
  var OFFERS_COUNT = 5;
  var MAIN_PIN_TAIL = 15;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_Y_INFELICITY = 80;
  var MAIN_PIN_MAX_COORD_X = 1140;
  var RentPrice = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapElement = document.querySelector('.map');
  var pinsElement = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  var filtersFormElement = document.querySelector('.map__filters');
  var typeFilterElement = filtersFormElement.querySelector('#housing-type');
  var priceFilterElement = filtersFormElement.querySelector('#housing-price');
  var roomsFilterElement = filtersFormElement.querySelector('#housing-rooms');
  var guestsFilterElement = filtersFormElement.querySelector('#housing-guests');
  var featuresFiltersElement = filtersFormElement.querySelectorAll('.map__checkbox');

  var mainPinWidth = mainPinElement.offsetWidth;
  var mainPinHeight = mainPinElement.offsetHeight;
  var mainPinLeft = mainPinElement.offsetLeft;
  var mainPinTop = mainPinElement.offsetTop;

  var offers = [];

  // Создает пины
  var makePins = function (offer) {
    var docFragment = document.createDocumentFragment();
    var selectedOffers = offer.slice(0, OFFERS_COUNT);
    selectedOffers.forEach(function (pin) {
      docFragment.appendChild(window.pin.makePin(pin));
    });
    pinsElement.appendChild(docFragment);
  };

  // Удаляет пины
  var deletePins = function () {
    var pinElement = pinsElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinElement.forEach(function (item) {
      pinsElement.removeChild(item);
    });
  };

  // Обновляет/фильтрует и создает новые пины
  var updatePins = function () {
    var filteredOffers = offers;
    deletePins();
    window.card.close();

    // Фильтрует по значению элемента
    var filterByValue = function (element, property) {
      if (element.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (offerData) {
          return offerData.offer[property].toString() === element.value;
        });
      }
      return filteredOffers;
    };

    // Фильтрует по цене
    var filterByPrice = function () {
      if (priceFilterElement.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (offerData) {
          var priceFilterValues = {
            'low': offerData.offer.price < RentPrice.LOW,
            'middle': offerData.offer.price >= RentPrice.LOW && offerData.offer.price < RentPrice.HIGH,
            'high': offerData.offer.price >= RentPrice.HIGH
          };
          return priceFilterValues[priceFilterElement.value];
        });
      }
      return filteredOffers;
    };

    // Фильтрует по фичам
    var filterByFeatures = function () {
      [].forEach.call(featuresFiltersElement, function (item) {
        if (item.checked) {
          filteredOffers = filteredOffers.filter(function (offerData) {
            return offerData.offer.features.indexOf(item.value) >= 0;
          });
        }
      });
      return filteredOffers;
    };

    filterByValue(typeFilterElement, 'type');
    filterByValue(roomsFilterElement, 'rooms');
    filterByValue(guestsFilterElement, 'guests');
    filterByPrice();
    filterByFeatures();
    makePins(filteredOffers);
  };

  // Переключает карту из неактивного состояния
  var toggleMapDisabled = function (mapDisabled) {
    mapElement.classList.toggle('map--faded', mapDisabled);
    if (mapDisabled) {
      deletePins();
    }
  };

  // делаем дополнительную функцию и передаем onActivatePage в бэкенд
  var onLoad = function (data) {
    // Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
    // если data передать сразу в onActivatePage, то после загрузки страницы карта активируется сама
    var onActivatePage = function () {
      toggleMapDisabled(false);
      window.form.toggleFormDisabled(false);
      offers = data.slice();
      makePins(offers);
      mainPinElement.removeEventListener('mouseup', onActivatePage);
      mainPinElement.removeEventListener('keydown', onEnterPress);
      window.form.onAmountCapacityChange();
    };
    var onEnterPress = function (evt) {
      window.utils.checkEnterEvent(evt, onActivatePage);
    };
    var addMainPinEvents = function () {
      mainPinElement.addEventListener('mouseup', onActivatePage);
      mainPinElement.addEventListener('keydown', onEnterPress);
    };
    // Создает обработчик отпускания кнопки мыши
    if (mainPinElement) {
      addMainPinEvents();
    }
    // После ресета карты не появлялись пины, сделал обработчик на .ad-form__reset
    if (window.form.adFormElement) {
      window.form.adFormElement.addEventListener('reset', function () {
        addMainPinEvents();
      });
    }
    // После отправки формы не появлялись пины, сделал обработчик на .success
    if (window.form.successElement) {
      window.form.successElement.addEventListener('mouseup', function () {
        addMainPinEvents();
      });
    }
  };

  mainPinElement.addEventListener('mousedown', function (evt) {
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
      var shiftOffsetY = mainPinElement.offsetTop + shift.y;
      var shiftOffsetX = mainPinElement.offsetLeft + shift.x;
      var calculationStartMainPinMinCoordY = LOCATION_Y_MIN - mainPinHeight - MAIN_PIN_TAIL;
      var calculationStartMainPinMaxCoordY = LOCATION_Y_MAX - mainPinHeight - MAIN_PIN_TAIL;
      shiftOffsetY = shiftOffsetY < calculationStartMainPinMinCoordY ? calculationStartMainPinMinCoordY : shiftOffsetY;
      shiftOffsetY = shiftOffsetY > calculationStartMainPinMaxCoordY ? calculationStartMainPinMaxCoordY : shiftOffsetY;

      shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
      shiftOffsetX = shiftOffsetX > MAIN_PIN_MAX_COORD_X ? MAIN_PIN_MAX_COORD_X : shiftOffsetX;

      mainPinElement.style.top = shiftOffsetY + 'px';
      mainPinElement.style.left = shiftOffsetX + 'px';
      window.form.setAddress(Math.round(shiftOffsetX + mainPinWidth / 2), shiftOffsetY + LOCATION_Y_INFELICITY);
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Добавляет обработчик на форму с фильтрами для устранения дребезга
  filtersFormElement.addEventListener('change', function () {
    window.utils.debounce(updatePins);
  });

  // по-умолчанию карта и формы отключены
  toggleMapDisabled(true);

  window.backend.load(onLoad, window.utils.onError);

  window.map = {
    mainPinTail: MAIN_PIN_TAIL,
    mainPinLeft: mainPinLeft,
    mainPinWidth: mainPinWidth,
    mainPinTop: mainPinTop,
    mainPinHeight: mainPinHeight,
    mapElement: mapElement,
    toggleMapDisabled: toggleMapDisabled,
    mainPinElement: mainPinElement,
    filtersFormElement: filtersFormElement
  };
})();
