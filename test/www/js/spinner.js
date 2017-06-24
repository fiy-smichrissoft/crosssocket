$(function () {

    // Отключение скрола
    $(document).on('touchstart', function (e) {
        e.preventDefault();
    });

    // Размеры экрана
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    // Блокировка поворота экрана
    $(window).on('resize', function () {
        if ((windowWidth === $(window).width()) && (windowHeight === $(window).height()))
            $('body').show();
        else
            $('body').hide();
        // console.log('event: resize');
        // console.log('window: original size is ' + wW + ' х ' + wH);
        // console.log('window: current size is ' + $(window).width() + ' х ' + $(window).height());
    });

    // Размеры области для спинера
    var spinnerDIV = $("#spinnerDIV");
    const Xmax = spinnerDIV.width();
    const Ymax = spinnerDIV.height();
    // console.log('spinner: size of div is  ' + Xmax + ' x ' + Ymax);
    // Смещение центра координат
    var offset = spinnerDIV.offset();
    // Центр координат
    const Xzero = offset.left + Xmax / 2;
    const Yzero = offset.top + Ymax / 2;
    // console.log('spinner: zero point is (' + Xzero + ', ' + Yzero + ')');


    // (главная)
    //
    // ================================================================
    // ФИЗИКА с оценкой угла доворота и изменяющейся скоростью спинера
    // ================================================================

    // Ускорение (коэффицент увеличения скорости)
    const spinSpeedUp = 10000;
    // Максимальный угол вращения
    const spinAngleMax = 50000;
    // Продолжительность вращения
    const spinDuration = 15000;

    // Точки начала и конца движения
    var points = [[0.0, 0.0], [0.0, 0.0]];
    // Счетчик времени движения
    var spinTimer = 0;
    // Длина движения
    var spinRoad = 0.0;
    // Скорость движения
    var spinSpeed = 0.0;
    // Позиция тача / курсора
    var pageX = 0.0;
    var pageY = 0.0;

    // Старт движения
    $("#spinnerInvisible")
        .on(
            'touchstart mousedown',
            function (event) {
                // console.log(event);
                // Определение позиции тача / курсора
                if (event.type === 'touchstart') {
                    pageX = event.originalEvent.touches[0].pageX;
                    pageY = event.originalEvent.touches[0].pageY;
                } else if (event.type === 'mousedown') {
                    pageX = event.pageX;
                    pageY = event.pageY;
                }
                // Точка начала движения
                points[0][0] = pageX - Xzero;
                points[0][1] = -(pageY - Yzero);
                // console.log('spinner: points is ' + points);
                // Старт счетчика времени движения
                spinTimer = Date.now(); // jQuery.now()
                // console.log('spinTimer: ' + spinTimer);
                // console.log('event: touchstart mousedown');
            })
        .on(
            'touchend mouseup',
            function (event) {
                // console.log(event);
                // Определение позиции тача / курсора
                if (event.type === 'touchend') {
                    pageX = event.originalEvent.changedTouches[0].pageX;
                    pageY = event.originalEvent.changedTouches[0].pageY;
                } else if (event.type === 'mouseup') {
                    pageX = event.pageX;
                    pageY = event.pageY;
                }
                // Точка конца движения
                points[1][0] = pageX - Xzero;
                points[1][1] = -(pageY - Yzero);
                // console.log('spinner: points is ' + points);

                // Промежуточные углы (по часовой стрелке от горизонта)
                var a1, a2;
                if (points[1][1] <= 0)
                    a1 = -1 * Math.atan2(points[1][1], points[1][0]) / Math.PI * 180;
                else
                    a1 = 360 - Math.atan2(points[1][1], points[1][0]) / Math.PI * 180;
                if (points[0][1] <= 0)
                    a2 = -1 * Math.atan2(points[0][1], points[0][0]) / Math.PI * 180;
                else
                    a2 = 360 - Math.atan2(points[0][1], points[0][0]) / Math.PI * 180;
                // console.log('spinner: angle new is  ' + a1);
                // console.log('spinner: angle old is ' + a2);

                // Угол доворота
                var aNew;
                // Корректировка при проходе через 0 (точку отсчета)
                if (points[1][0] > 0 && points[1][1] > 0 && points[0][0] > 0 && points[0][1] <= 0) {
                    aNew = (360 - a1 + a2);
                    // console.log('spinner: aNew (1) is ' + aNew);
                }
                else if (points[1][0] > 0 && points[1][1] < 0 && points[0][0] > 0 && points[0][1] >= 0) {
                    aNew = -(360 - a2 + a1);
                    // console.log('spinner: aNew (2) is ' + aNew);
                } else {
                    aNew = (a2 - a1);
                    // console.log('spinner: aNew (3) is ' + aNew);
                }

                // Время движения
                spinTimer = Date.now() - spinTimer;
                // Пройденный путь как угловое расстояние,  т.е. угл смещения с обратным знаком
                spinRoad = -1 * aNew;
                // Предыдущее значение скорости
                var spinSpeedLast = spinSpeed;
                // Новое значение скорости
                spinSpeed = spinRoad / spinTimer * spinSpeedUp;
                // console.log('spinner: T = ' + spinTimer + ', S = ' + spinRoad + ', V = ' + spinSpeed);

                // Главный тег с картикой
                var spinner = $("#spinner");
                // Текущий угол
                var aCur = parseFloat(spinner.getRotateAngle());

                // Ограничение вращения
                var spinAngle = aCur + spinSpeedLast + spinSpeed;
                if (spinAngle > spinAngleMax)
                    spinAngle = spinAngleMax;

                // Вращение с ускорением
                spinner.rotate({
                    duration: spinDuration,
                    angle: aCur,
                    animateTo: spinAngle
                    // callback: function () {
                    //     console.log('spinner: it is stop.');
                    // }
                });
                // console.log('event: touchend mouseup');
            })
        .on(
            'touchmove mousemove',
            function () {
                // анализ четвертей и см движения "туда-сюда"
            });


    // // (дополнительная)
    //
    // // ===========================================================
    // // ФИЗИКА с управляемым поворотом спинера при ведению по нему
    // // ===========================================================
    //
    // // Маркер нажатого состояния на спинере
    // var spinDown = false;
    //
    // // Вектор из текущей и предшествующей позиции - [x1, y1, x2, y2]
    // var vector = [0.0, 0.0, 0.0, 0.0];
    //
    // // Текущий угол поворота
    // var angleCur = 0.0;
    // // Угол смещения
    // var angleNew = 0.0;
    // // Суммарный угол смещения за одно движение
    // var angleSum = 0.0;
    // // Промежуточные углв
    // var angle2 = 0.0, angle1 = 0.0;
    //
    // // Вычисление угла поворота спинера
    // function angleUp(pageX, pageY) {
    //     // Обновление начальной и конечной точки вектора
    //     vector[2] = vector[0];
    //     vector[3] = vector[1];
    //     vector[0] = pageX - Xzero;
    //     vector[1] = 0 - (pageY - Yzero);
    //     if (vector[2] !== vector[0] || vector[3] !== vector[1]) {
    //
    //         // Промежуточные углы (по часовой от горизонта)
    //         if (vector[3] <= 0)
    //             angle1 = -1 * Math.atan2(vector[3], vector[2]) / Math.PI * 180;
    //         else
    //             angle1 = 360 - Math.atan2(vector[3], vector[2]) / Math.PI * 180;
    //         if (vector[1] <= 0)
    //             angle2 = -1 * Math.atan2(vector[1], vector[0]) / Math.PI * 180;
    //         else
    //             angle2 = 360 - Math.atan2(vector[1], vector[0]) / Math.PI * 180;
    //
    //         // Корректировка при проходе через 0 (точку отсчета)
    //         if (vector[2] > 0 && vector[3] > 0 && vector[0] > 0 && vector[1] <= 0)
    //             angleNew = (360 - angle1 + angle2);
    //         else if (vector[2] > 0 && vector[3] < 0 && vector[0] > 0 && vector[1] >= 0)
    //             angleNew = -(360 - angle2 + angle1);
    //         else
    //             angleNew = (angle2 - angle1);
    //
    //         // Обновление значений углов
    //         angleSum = angleSum + angleNew;
    //         angleCur = angleCur + angleNew;
    //         // console.log('spinner: vector is ' + vector);
    //         // console.log('spinner: angle2 is ' + angle2);
    //         // console.log('spinner: angle1 is ' + angle1);
    //         // console.log('spinner: angleNew is ' + angleNew);
    //         // console.log('spinner: angleSum is ' + angleSum);
    //         // console.log('spinner: angleCur is ' + angleCur);
    //     }
    // }
    //
    // // Включение нажатого состояния на спинере
    // $("#spinner").on('touchstart mousedown', function () {
    //     spinDown = true;
    //     console.log('event: touchstart mousedown');
    // });
    //
    // // Выключение нажатого состояния на спинере
    // $("*").on('touchend mouseup', function () {
    //     spinDown = false;
    //     console.log('event: touchend mouseup');
    // });
    //
    // // Поворот спинера по ведению по нему
    // $("#spinner").on('touchmove mousemove', function (event) {
    //     if (spinDown) {
    //         // console.log(event);
    //         // Положение курсора
    //         if (event.type == 'touchmove') {
    //             pageX = event.originalEvent.touches[0].pageX;
    //             pageY = event.originalEvent.touches[0].pageY;
    //         } else if (event.type == 'mousemove') {
    //             pageX = event.pageX;
    //             pageY = event.pageY;
    //         }
    //         // Анимация вращения спинера
    //         angleUp(pageX, pageY);
    //         $("#spinner").rotate({
    //             angle: angleCur,
    //             animateTo: angleCur + angleNew
    //             // duration: 1,
    //             // callback: function () {
    //             //     console.log('spinner: it is stop.');
    //             // }
    //         });
    //     } else {
    //         vector[0] = event.pageX - Xzero;
    //         vector[1] = -(event.pageY - Yzero);
    //         // console.log('spinner: vector is ' + vector);
    //     }
    //     $("#status").textContent += 'spinner: vector is ' + vector;
    // });


    // // (заброшена)
    //
    // // =======================================================================
    // // ФИЗИКА с изменяющейся скоростью спинера с оценкой суммы углов движения
    // // =======================================================================
    //
    // // Временной маркер для периода действия
    // var spinGo = true;
    //
    // // Период вращения
    // var spinTime = 0;
    //
    // // Анализ производимых действий
    // // $("#spinnerSVG").on('touchmove mousemove', function () {
    //
    //     // if (spinDown) {
    //     angleUp(event.pageX, event.pageY);
    //
    //     if (spinGo) {
    //         spinGo = false;
    //
    //         // Изменение периода взависимости от угла вращения
    //         /*
    //          if (angleSum <= 3)
    //          spinTime = 10;
    //          else if ((angleSum > 3) && (angleSum < 45))
    //          spinTime = 1000;
    //          else
    //          spinTime = 3000;
    //          */
    //
    //         spinTime = 300;
    //
    //         // Вращение на суммарный угол за ограниченный период действия
    //         // setTimeout(function () {
    //             console.log('spinner: it is go.');
    //
    //             $("#spinner").rotate({
    //                 duration: 1000,
    //                 angle: angleCur,
    //                 animateTo: angleCur + angleNew
    //                 // callback: function () {
    //                 //     console.log('spinner: it is stop.');
    //                 // }
    //             });
    //
    //             angleSum = 0;
    //             spinGo = true;
    //
    //             //$("#img").stopRotate();
    //         // }, spinTime);
    //
    //     }
    //     // }
    // });


});