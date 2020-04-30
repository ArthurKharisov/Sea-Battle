/**
 * Компонент, который возвращает игровые поля
 */

define('game/Components/Field.js', [
    'game/Controllers/GameHandler.js',
    'game/Components/Component.js',
    'game/Helpers/FieldGenerator.js'
], function (GameHandler, Component, Field) {

    return class Fields extends Component {

        /**
         * @param type - тип возвращаемого поля
         */
        constructor(type = "all") {
            super();
            this.type = type;
        }

        /**
         * Рендер определенного поля
         * @param type - тип поля
         * @returns {string}
         */
        renderField(type) {

            let arr = Field.generateField();
            GameHandler.add(type, arr);

            let className;
            let str = "";
            let player = (type == 0) ? "Ваше поле" : "Поле противника";

            for (let i = 0; i < 10; i++) {
                str += `<div class="game__field-row">`;
                for (let j = 0; j < 10; j++) {
                    if ((type == 0) && (arr[i][j] == 2)) {
                        className = "game__block ship";
                    } else {
                        className = "game__block";
                    }
                    str += `<div class="${className}" data-x="${i}" data-y="${j}"></div>`;
                }
                str += `</div>`;
            }
            str += `<span class="game__field-title">${player}</span>`;
            return str;
        }

        /**
         * Общий рендер
         * @returns {string}
         */
        renderMain() {
            return ` <div class="game__fields">
                         <div class="game__field game__field_main">
                             ${this.renderField(0)}
                         </div>
                         <h3 class="game__info"></h3>
                         <div class="game__field game__field_enemy">
                             ${this.renderField(1)}
                          </div>
                    </div>`;
        }

        /**
         * Рендер компонента
         * @returns {string}
         */
        render() {
            let str = "";
            switch (this.type) {
                case "all":
                    str = this.renderMain();
                    break;
                case "main":
                    str = `${this.renderField(0)}`;
                    break;
                case "enemy":
                    str = `${this.renderField(1)}`;
                    break;
            }
            return str;
        }
    }
});