/**
 * Компонент, который возвращает элементы управления (кнопки)
 */

define('game/Components/Controls.js', ['game/Components/Component.js'], function (Component) {
    return class Controls extends Component {
        /**
         * @param type - тип кнопок
         */
        constructor(type) {
            super();
            this.type = type;
        }

        /**
         * Рендер компонента
         * @returns {string}
         */
        render() {
            let str = "";
            switch(this.type){
                case "start":
                    str = this.renderStartButton();
                    break;
                case "surrender":
                    str = this.renderSurrendButton();
                    break;
                case "again":
                    str = this.renderAgainButton();
                    break;
                case "name":
                    str = this.renderChangeNameButton();
                    break;
            }
            return str;
        }

        /**
         * Рендер кнопок "Переставить корабли" и "Начать игру"
         * @returns {string}
         */
        renderStartButton() {
            return `
                    <div class="game__buttons">
                         <a href="javascript:void(0)" class="game__button game__button_replace">Переставить корабли</a>
                         <a href="javascript:void(0)" class="game__button game__button_start">Начать игру!</a>
                    </div>
            `;
        }

        /**
         * Рендер кнопоки "Сдаться"
         * @returns {string}
         */
        renderSurrendButton() {
            return `<a href="javascript:void(0)" class="game__button game__button_stop">Сдаться</a>`;
        }

        /**
         * Рендер кнопоки "Заново"
         * @returns {string}
         */
        renderAgainButton() {
            return `<a href="javascript:void(0)" onclick="document.location.reload()" class="game__button game__button_again">Хочу еще раз!</a>`;
        }

        /**
         * Рендер кнопоки "Продолжить"
         * @returns {string}
         */
        renderChangeNameButton() {
            return `<div class="game__buttons">
                        <a href="javascript:void(0)" class="game__button game__button_change">Продолжить</a>
                    </div>
            `;
        }
    }
});