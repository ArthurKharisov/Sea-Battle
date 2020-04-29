/**
 * Компонент, который возвращает информационные элементы
 */

define('game/Components/Informator.js',['game/Components/Component.js'], function(Component) {
    return class Informator extends Component {

        /**
         * @param type тип элемента
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
            return (this.type=="Title") ? this.renderTitle() : this.renderInfo();
        }

        /**
         * Рендер блока приветствия
         * @returns {string}
         */
        renderTitle() {
            let queryString = window.location.search;
            let urlParams = new URLSearchParams(queryString);
            return `<h3 class="game__title">Привет, ${urlParams.get('name')}! Ты готов(a) к игре?)</h3>`;
        }

        /**
         * Рендер блока информации о ходе игры
         * @returns {string}
         */
        renderInfo() {
            return `
                    <div class="game__informer">
                        <textarea readonly autofocus class="game__informer-text">Начало игры.</textarea>
                    </div>`;
        }
    }
});