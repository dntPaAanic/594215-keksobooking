'use strict';
(function () {
  var filtersElement = document.querySelector('.map__filters-container');
  var mapCardElement = document.querySelector('template').content.querySelector('.map__card');

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
  // показывает новый попап после удаления первоначального (если попап сначала есть, то он удаляется, потом создается новый)
  var show = function (offer) {
    removePopup();
    var cardElement = renderOffer(offer);
    window.map.mapElement.insertBefore(cardElement, filtersElement);
  };
  // закрытие попапа
  var close = function () {
    removePopup();
    window.pin.removePinActiveState();
    document.removeEventListener('keydown', onEscapePress);
  };
  // удаляет попап
  var removePopup = function () {
    var popupElement = window.map.mapElement.querySelector('.popup');
    if (popupElement) {
      window.map.mapElement.removeChild(popupElement);
    }
  };
  // функция нажатия Esc
  var onEscapePress = function (evt) {
    window.utils.checkEscEvent(evt, close);
  };
  // функция клика на крестик
  var onCloseElementClick = function () {
    close();
  };

  // добавляет обработчик клика по карте
  var onMapPinClick = function (evt, data) {
    var targetPinElement = evt.target.closest('.map__pin');
    if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
      show(data);
      window.pin.addCurrentPinActiveState(targetPinElement);
      var popupCloseElement = document.querySelector('.popup__close');
      popupCloseElement.addEventListener('click', onCloseElementClick);
      document.addEventListener('keydown', onEscapePress);
    }
  };

  var createFeaturesList = function (features) {
    var featuresList = document.createDocumentFragment();
    features.forEach(function (it) {
      var liElement = document.createElement('li');
      liElement.classList.add('popup__feature');
      liElement.classList.add('popup__feature--' + it);
      featuresList.appendChild(liElement);
    });
    return featuresList;
  };

  var createPhotosList = function (photosArray) {
    var photoList = document.createDocumentFragment();
    photosArray.forEach(function (it) {
      var mapCardPhotoElement = document.createElement('img');
      mapCardPhotoElement.classList.add('popup__photo');
      mapCardPhotoElement.src = it;
      mapCardPhotoElement.width = 45;
      mapCardPhotoElement.height = 40;
      mapCardPhotoElement.alt = 'Фотография жилья';
      photoList.appendChild(mapCardPhotoElement);
    });
    return photoList;
  };

  // создает текст объявления
  var renderOffer = function (offerData) {
    var cardElement = mapCardElement.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = accomodationType(offerData.offer.type);
    cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    cardElement.querySelector('.popup__features').innerHTML = '';
    cardElement.querySelector('.popup__features').appendChild(createFeaturesList(offerData.offer.features));
    cardElement.querySelector('.popup__description').textContent = offerData.offer.description;
    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(createPhotosList(offerData.offer.photos));
    cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
    return cardElement;
  };

  window.card = {
    onMapPinClick: onMapPinClick,
    close: close
  };
})();
