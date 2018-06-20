'use strict';
(function () {

  var adFormFieldsetsElement = document.querySelectorAll('fieldset');
  var adFormElement = document.querySelector('.ad-form');
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
  var setAddress = function (pinLeft, pinTop) {
    addressFieldElement.value = pinLeft + ', ' + pinTop;
  };

  // добавляет координаты пина при неактивной карте
  var getAddress = function () {
    var pinLeft = Math.round((window.map.mapPinMainLeft + (window.map.mapPinMainWidth / 2)));
    var pinTop = Math.round((window.map.mapPinMainTop - window.map.mapPinMainHeight - window.data.mapMainPinTail));
    setAddress(pinLeft, pinTop);
  };

  var changeTimeSelection = function (checkIn, checkOut) {
    checkOut.value = checkIn.value;
  };

  // меняет минимальное значение цены и placeholder поля "Цена за ночь" в зависимости от выбора типа жилья
  var changeTypeSelection = function () {
    var minValuePrice = window.data.minPriceForNight[roomTypeFieldElement.value];
    priceForNightFieldElement.setAttribute('min', minValuePrice);
    priceForNightFieldElement.setAttribute('placeholder', minValuePrice);
  };

  // Определяет соответствие количества комнат и гостей
  var validateGuests = function () {
    var roomNumberValue = roomNumberElement.value;
    var capacityValue = capacityElement.value;
    var capacityArray = window.data.roomNumberAndCapacity[roomNumberValue];
    roomNumberElement.setCustomValidity('');
    roomNumberElement.checkValidity();
    if (capacityArray.indexOf(capacityValue) < 0) {
      roomNumberElement.setCustomValidity('Количество комнат не подходит для количества гостей');
    }
  };
  getAddress();
  toggleFormDisabled(true);
  timeInFieldElement.addEventListener('change', function () {
    changeTimeSelection(timeInFieldElement, timeOutFieldElement);
  });
  timeOutFieldElement.addEventListener('change', function () {
    changeTimeSelection(timeOutFieldElement, timeInFieldElement);
  });
  roomTypeFieldElement.addEventListener('change', changeTypeSelection);
  roomNumberElement.addEventListener('change', validateGuests);
  capacityElement.addEventListener('change', validateGuests);

  window.form = {
    toggleFormDisabled: toggleFormDisabled,
    validateGuests: validateGuests,
    setAddress: setAddress
  };
})();
