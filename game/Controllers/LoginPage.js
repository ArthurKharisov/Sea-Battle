/**
 * Страница для присваивания имени игроку
 */
define('game/Controllers/LoginPage.js', [
    "game/Components/Component.js",
    "game/Components/Controls.js",
    "game/Controllers/GamePage.js"
], function (Component, Controls, Game) {

    return class LoginPage extends Component {

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
                        <h3 class="game__title">Введите свое имя:</h3>
                        <input class="game__input" type="text">
                        ${new Controls("name")}
                    </div>
                </div>
            `);
        }

        /**
         * Обработчик для загрузки следующей страницы
         */
        loadNextPage() {
            let input = document.querySelector(".game__input");
            console.log(input.value);
            if (input.value !== "") {
                window.location.href = `./index.html?name=${input.value}`;
                let game = new Game();
                document.body.innerHTML = game;
                game.afterRender();
            }
        }

        /**
         * Добавление событий
         */
        afterRender() {
            document.querySelector(".game__button_change").addEventListener("click", this.loadNextPage)
        }

    }

});

