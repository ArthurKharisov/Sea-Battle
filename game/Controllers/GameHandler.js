/**
 * Обработчик игры
 */

define('game/Controllers/GameHandler.js', [
    "game/Components/Informator.js",
    "game/Components/Controls.js"
], function (Informator, Controls) {

    class GameHandler {
        constructor() {

            // Массивы с кораблями
            this.main = [];
            this.enemy = [];

            // Текущий игрок
            this.currentPlayer;

            // Элементы страницы
            this.el = {};
        }

        /**
         * Функция рандома
         * @param max - максимально число генератора
         * @returns {number}
         */
        random(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        /**
         * Обработчик клика игрока
         * @param e
         */
        playerShoot(e) {
            init.shoot(0, e.target.dataset.x, e.target.dataset.y);
        }

        /**
         * Поиск/Изменение элементов страницы, создание/удаление кнопок
         */
        inits() {
            this.el.infoSmall = document.querySelector(".game__title");
            this.el.infoBar = document.querySelector(".game__info");
            this.el.button = document.querySelector(".game__buttons");
            this.el.enemyField = document.querySelector(".game__field_enemy");
            this.el.playerField = document.querySelector(".game__field_main");
            this.el.infoSmall.innerText = "Игра началась!";
            this.el.button.remove();
            this.el.button = document.createElement('div');
            this.el.button.className = "game__buttons";
            this.el.info = document.createElement('div');
            this.el.info.className = "game__informer";
            this.el.info.innerHTML = new Informator("Text");
            document.querySelector(".game").appendChild(this.el.info);
            this.el.button.innerHTML = new Controls("surrender");
            document.querySelector(".game").appendChild(this.el.button);
            this.el.button = this.el.button.querySelector(".game__button_stop");
            this.el.button.addEventListener("click", () => this.end());
            this.el.info = this.el.info.querySelector(".game__informer-text");
        }

        /**
         * Удаление обработчика клика игрока
         */
        removeListener() {
            this.el.enemyField.removeEventListener("click", this.playerShoot);
        }

        /**
         * Изменение хода
         */
        togglePlayer() {
            if (this.currentPlayer == 0) {
                this.currentPlayer = 1;
                this.el.infoBar.innerText = "Ход противника";
                this.el.enemyField.style.opacity = "0.3";
                this.el.playerField.style.opacity = "1";
                this.enemyStep();
            } else {
                this.currentPlayer = 0;
                this.el.infoBar.innerText = "Ваш ход";
                this.el.enemyField.style.opacity = "1";
                this.el.playerField.style.opacity = "0.3";
                this.step();
            }
        }

        /**
         * Начало игры
         * Радомно определяется чей ход будет первым
         */
        start() {
            this.inits();
            if (this.random(2) == 0) {
                this.currentPlayer = 1;
                this.togglePlayer();
            } else {
                this.currentPlayer = 0;
                this.togglePlayer();
            }
        }

        /**
         * Конец игры
         */
        end() {
            this.currentPlayer = 3;
            this.el.infoBar.innerText = "";
            this.el.enemyField.style.opacity = "1";
            this.el.playerField.style.opacity = "1";
            this.el.infoSmall.innerText = "Игра закончена.";
            this.el.button.remove();
            this.el.button = document.createElement('div');
            this.el.button.className = "game__buttons";
            this.el.button.innerHTML = new Controls("again");
            document.querySelector(".game").appendChild(this.el.button);
            this.inform(0,"surrend");
            this.removeListener();
        }

        /**
         * Шаг игрока
         */
        step() {
            this.el.enemyField.addEventListener("click", this.playerShoot);
        }

        /**
         * Шаг компьютера
         */
        enemyStep() {
            let x;
            let y;
            let f = false;
            let clock = (this.random(2)) * 100;

            while (f == false) {
                x = this.random(10);
                y = this.random(10);
                if ((this.main[x][y] !== 3) && (this.main[x][y] !== 4)) f = true;
            }
            setTimeout(() => {
                if(this.currentPlayer == 1) this.shoot(1, x, y);
            }, clock);
        }

        checkNear(xOld, yOld, x, y, arr) {
            let f = false;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (!(i == 0 && j == 0)) {
                        if ((arr[x + i][y + j] == 2)) {
                            f = true;
                        }
                        if ((arr[x + i][y + j] == 4) && !(xOld == (x + i) && yOld == (y + j))) {
                            f = this.checkNear(x, y, x + i, y + j, arr);
                        }
                    }
                }
            }
            return f;
        }

        /**
         * Выстрел по ближайшим точкам при попадании
         * @param player - чей выстрел
         * @param x - координата х
         * @param y - координата y
         */
        shootnear(player, x, y) {
            x = parseInt(x);
            y = parseInt(y);
            let field = (player == 0) ? this.el.enemyField : this.el.mainField;
            let arr = (player == 0) ? this.enemy : this.main;
            let values = [];
            let element = [];
            let k = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (!(i == 0 && j == 0)) {
                        values[k] = arr[x + i][y + j];
                        k++;
                    }
                }
            }
            if ((!values.includes(2)) && (!values.includes(4))) {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (((x + i >= 0) && (x + i <= 9)) && ((y + j >= 0) && (y + j <= 9))) {
                            this.shoot(player, x + i, y + j, false);
                        }
                    }
                }
            } else if (values.includes(2)) {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if ((!i == 0 && !j == 0)) {
                            if (((x + i >= 0) && (x + i <= 9)) && ((y + j >= 0) && (y + j <= 9))) {
                                this.shoot(player, x + i, y + j, false);
                            }
                        }
                    }
                }
            } else if (values.includes(4)) {
                let f = false;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (!(i == 0 && j == 0)) {
                            if (arr[x + i][y + j] == 4) {
                                f = this.checkNear(x, y, x + i, x + j, arr);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Обработчик выстрела
         * @param player - чей выстрел 0 - игрок, 1 - компьютер
         * @param x - координата выстрела x
         * @param y - координата выстрела y
         * @param sw - флаг, нужно ли изменить ход по умолчанию true
         * @returns {boolean}
         */
        shoot(player, x, y, sw = true) {
            let f = false;
            let element;
            if (player == 0) {
                element = this.el.enemyField.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (this.enemy[x][y] == 2) {
                    element.classList.add("hit");
                    this.enemy[x][y] = 4;
                    if (sw == true) {
                        this.shootnear(player, x, y);
                        this.inform(player, "hit", x, y);
                        f = true;
                    }
                } else if ((this.enemy[x][y] == 1) || (this.enemy[x][y] == 0)) {
                    element.classList.toggle("miss");
                    this.enemy[x][y] = 3;
                    if (sw == true) {
                        this.inform(player, "miss", x, y);
                        this.removeListener();
                        this.togglePlayer();
                        f = true;
                    }
                }
            } else {
                element = this.el.playerField.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                if (this.main[x][y] == 2) {
                    element.classList.add("hit");
                    this.main[x][y] = 4;
                    if (sw == true) {
                        this.inform(player, "hit", x, y);
                        this.shootnear(player, x, y);
                        this.enemyStep();
                        f = true;
                    }

                } else if ((this.main[x][y] == 1) || (this.main[x][y] == 0)) {
                    element.classList.add("miss");
                    this.main[x][y] = 3;
                    if (sw == true) {
                        this.inform(player, "miss", x, y);
                        this.togglePlayer();
                        f = true;
                    }
                }
            }
            return f;
        }

        /**
         * Вывод информации о игре в textview
         * @param player - от кого сообщение, 0 - игрок, 1 - компьютер
         * @param message - тип сообщения "hit" - попадание, "miss" - мимо, "surrend" - сдаться, "win" - победа
         * @param x - координата выстрела x
         * @param y - координата выстрела y
         */
        inform(player, message, x, y) {
            let queryString = window.location.search;
            let urlParams = new URLSearchParams(queryString);
            if (player == 0) {
                switch (message){
                    case "hit":
                        this.el.info.value = `${urlParams.get('name')}: ${x}:${y} - попал!\n${this.el.info.value}`;
                        break;
                    case "miss":
                        this.el.info.value = `${urlParams.get('name')}: ${x}:${y} - мимо\n${this.el.info.value}`;
                        break;
                    case "surrend":
                        this.el.info.value = `${urlParams.get('name')} сдается\n${this.el.info.value}`;
                        break;
                }

            } else {
                switch (message) {
                    case "hit":
                        this.el.info.value = `Компьютер: ${x}:${y} - попал!\n${this.el.info.value}`;
                        break;
                    case "miss":
                        this.el.info.value = `Компьютер: ${x}:${y} - мимо\n${this.el.info.value}`;
                        break;
                }
            }
        }

        /**
         * Добавление массива с данными о кораблях
         * @param player - чьи данные
         * @param array - массив с данными
         */
        add(player, array) {
            (player == 0) ? this.main = array : this.enemy = array;
        }

    }

    const init = new GameHandler();
    return init;

});
