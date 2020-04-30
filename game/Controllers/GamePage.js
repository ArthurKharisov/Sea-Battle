/**
 * Главная страница
 */
define('game/Controllers/GamePage.js', [
    "game/Components/Component.js",
    "game/Controllers/GameHandler.js",
    "game/Components/Informator.js",
    "game/Components/Field.js",
    "game/Components/Controls.js"
], function (Component, GameHandler, Informator, Field, Controls) {

    return class GamePage extends Component {

        constructor() {
            super();
        }

        /**
         * Рендер страницы
         * @returns {string}
         */
        render() {
            return (`
               <div class="wrapper">
                    <div class="header">
                        <h2 class="header__title">Морской бой</h2>
                    </div>
                    <div class="game">
                        ${new Informator("Title")}
                        ${new Field()}
                        ${new Controls("start")}
                    </div>
                </div>
            `);
        }

        /**
         * Обработчик кнопки "Переставить корабли"
         */
        buttonReplace() {
            let field = document.querySelector(".game__field_main");
            field.innerHTML = new Field("main");
        }

        /**
         * Обработчик кнопки начала игры
         */
        buttonStart() {
            GameHandler.start();
        }

        /**
         * Добавление событий
         */
        afterRender() {
            document.querySelector(".game__button_replace").addEventListener("click", this.buttonReplace);
            document.querySelector(".game__button_start").addEventListener("click", this.buttonStart);
        }

    }

});

