/**
 * Компонент, который возвращает игровые поля
 */

define('game/Components/Field.js',[
    'game/Controllers/GameHandler.js',
    'game/Components/Component.js',
    'game/Helpers/FieldGenerator.js'
], function(GameHandler, Component, Field) {

    return class Fields extends Component {

        /**
         * @param type - тип возвращаемого поля
         */
        constructor(type="all") {
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
            let className = "game__block";
            let block = "";
            let player = (type == 0) ? "Ваше поле" : "Поле противника";
            for(let i=0; i<10; i++) {
                block += `<div class="game__field-row">`;
                for(let j=0; j<10; j++) {
                    if (type==0) {
                        (arr[i][j] == 2) ? className = "game__block ship" : className = "game__block";
                    }
                    block += `<div class="${className}" data-x="${i}" data-y="${j}"></div>`;
                }
                block += `</div>`;
            }
            block += `<span class="game__field-title">${player}</span>`;
            return block;
        }

        /**
         * Рендер компонента
         * @returns {string}
         */
        render() {
            let str="";
            if(this.type=="all") {
                str = `
                    <div class="game__fields">
                         <div class="game__field game__field_main">
                             ${this.renderField(0)}
                         </div>
                         <h3 class="game__info"></h3>
                         <div class="game__field game__field_enemy">
                             ${this.renderField(1)}
                          </div>
                    </div>
                `;
            } else if(this.type=="main"){
                str = `${this.renderField(0)}`;
            } else if(this.type=="enemy") {
                console.log("im here");
                str = `${this.renderField(1)}`;
            }
            return str;
        }
    }
});