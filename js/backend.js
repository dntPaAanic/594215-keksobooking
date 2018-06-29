'use strict';

(function () {
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;

  var Code = {
    NOT_FOUND: 404,
    SUCCESS: 200,
    USER_UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500
  };

  var setup = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          onLoad(xhr.response);
          break;
        case Code.BAD_REQUEST:
          onError('Неверный запрос');
          break;
        case Code.SERVER_ERROR:
          onError('Внутренняя ошибка сервера');
          break;
        case Code.USER_UNAUTHORIZED:
          onError('Пользователь не авторизован');
          break;
        case Code.NOT_FOUND:
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

  window.backend = {
    upload: upload,
    load: load
  };
})();
