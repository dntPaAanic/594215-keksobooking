'use strict';

(function () {
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;

  var errorMessages = {
    PAGE_NOT_FOUND: 404,
    PAGE_SUCCESS: 200,
    USER_UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500
  };

  var setup = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case errorMessages.PAGE_SUCCESS:
          onLoad(xhr.response);
          break;
        case errorMessages.BAD_REQUEST:
          onError('Неверный запрос');
          break;
        case errorMessages.SERVER_ERROR:
          onError('Внутренняя ошибка сервера');
          break;
        case errorMessages.USER_UNAUTHORIZED:
          onError('Пользователь не авторизован');
          break;
        case errorMessages.PAGE_NOT_FOUND:
          onError('Страница не найдена');
          break;

        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };
  // загружает данные на сервер
  var upload = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };

  // Загружает данные с сервера
  var load = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };

  var errorElement = document.createElement('div');
  var hideErrorMessage = function () {
    setTimeout(function () {
      errorElement.classList.add('hidden');
    }, TIMEOUT);
  };

  var onError = function (errorMessage) {
    errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    errorElement.style.color = '#000000';
    errorElement.style.textAlign = 'center';
    errorElement.style.margin = 'center auto';
    errorElement.style.position = 'fixed';
    errorElement.style.left = '0';
    errorElement.style.right = '0';
    errorElement.style.fontSize = '30px';
    errorElement.style.zIndex = '2';
    errorElement.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorElement);
    hideErrorMessage();
  };

  window.backend = {
    upload: upload,
    load: load,
    onError: onError
  };
})();
