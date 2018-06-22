'use strict';
(function () {
  var adFormFieldsetsElement = document.querySelectorAll('fieldset');
  var successElement = document.querySelector('.success');
  var adFormElement = document.querySelector('.ad-form');
  var formResetElement = document.querySelector('.ad-form__reset');
  var addressFieldElement = adFormElement.querySelector('#address');
  var timeInFieldElement = adFormElement.querySelector('#timein');
  var timeOutFieldElement = adFormElement.querySelector('#timeout');
  var roomTypeFieldElement = adFormElement.querySelector('#type');
  var priceForNightFieldElement = adFormElement.querySelector('#price');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  // Переключает форму из неактивного состояния
  var toggleFormDisabled = function (formDisabled) {
    adFormElement.classList.toggle('ad-form--disabled', formDisabled);
    for (var i = 0; i < adFormFieldsetsElement.length; i++) {
      adFormFieldsetsElement[i].disabled = formDisabled;
    }
  };

  // Переключает форму уведомления об успешной отправке в/из неактивного состояния
  var toggleSuccessDisabled = function (successDisabled) {
    successElement.classList.toggle('hidden', successDisabled);
  };

  var closeSuccess = function () {
    toggleSuccessDisabled(true);
    document.removeEventListener('keydown', onSuccessEscapePress);
  };

  var onSuccessEscapePress = function (evt) {
    window.utils.isEscEvent(evt, closeSuccess);
  };

  var clickSuccessButton = function () {
    toggleSuccessDisabled(false);
    resetAll();
    setDefaultposition();
    successElement.addEventListener('click', function () {
      toggleSuccessDisabled(true);
    });
    document.addEventListener('keydown', onSuccessEscapePress);
  };

  // Получение адреса пина после передвижения
  var setAddress = function (pinLeft, pinTop) {
    addressFieldElement.value = pinLeft + ', ' + pinTop;
  };

  // добавляет координаты пина при неактивной карте
  var getAddress = function () {
    var pinLeft = Math.round((window.map.mainPinLeft + (window.map.mainPinWidth / 2)));
    var pinTop = Math.round((window.map.mainPinTop + window.map.mainPinHeight + window.data.mainPinTail));
    setAddress(pinLeft, pinTop);
  };

  var setDefaultposition = function () {
    window.map.mainPinElement.style.left = window.map.mainPinLeft + 'px';
    window.map.mainPinElement.style.top = window.map.mainPinTop + 'px';
    getAddress();
  };

  var onTimeChange = function (checkIn, checkOut) {
    checkOut.value = checkIn.value;
  };

  // меняет минимальное значение цены и placeholder поля "Цена за ночь" в зависимости от выбора типа жилья
  var onTypeChange = function () {
    var minValuePrice = window.data.minPriceForNight[roomTypeFieldElement.value];
    priceForNightFieldElement.setAttribute('min', minValuePrice);
    priceForNightFieldElement.setAttribute('placeholder', minValuePrice);
  };
  var onAmountCapacityChange = function (roomAmountValue, capacityValue) {
    roomAmountValue = roomNumberElement.value;
    capacityValue = capacityElement.value;
    var capacityArray = window.data.roomsAmountAndCapacity[roomAmountValue];
    roomNumberElement.setCustomValidity('');
    roomNumberElement.checkValidity();
    if (capacityArray.indexOf(capacityValue) < 0) {
      roomNumberElement.setCustomValidity('Выберите другое количество комнат');
    }
  };

  // Возврат в первоночальное состояние неактивное состояние
  var resetAll = function () {
    toggleFormDisabled(true);
    window.map.toggleMapDisabled(true);
    window.map.deletePins();
    window.card.closePopup();
    adFormElement.reset();
  };

  var onButtonClickReset = function () {
    resetAll();
  };

  getAddress();
  toggleFormDisabled(true);

  formResetElement.addEventListener('click', onButtonClickReset);

  timeInFieldElement.addEventListener('change', function () {
    onTimeChange(timeInFieldElement, timeOutFieldElement);
  });
  timeOutFieldElement.addEventListener('change', function () {
    onTimeChange(timeOutFieldElement, timeInFieldElement);
  });

  roomTypeFieldElement.addEventListener('change', onTypeChange);

  roomNumberElement.addEventListener('change', function () {
    onAmountCapacityChange(roomNumberElement, capacityElement);
  });
  capacityElement.addEventListener('change', function () {
    onAmountCapacityChange(roomNumberElement, capacityElement);
  });

  adFormElement.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adFormElement), clickSuccessButton, window.backend.onError);
    evt.preventDefault();
  });

  window.form = {
    toggleFormDisabled: toggleFormDisabled,
    onAmountCapacityChange: onAmountCapacityChange,
    setAddress: setAddress
  };
})();
