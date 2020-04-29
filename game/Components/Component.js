/**
 * Компонент родитель
 */

define('game/Components/Component.js', function () {

    return class Component {

        constructor() {

        }

        /**
         * Вызов рендера при переводе класса в строку
         * @returns {string}
         */
        toString() {
            return this.render();
        }

        /**
         * Рендер компонента
         * @returns {string}
         */
        render() {}
    }

});
