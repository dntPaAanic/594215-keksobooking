'use strict';
(function () {
  var mapElement = document.querySelector('.map');
  var pinsElement = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  var mainPinWidth = mainPinElement.offsetWidth;
  var mainPinHeight = mainPinElement.offsetHeight;
  var mainPinLeft = mainPinElement.offsetLeft;
  var mainPinTop = mainPinElement.offsetTop;

  // Создает пины
  var makePins = function (offerObjects) {
    var docFragment = document.createDocumentFragment();
    for (var i = 0; i < offerObjects.length; i++) {
      docFragment.appendChild(window.pin.makePin(offerObjects[i], i));
    }
    pinsElement.appendChild(docFragment);
  };

  // Прячет пины
  var hidePins = function () {
    var hideButtons = document.querySelectorAll('.map__pin');
    for (var i = 0; i < hideButtons.length; i++) {
      if (hideButtons[i].classList.contains('map__pin--main')) {
        continue;
      }
      hideButtons[i].classList.add('hidden');
    }
    return hideButtons;
  };

  // Показывает пины
  var onClickShowPins = function () {
    var hideButtons = document.querySelectorAll('.map__pin');
    for (var i = 0; i < hideButtons.length; i++) {
      hideButtons[i].classList.remove('hidden');
    }
    return hideButtons;
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
    mainPinElement.removeEventListener('mouseup', onClickActivatePage);
    mapElement.addEventListener('click', onClickShowPins);
    window.form.onAmountCapacityChange();
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
  if (mainPinElement) {
    mainPinElement.addEventListener('mouseup', onClickActivatePage);
  }

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
      var calculationStartMainPinMinCoordY = window.data.locationMinY - mainPinHeight - window.data.mainPinTail;
      var calculationStartMainPinMaxCoordY = window.data.locationMaxY - mainPinHeight - window.data.mainPinTail;
      shiftOffsetY = shiftOffsetY < calculationStartMainPinMinCoordY ? calculationStartMainPinMinCoordY : shiftOffsetY;
      shiftOffsetY = shiftOffsetY > calculationStartMainPinMaxCoordY ? calculationStartMainPinMaxCoordY : shiftOffsetY;

      shiftOffsetX = shiftOffsetX < 0 ? 0 : shiftOffsetX;
      shiftOffsetX = shiftOffsetX > window.data.mainPinMaxX ? window.data.mainPinMaxX : shiftOffsetX;

      mainPinElement.style.top = shiftOffsetY + 'px';
      mainPinElement.style.left = shiftOffsetX + 'px';
      window.form.setAddress(Math.round(shiftOffsetX + mainPinWidth / 2), shiftOffsetY + window.data.locationInfelicityY);
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
    mainPinLeft: mainPinLeft,
    mainPinWidth: mainPinWidth,
    mainPinTop: mainPinTop,
    mainPinHeight: mainPinHeight,
    mapElement: mapElement,
    toggleMapDisabled: toggleMapDisabled,
    hidePins: hidePins
  };
})();

