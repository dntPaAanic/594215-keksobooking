'use strict';
(function () {

  var filtersElement = document.querySelector('.map__filters-container');
  // показывает новый попап после удаления первоначального (если попап сначала есть, то он удаляется, потом создается новый)
  var show = function (offer) {
    removePopup();
    var currentOfferElement = window.card.createCardOffer(offer);
    window.map.mapElement.insertBefore(currentOfferElement, filtersElement);
  };
  // закрытие попапа
  var close = function () {
    removePopup();
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
    window.utils.isEscEvent(evt, close);
  };
  // функция клика на крестик
  var onCloseElementClick = function () {
    close();
  };

  // добавляет обработчик клика по карте
  var onMapPinClick = function (evt, data) {
    var targetPinElement = evt.target.closest('.map__pin');
    if (targetPinElement && !targetPinElement.classList.contains('map__pin--main')) {
      show(data[targetPinElement.dataset.index]);
      var popupCloseElement = document.querySelector('.popup__close');
      popupCloseElement.addEventListener('click', onCloseElementClick);
      document.addEventListener('keydown', onEscapePress);
    }
  };

  window.showCard = {
    onMapPinClick: onMapPinClick,
    close: close
  };
})();
