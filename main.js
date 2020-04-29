'use strict';
requirejs(['game/Controllers/GamePage.js'], function (Game) {
    let game = new Game();
    document.body.innerHTML = game;
});