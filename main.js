/**
 * Главный js файл, загружает страницу LoginPage, если не задано имя пользователя, иначе загружает страницу UserPage
 */
'use strict';
requirejs(['game/Controllers/GamePage.js', 'game/Controllers/LoginPage.js'], function (Game, Login) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    if(!urlParams.has('name')){
        let login = new Login();
        document.body.innerHTML = login;
        login.afterRender();
    } else {
        let game = new Game();
        document.body.innerHTML = game;
        game.afterRender();
    }
});