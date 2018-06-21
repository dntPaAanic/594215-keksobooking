'use strict';

(function () {
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;

  var errorMessages = {
    PAGE_NOT_FOUND: 404,
    PAGE_SUCCESS: 200,
    USER_UNAUTHORIZED: 401,
    BAD_REQUEST: 400
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

  var upload = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };


  window.backend = {
    upload: upload,
    load: load
  };
})();
