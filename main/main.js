"use strict";
exports.__esModule = true;
var Main = /** @class */ (function () {
    function Main() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        console.log("Main!");
    }
    return Main;
}());
exports.Main = Main;
var main = new Main();
