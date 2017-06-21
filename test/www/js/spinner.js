$(function () {

    // Блок со спинером
    var spinnerDIV = document.getElementById("spinnerDIV");

    // Маркер нажатого состояния на спинере
    var spindown = false;

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

    // Вычисление угла поворота спинера
    function angleUp(event) {
        // Обновление начальной и конечной точки вектора
        vector[2] = vector[0];
        vector[3] = vector[1];
        vector[0] = event.pageX - Xzero;
        vector[1] = -(event.pageY - Yzero);
        if (vector[2] !== vector[0] || vector[3] !== vector[1]) {
            // Промежуточные углы
            var angle2 = Math.atan2(vector[3], vector[2]);
            var angle1 = Math.atan2(vector[1], vector[0]);
            // Обновление значений у всех углов
            angleNew = (angle2 - angle1) / Math.PI * 180;
            angleSum = angleSum + angleNew;
            angleCur = angleCur + angleNew;
            //console.log('spinner: vector is ' + vector);
            //console.log('spinner: angle of move is ' + angleNew);
            //console.log('spinner: sum of angle is ' + angleSum);
            console.log('spinner: angleCur is ' + angleCur);
        }
    }

    // Включение нажатого состояния на спинере
    // (Desktop)
    $("#spinnerSVG").mousedown(function () {
        spindown = true;
        console.log('spinner: spindown is ' + spindown + ' (mousedown)');
    });
    // (Mobile)
    $("#spinnerSVG").bind('touchstart', function () {
        spindown = true;
        console.log('spinner: spindown is ' + spindown + ' (touchstart)');
    });

    // Выключение нажатого состояния на спинере
    // (Desktop)
    $("*").mouseup(function () {
        spindown = false;
        console.log('spinner: spindown is ' + spindown + ' (mouseup)');
        console.log(angleSum);
    });
    // (Mobile)
    $("*").bind('touchend', function () {
        spindown = false;
        console.log('spinner: spindown is ' + spindown) + ' (touchend)';
    });

    // Поворот спинера по ведению по нему
    // (Desktop)
    $("#spinnerSVG").mousemove(function (event) {
        if (spindown) {
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
        spindown = true;
        if (spindown) {
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

})