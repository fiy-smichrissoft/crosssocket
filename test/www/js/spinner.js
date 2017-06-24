$(function () {

    // Блокировать поворот экрана
    // var switcher = false;
    // console.log(switcher);
    // $(window).on('resize', function () {
    //     switcher = !switcher;
    //     if (switcher)
    //         $('body').hide();
    //     else
    //         $('body').show();
    //
    //     console.log(switcher);
    // });

    //Отключение скрола
    $(document).on('touchstart', function (e) {
        e.preventDefault();
    });

    // Блок со спинером
    var spinnerDIV = document.getElementById("spinnerDIV");

    // Маркер нажатого состояния на спинере
    // var spinDown = false;

    // Размеры области
    var Xmax = spinnerDIV.clientWidth;
    var Ymax = spinnerDIV.clientHeight;
    // Смещение центра координат
    var Xzero = spinnerDIV.offsetLeft + Xmax / 2;
    var Yzero = spinnerDIV.offsetTop + Ymax / 2;
    // Вектор из текущей и предшествующей позиции - [x1, y1, x2, y2]
    var vector = [0.0, 0.0, 0.0, 0.0];

    // Текущий угол поворота
    var angleCur = 0.0;
    // Угол смещения
    var angleNew = 0.0;
    // Суммарный угол смещения за одно движение
    var angleSum = 0.0;
    // Промежуточные углв
    var angle2, angle1 = 0.0;

    // Вычисление угла поворота спинера
    function angleUp(pageX, pageY) {
        // Обновление начальной и конечной точки вектора
        vector[2] = vector[0];
        vector[3] = vector[1];
        vector[0] = pageX - Xzero;
        vector[1] = 0 - (pageY - Yzero);
        if (vector[2] !== vector[0] || vector[3] !== vector[1]) {

            // Промежуточные углы (по часовой от горизонта)
            if (vector[3] <= 0)
                angle1 = -1 * Math.atan2(vector[3], vector[2]) / Math.PI * 180;
            else
                angle1 = 360 - Math.atan2(vector[3], vector[2]) / Math.PI * 180;
            if (vector[1] <= 0)
                angle2 = -1 * Math.atan2(vector[1], vector[0]) / Math.PI * 180;
            else
                angle2 = 360 - Math.atan2(vector[1], vector[0]) / Math.PI * 180;

            // Корректировка при проходе через 0 (точку отсчета)
            if (vector[2] > 0 && vector[3] > 0 && vector[0] > 0 && vector[1] <= 0)
                angleNew = (360 - angle1 + angle2);
            else if (vector[2] > 0 && vector[3] < 0 && vector[0] > 0 && vector[1] >= 0)
                angleNew = -(360 - angle2 + angle1);
            else
                angleNew = (angle2 - angle1);

            // Обновление значений углов
            angleSum = angleSum + angleNew;
            angleCur = angleCur + angleNew;
            // console.log('spinner: vector is ' + vector);
            // console.log('spinner: angle2 is ' + angle2);
            // console.log('spinner: angle1 is ' + angle1);
            // console.log('spinner: angleNew is ' + angleNew);
            // console.log('spinner: angleSum is ' + angleSum);
            // console.log('spinner: angleCur is ' + angleCur);
        }
    }


    /*

     //==============================================================
     // ФИЗИКА с управляемым поворотом спинера при ведению по нему
     //==============================================================

     // Включение нажатого состояния на спинере
     // (Desktop)
     $("#spinnerSVG").mousedown(function () {
     spinDown = true;
     console.log('spinner: spinDown is ' + spinDown + ' (mousedown)');
     });
     // (Mobile)
     $("#spinnerSVG").bind('touchstart', function () {
     spinDown = true;
     console.log('spinner: spinDown is ' + spinDown + ' (touchstart)');
     });

     // Выключение нажатого состояния на спинере
     // (Desktop)
     $("*").mouseup(function () {
     spinDown = false;
     console.log('spinner: spinDown is ' + spinDown + ' (mouseup)');
     console.log('spinner: angleSum is ' + angleSum);
     });
     // (Mobile)
     $("*").bind('touchend', function () {
     spinDown = false;
     console.log('spinner: spinDown is ' + spinDown) + ' (touchend)';
     });

     // Поворот спинера по ведению по нему
     // (Desktop)
     $("#spinnerSVG").mousemove(function (event) {
     if (spinDown) {
     // Анимация вращения спинера
     angleUp(event);
     $("#spinner").rotate({
     angle: angleCur,
     animateTo: angleCur + angleNew,
     // duration: 1,
     // callback: function () {
     //     console.log('spinner: it is stop.');
     // }
     });
     } else {
     vector[0] = event.pageX - Xzero;
     vector[1] = -(event.pageY - Yzero);
     //console.log('spinner: vector is ' + vector);
     }
     });
     // (Mobile)
     $("#spinnerSVG").bind('touchmove', function (event) {
     spinDown = true;
     if (spinDown) {
     // Анимация вращения спинера
     angleUp(event);
     $("#spinner").rotate({
     angle: angleCur,
     animateTo: angleCur + angleNew,
     // duration: 1,
     // callback: function () {
     //     console.log('spinner: it is stop.');
     // }
     });
     } else {
     vector[0] = event.pageX - Xzero;
     vector[1] = -(event.pageY - Yzero);
     //console.log('spinner: vector is ' + vector);
     }
     $("#status").textContent += 'spinner: vector is ' + vector;
     });

     */


    /*

     //==============================================================
     // ФИЗИКА с изменяющейся скоростью спинера
     //==============================================================

     */

    // // Временной маркер для периода действия
    // var spinGo = true;
    //
    // // Период вращения
    // var spinTime = 0;
    //
    // // Анализ производимых действий
    // $("#spinnerSVG").on('touchmove', function () {
    // //$("#spinnerSVG").on('mousemove', function () {
    //
    //     //if (spinDown) {
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
    //         //setTimeout(function () {
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
    //         //}, spinTime);
    //
    //     }
    //     //}
    // });

    // Вектор с точками начала и конца движения
    var vector2 = [0.0, 0.0, 0.0, 0.0];
    // Счетчик времени движения
    var spinTimer = 0;
    // Длина движения
    var spinRoad = 0.0;
    // Скорость движения
    var spinSpeed = 0.0;
    // Положение курсора
    var pageX = 0.0;
    var pageY = 0.0;

    // Старт движения
    $("#spinnerInvisible").on('touchstart mousedown', function (event) {
        // console.log(event);
        // Положение курсора
        if (event.type == 'touchstart') {
            pageX = event.originalEvent.touches[0].pageX;
            pageY = event.originalEvent.touches[0].pageY;
        } else if (event.type == 'mousedown') {
            pageX = event.pageX;
            pageY = event.pageY;
        }
        // Актуализация для физики с управляемым поворотом спинера при ведению по нему
        // $("#spinner").stopRotate();
        // angleCur = parseFloat($("#spinner").getRotateAngle());
        vector = [pageX - Xzero, -(pageY - Yzero), pageX - Xzero, -(pageY - Yzero)];
        // console.log('spinner: vector is ' + vector);
        // Точка начала движения
        vector2[0] = pageX - Xzero;
        vector2[1] = -(pageY - Yzero);
        // console.log('spinner: vector2 is ' + vector2);
        // Старт счетчика времени движения
        spinTimer = Date.now();
        // console.log('spinTimer: ' + spinTimer);
        console.log('event: touchstart mousedown');

    });

    // Конец движения
    $("#spinnerInvisible").on('touchend mouseup', function (event) { //
        // console.log(event);
        // Положение курсора
        if (event.type == 'touchend') {
            pageX = event.originalEvent.changedTouches[0].pageX;
            pageY = event.originalEvent.changedTouches[0].pageY;
        } else if (event.type == 'mouseup') {
            pageX = event.pageX;
            pageY = event.pageY;
        }
        // Точка конца движения
        vector2[2] = pageX - Xzero;
        vector2[3] = -(pageY - Yzero);

        // Промежуточные углы (по часовой от горизонта)
        if (vector2[3] <= 0)
            a1 = -1 * Math.atan2(vector2[3], vector2[2]) / Math.PI * 180;
        else
            a1 = 360 - Math.atan2(vector2[3], vector2[2]) / Math.PI * 180;
        if (vector2[1] <= 0)
            a2 = -1 * Math.atan2(vector2[1], vector2[0]) / Math.PI * 180;
        else
            a2 = 360 - Math.atan2(vector2[1], vector2[0]) / Math.PI * 180;
        console.log('new: ' + a1 + ' old: ' + a2);

        // Корректировка при проходе через 0 (точку отсчета)
        if (vector2[2] > 0 && vector2[3] > 0 && vector2[0] > 0 && vector2[1] <= 0) {
            aNew = (360 - a1 + a2);
            // console.log('1: ' + aNew);
        }
        else if (vector2[2] > 0 && vector2[3] < 0 && vector2[0] > 0 && vector2[1] >= 0) {
            aNew = -(360 - a2 + a1);
            // console.log('2: ' + aNew);
        }
        else {
            aNew = (a2 - a1);
            // console.log('3: ' + aNew);
        }


        // Расчет времени, длины и скорости движения
        spinTimer = Date.now() - spinTimer;

        spinRoad = -1 * aNew;

        spinSpeed2 = spinSpeed;
        spinSpeed = spinRoad / spinTimer  * 10000;

        //console.log(vector2 + ' ' + spinTimer + ' ' + spinRoad + ' ' + spinSpeed);

        angleCur = parseFloat($("#spinner").getRotateAngle());
        // Вращение с ускорением
        $("#spinner").rotate({
            duration: 15000,
            angle: angleCur,
            animateTo: angleCur + spinSpeed2 + spinSpeed
            //callback: function () {
            //    console.log('spinner: it is stop.');
            //}
        });
        console.log('event: touchend mouseup ' + (angleCur + spinSpeed2 + spinSpeed));
    });

});