'use strict';
(function () {
  var OFFERS_COUNT = 5;
  var MAIN_PIN_TAIL = 15;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_Y_INFELICITY = 80;
  var MAIN_PIN_MAX_COORD_X = 1140;
  var mapElement = document.querySelector('.map');
  var pinsElement = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  var mainPinWidth = mainPinElement.offsetWidth;
  var mainPinHeight = mainPinElement.offsetHeight;
  var mainPinLeft = mainPinElement.offsetLeft;
  var mainPinTop = mainPinElement.offsetTop;

  // Создает пины
  var makePins = function (pins) {
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < OFFERS_COUNT; i++) {
      docFragment.appendChild(window.pin.makePin(pins[i], i));
    }
    pinsElement.appendChild(docFragment);
  };

  // Удаляет пины
  var deletePins = function () {
    var pinElement = pinsElement.querySelectorAll('.map__pin');
    for (var i = 1; i < pinElement.length; i++) {
      pinsElement.removeChild(pinElement[i]);
    }
  };
  // Переключает карту из неактивного состояния
  var toggleMapDisabled = function (mapDisabled) {
    mapElement.classList.toggle('map--faded', mapDisabled);
  };

  var onLoad = function (data) {
    // Отключает неактивный режим карты и создает пины при отжатии кнопки мыши
    var onClickActivatePage = function () {
      toggleMapDisabled(false);
      window.form.toggleFormDisabled(false);
      mainPinElement.addEventListener('click', function () {
        makePins(data);
      });
      mapElement.addEventListener('click', function (evt) {
        onMapPinClick(evt, data);
      });
      mainPinElement.removeEventListener('mouseup', onClickActivatePage);
      window.form.onAmountCapacityChange();
    };
    // Создает обработчик отпускания кнопки мыши
    if (mainPinElement) {
      mainPinElement.addEventListener('mouseup', onClickActivatePage);
    }
  };

  // добавляет обработчик клика по карте
  var onMapPinClick = function (evt, data) {
    var targetPinElement = evt.target.closest('.map__pin');
    if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
      window.card.show(data[targetPinElement.dataset.index]);
      var popupCloseElement = document.querySelector('.popup__close');
      popupCloseElement.addEventListener('click', window.card.onPopupCloseClick);
      document.addEventListener('keydown', window.card.onEscapePress);
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

  // по-умолчанию карта и формы отключены
  toggleMapDisabled(true);
  window.backend.load(onLoad, window.backend.onError);

  window.map = {
    mainPinTail: MAIN_PIN_TAIL,
    mainPinLeft: mainPinLeft,
    mainPinWidth: mainPinWidth,
    mainPinTop: mainPinTop,
    mainPinHeight: mainPinHeight,
    mapElement: mapElement,
    toggleMapDisabled: toggleMapDisabled,
    deletePins: deletePins,
    mainPinElement: mainPinElement
  };
})();
