//
// 1. Отключение скрола на мобильных устройствах
//
window.onload = function () { // $(window).load(function () {
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, true);
};

//
// 2. Подключение SVG через тег <object> c jQuery и без
//
// <object data="bbbbbb.svg" type="image/svg+xml" id="alphasvg" width="100%" height="100%"></object>
jQuery(document).ready(function ($) {
    $(window).load(function () {
        var a = document.getElementById("alphasvg");
        var svgDoc = a.contentDocument;
        var delta = svgDoc.getElementsByTagName("path");

        // jQuery
        $(delta).click(function () {
            //do
        })

        // Или убить jQuery и просто на JavaScript
        delta.addEventListener("mousedown", function () {
            //do
        }, false);

    });
});
// https://stackoverflow.com/questions/5990349/contentdocument-in-jquery
// https://stackoverflow.com/questions/2753732/how-to-access-svg-elements-with-javascript/3379830#3379830