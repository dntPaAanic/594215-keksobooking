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

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var Photo = {
    WIDTH: 70,
    HEIGHT: 70
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

  var avatarChooserElement = adFormElement.querySelector('.ad-form-header__input');
  var avatarPreviewElement = adFormElement.querySelector('.ad-form-header__preview img');
  var imagesChooserElement = adFormElement.querySelector('.ad-form__input');
  var photoContainerElement = adFormElement.querySelector('.ad-form__photo-container');
  var photoPreviewElement = adFormElement.querySelector('.ad-form__photo');

  var defaultAvatarIcon = avatarPreviewElement.src;

  // Переключает форму из неактивного состояния
  var toggleFormDisabled = function (formDisabled) {
    adFormElement.classList.toggle('ad-form--disabled', formDisabled);
    [].forEach.call(adFormFieldsetsElement, function (item) {
      item.disabled = formDisabled;
    });
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
    window.utils.checkEscEvent(evt, closeSuccess);
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
    window.map.filtersFormElement.reset();
    adFormElement.reset();
    setDefaultPosition();
    avatarPreviewElement.src = defaultAvatarIcon;
    removePhotos();
  };

  var onButtonResetClick = function (evt) {
    evt.preventDefault();
    resetAll();
  };

  var onAvatarLoad = function () {
    var file = avatarChooserElement.files[0];
    window.utils.loadFile(file, FILE_TYPES, function (reader) {
      avatarPreviewElement.src = reader.result;
    });
  };

  var loadPhotos = function (photos) {
    photos.forEach(function (photo) {
      window.utils.loadFile(photo, FILE_TYPES, function (reader) {
        var imageElement = document.createElement('img');
        imageElement.width = Photo.WIDTH;
        imageElement.height = Photo.HEIGHT;
        imageElement.style = 'margin-right: 10px';
        imageElement.classList.add('form__photo');
        imageElement.src = reader.result;
        photoContainerElement.insertBefore(imageElement, photoPreviewElement);
      });
    });
  };

  // Удаляет загруженные фотографии
  var removePhotos = function () {
    var photoElement = document.querySelectorAll('.form__photo');
    if (photoElement) {
      [].forEach.call(photoElement, function (photo) {
        photo.parentNode.removeChild(photo);
      });
    }
  };

  getAddress();
  toggleFormDisabled(true);

  avatarChooserElement.addEventListener('change', onAvatarLoad);
  imagesChooserElement.addEventListener('change', function () {
    var photos = [].map.call(imagesChooserElement.files, function (photo) {
      return photo;
    });
    loadPhotos(photos);
  });

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
