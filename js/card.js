'use strict';
(function () {
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

  var filtersElement = document.querySelector('.map__filters-container');
  var mapCardElement = document.querySelector('template').content.querySelector('.map__card');

  var createFeaturesList = function (features) {
    var featuresList = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var liElement = document.createElement('li');
      liElement.classList.add('popup__feature');
      liElement.classList.add('popup__feature--' + features[i]);
      featuresList.appendChild(liElement);
    }
    return featuresList;
  };

  var createPhotosList = function (photosArray) {
    var photoList = document.createDocumentFragment();
    for (var i = 0; i < photosArray.length; i++) {
      var mapCardPhotoElement = document.createElement('img');
      mapCardPhotoElement.classList.add('popup__photo');
      mapCardPhotoElement.src = photosArray[i];
      mapCardPhotoElement.width = 45;
      mapCardPhotoElement.height = 40;
      mapCardPhotoElement.alt = 'Фотография жилья';
      photoList.appendChild(mapCardPhotoElement);
    }
    return photoList;
  };

  // создает текст объявления
  var createCardOffer = function (offerData) {
    var cardElement = mapCardElement.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = accomodationType(offerData.offer.type);
    cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    cardElement.querySelector('.popup__features').innerHTML = '';
    cardElement.querySelector('.popup__features').appendChild(createFeaturesList(offerData.offer.features));
    cardElement.querySelector('.popup__photos').innerHTML = '';
    cardElement.querySelector('.popup__photos').appendChild(createPhotosList(offerData.offer.photos));
    cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
    return cardElement;
  };

  // показывает новый попап после удаления первоначального (если попап сначала есть, то он удаляется, потом создается новый)
  var showOffer = function (offer) {
    removePopup();
    var currentOfferElement = createCardOffer(offer);
    window.map.mapElement.insertBefore(currentOfferElement, filtersElement);
  };
  // закрытие попапа
  var closePopup = function () {
    removePopup();
    document.removeEventListener('keydown', onPopupEscapePress);
  };
  // удаляет попап
  var removePopup = function () {
    var popupElement = window.map.mapElement.querySelector('.popup');
    if (popupElement) {
      window.map.mapElement.removeChild(popupElement);
    }
  };
  // функция нажатия Esc
  var onPopupEscapePress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };
  // функция клика на крестик
  var onPopupCloseClick = function () {
    closePopup();
  };

  window.card = {
    showOffer: showOffer,
    onPopupCloseClick: onPopupCloseClick,
    onPopupEscapePress: onPopupEscapePress,
    closePopup: closePopup
  };
})();
