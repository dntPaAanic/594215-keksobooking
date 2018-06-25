'use strict';
(function () {
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
  var adFormFieldsetsElement = document.querySelectorAll('fieldset');

  var successElement = document.querySelector('.success');
  var adFormElement = document.querySelector('.ad-form');
  var formResetElement = adFormElement.querySelector('.ad-form__reset');
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
    successElement.focus();
  };

  // Получение адреса пина после передвижения
  var setAddress = function (pinLeft, pinTop) {
    addressFieldElement.value = pinLeft + ', ' + pinTop;
  };

  // добавляет координаты пина при неактивной карте
  var getAddress = function () {
    var pinLeft = Math.round((window.map.mainPinLeft + (window.map.mainPinWidth / 2)));
    var pinTop = Math.round((window.map.mainPinTop + window.map.mainPinHeight + window.map.mainPinTail));
    setAddress(pinLeft, pinTop);
  };

  var setDefaultPosition = function () {
    window.map.mainPinElement.style.left = window.map.mainPinLeft + 'px';
    window.map.mainPinElement.style.top = window.map.mainPinTop + 'px';
    getAddress();
  };

  var onTimeChange = function (checkIn, checkOut) {
    checkOut.value = checkIn.value;
  };

  // меняет минимальное значение цены и placeholder поля "Цена за ночь" в зависимости от выбора типа жилья
  var onTypeChange = function () {
    var minValuePrice = MIN_PRICES_FOR_NIGHT[roomTypeFieldElement.value];
    priceForNightFieldElement.setAttribute('min', minValuePrice);
    priceForNightFieldElement.setAttribute('placeholder', minValuePrice);
  };
  var onAmountCapacityChange = function (roomAmountValue, capacityValue) {
    roomAmountValue = roomNumberElement.value;
    capacityValue = capacityElement.value;
    var capacityArray = ROOMS_AMOUNT_AND_CAPACITIES[roomAmountValue];
    roomNumberElement.setCustomValidity('');
    roomNumberElement.checkValidity();
    if (capacityArray.indexOf(capacityValue) < 0) {
      roomNumberElement.setCustomValidity('Выберите другое количество комнат');
    }
  };

  var closeSuccess = function () {
    toggleSuccessDisabled(true);
    document.removeEventListener('keydown', onDocumentEscapePress);
  };

  var onDocumentEscapePress = function (evt) {
    window.utils.isEscEvent(evt, closeSuccess);
  };

  var onSuccessButtonClick = function () {
    toggleSuccessDisabled(false);
    resetAll();
    successElement.addEventListener('click', function () {
      toggleSuccessDisabled(true);
    });
    document.addEventListener('keydown', onDocumentEscapePress);
  };

  // Возврат в первоночальное состояние неактивное состояние
  var resetAll = function () {
    toggleFormDisabled(true);
    window.map.toggleMapDisabled(true);
    window.card.close();
    adFormElement.reset();
    setDefaultPosition();
  };

  var onButtonResetClick = function (evt) {
    evt.preventDefault();
    resetAll();
  };

  getAddress();
  toggleFormDisabled(true);

  formResetElement.addEventListener('click', onButtonResetClick);

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
    window.backend.upload(new FormData(adFormElement), onSuccessButtonClick, window.utils.onError);
    evt.preventDefault();
  });

  window.form = {
    adFormElement: adFormElement,
    successElement: successElement,
    formResetElement: formResetElement,
    toggleFormDisabled: toggleFormDisabled,
    onAmountCapacityChange: onAmountCapacityChange,
    setAddress: setAddress
  };
})();
