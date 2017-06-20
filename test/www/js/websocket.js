// JSON:
// {["тип сообщения", "значение"]}
// типы сообщений: 1 - текстовое сообщение для чата, 2 - крутить спиннер

// Загрузка страницы
window.onload = function () {
    var label = document.getElementById("status");
    var message = document.getElementById("message");
    var btnSend = document.getElementById("send");
    var btnStop = document.getElementById("stop");
//            var socket = new WebSocket("ws://echo.websocket.org");
//            var socket = new WebSocket("ws://127.0.0.1:8080");
    var socket = new WebSocket("ws://138.201.158.208:8888");

    // CONNECTING, OPEN, CLOSING, CLOSE
    // bufferedAmount

    // Установка (открытие) соединения
    socket.onopen = function () {
        label.innerHTML = 'i: Hello!';
        console.log('message: open socket - ' + socket.url);
    }
    // Закрытие соединения
    socket.onclose = function (event) {
        if (event.wasClean) {
            label.innerHTML = 'i: Goodbye!';
            console.log('message: closing socket (' + socket.url + ') is correct.');
        } else
            console.log(
                'error: closing socket (' + socket.url + ') is NO correct! '
                + event.reason + ' [' + event.code + ']'
            );
    }
    // Возникновение ошибки
    socket.onerror = function () {
        label.innerHTML = 'i: connecting error!';
        console.log('error: socket is error!');
    }
    // Полуение данных
    socket.onmessage = function (event) {
        // Проверка на строку
        if (typeof event.data === 'string') {
            console.log('message: ' + event.data);
            // Преобразование в JSON объект
            var messageJSON = JSON.parse(event.data);
            if (typeof messageJSON.i !== "undefined") {
                // Обработка ответа от сервера
                if (messageJSON.i[0] == 0)
                    label.innerHTML += '<br />' + 'i: ' + messageJSON.i[1];
                if (messageJSON.i[0] == 1)
                    $("#spinner").rotate({
                        angle: 0,
                        animateTo: 1080
                    })
            } else {
                label.innerHTML = 'i: data error!';
                console.log('error: type of answer is no structured!');
            }
        } else {
            label.innerHTML = 'i: data error!';
            console.log('error: type of answer is wrong!');
        }
    }

    // Отправка сообщения в чат
    btnSend.onclick = function () {
        if (socket.readyState === WebSocket.OPEN) {
            // Отправка строки
//                    socket.send(message.value);
//                    console.log('send: ' + message.value);
            // Отпрвка JSON
            var messageJSON = JSON.stringify(
                {
                    i: [0, message.value]
                }
            );
            socket.send(messageJSON);
            console.log('send: ' + messageJSON);
        }
    }

    // Закрытие сокета (выход)
    btnStop.onclick = function () {
        if (socket.readyState === WebSocket.OPEN)
            socket.close();
    }

    // Вращение спинера
    $("#spinner").click(function () {
        if (socket.readyState === WebSocket.OPEN) {
            var messageJSON = JSON.stringify(
                {
                    i: [1, 1]
                }
            );
            socket.send(messageJSON);
            console.log('send: ' + messageJSON);
        }
    });
}