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

            // Кол-во подбитых ячеек
            this.enemyHit = 0;
            this.playerHit = 0;

            this.isHit = false;
            this.lastStep = {
                x: -1,
                y: -1
            };

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
            if (e.target.className.match("game__block")) init.shoot(0, e.target.dataset.x, e.target.dataset.y);
            if (init.playerHit == 20) init.end(0);
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
         * Изменение вида клетки
         * @param x - координата х
         * @param y - координата y
         * @param field - поле
         * @param type - вид изменения
         */
        changeView(x, y, field, type) {
            let slot = field.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            slot.classList.add(type);
        }

        /**
         * Изменение хода
         */
        togglePlayer() {
            if (this.currentPlayer == 0) {
                this.currentPlayer = 1;
                this.el.infoBar.innerText = "Ход противника";
                this.el.enemyField.style.opacity = "0.4";
                this.el.playerField.style.opacity = "1";
                this.enemyStep();
            } else {
                this.currentPlayer = 0;
                this.el.infoBar.innerText = "Ваш ход";
                this.el.enemyField.style.opacity = "1";
                this.el.playerField.style.opacity = "0.4";
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
        end(player = 2) {
            this.currentPlayer = 2;
            this.el.infoBar.innerText = "";
            this.el.enemyField.style.opacity = "1";
            this.el.playerField.style.opacity = "1";
            this.el.infoSmall.innerText = "Игра закончена.";
            this.el.button.remove();
            this.el.button = document.createElement('div');
            this.el.button.className = "game__buttons";
            this.el.button.innerHTML = new Controls("again");
            document.querySelector(".game").appendChild(this.el.button);
            this.removeListener();
            if (player == 0) {
                this.inform(player, "win");
            } else {
                (player == 2) ? this.inform(0, "surrend") : this.inform(player, "win");
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (this.enemy[i][j] == 2) {
                            this.changeView(i, j, this.el.enemyField, "missed");
                        }
                    }
                }
            }
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
            let clock = 500 + ((this.random(4)) * 1000); // время шага
            let arr = this.main;
            x = this.random(10);
            y = this.random(10);
            while (f == false) {
                if (!this.isHit) { // если предыдущий встрел не попал
                    if ((this.main[x][y] !== 3) && (this.main[x][y] !== 4)) {
                        f = true;
                    } else { // если сгенерированное число попало либо в уничтоженный корабль, либо в клетку в которую уже был произведен выстрел, то берем след. координату
                        if ((y + 1 <= 9) && (y + 1 >= 0)) {
                            y++;
                        } else if ((x + 1 <= 9) && (x + 1 >= 0)) {
                            x++;
                            y = 0;
                        } else {
                            x = 0;
                            y = 0;
                        }
                    }
                } else { // если предыдущий встрел попал
                    let coord = {
                        x: -1,
                        y: -1
                    };
                    x = this.lastStep.x;
                    y = this.lastStep.y;
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (!(i == 0 && j == 0)) {
                                if (arr[x + i][y + j] == 4) {
                                    coord.x = x + i;
                                    coord.y = y + j;
                                }
                            }
                        }
                    }

                    if ((coord.x == -1) && (coord.y == -1)) { // проверка, если это первое попадание, то след. выстрел делаем рандомно по перекрестию
                        switch (this.random(4)) {
                            case 0:
                                x = this.lastStep.x - 1;
                                y = this.lastStep.y;
                                break;
                            case 1:
                                x = this.lastStep.x;
                                y = this.lastStep.y + 1;
                                break;
                            case 2:
                                x = this.lastStep.x + 1;
                                y = this.lastStep.y;
                                break;
                            case 3:
                                x = this.lastStep.x;
                                y = this.lastStep.y - 1;
                                break;
                        }
                    } else { // если это не первое попадание, то след. выстрел делаем по положению корабля
                        if (coord.x == x) { // горизонтально
                            let flag = false;
                            let step = y;
                            while (!f) {
                                step--;
                                if ((arr[x][step] == 3)) {
                                    step = y;
                                    while (true) {
                                        step++;
                                        if (arr[x][step] !== 4) {
                                            y = step;
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                                if (arr[x][step] !== 4) {
                                    y = step;
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if (coord.y == y) { // вертикально
                            let flag = false;
                            let step = x;
                            while (!flag) {
                                step--;
                                if ((arr[step][y] == 3)) {
                                    step = x;
                                    while (true) {
                                        step++;
                                        if (arr[step][y] !== 4) {
                                            x = step;
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                                if (arr[step][y] !== 4) {
                                    x = step;
                                    flag = true;
                                    break;
                                }
                            }
                        }
                    }
                    if ((this.main[x][y] !== 3) && (this.main[x][y] !== 4)) {
                        if (((x >= 0) && (x <= 9)) && ((y >= 0) && (y <= 9))) {
                            f = true;
                        }
                    }
                }
            }
            setTimeout(() => {
                if (this.currentPlayer == 1) this.shoot(1, x, y);
                if (this.enemyHit == 20) this.end(1);
            }, clock);

        }

        /**
         * Проверка поврежден ли корабль полностью, если нет, то возвращает true, также производит обстрел вокруг корабля
         * @param shoot - нужно ли стрелять
         * @param xOld - старая координата x поврежденного корабля
         * @param yOld - старая координата y поврежденного корабля
         * @param x - новая координата x поврежденного корабля
         * @param y - новая координата y поврежденного корабля
         * @param arr - массив с кораблями
         * @returns {boolean}
         */
        checkNear(shoot, xOld, yOld, x, y, arr) {
            let f = false;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (!(i == 0 && j == 0)) {
                        if ((arr[x + i][y + j] == 2)) {
                            return true;
                        }
                        if ((arr[x + i][y + j] == 4) && !(xOld == (x + i) && yOld == (y + j))) {
                            f = (shoot == 0) ? this.checkNear(0, x, y, (x + i), (y + j), arr) : this.checkNear(1, x, y, (x + i), (y + j), arr);
                            if ((this.currentPlayer == 0) && (shoot == 1)) {
                                this.changeView(x + i, y + j, this.el.enemyField, "enemy");
                            }
                        }
                        if ((shoot == 1) && (arr[x + i][y + j] == 1)) {
                            if (((x + i >= 0) && (x + i <= 9)) && ((y + j >= 0) && (y + j <= 9))) {
                                this.shoot(this.currentPlayer, (x + i), (y + j), false);
                            }
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
                        values[k] = arr[x + i][y + j]; // записываем значения близлежащих точек
                        k++;
                    }
                }
            }
            if ((!values.includes(2)) && (!values.includes(4))) { // если вокруг нет ни кораблей(2) ни взорванных кораблей(4), то обстреливаем близлежащие точки
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (((x + i >= 0) && (x + i <= 9)) && ((y + j >= 0) && (y + j <= 9))) {
                            this.shoot(player, x + i, y + j, false);
                        }
                    }
                }
                if (player == 0) this.changeView(x, y, field, "enemy");
                if (player == 1) this.isHit = false;
                this.inform(player, "destroy");
            } else { // если встретилась часть корабля или часть взовранного корабля, то обстреливаем клетки крест на крест
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if ((!i == 0 && !j == 0)) {
                            if (((x + i >= 0) && (x + i <= 9)) && ((y + j >= 0) && (y + j <= 9))) {
                                this.shoot(player, x + i, y + j, false);
                            }
                        }
                    }
                }
                if ((values.includes(4)) && !(values.includes(2))) { // если встретилась часть взорванного корабля, то возле этой точки проверяем наличие частей корабля
                    let xNew;
                    let yNew;
                    let f = false;
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (!(i == 0 && j == 0)) {
                                if (arr[x + i][y + j] == 4) {
                                    xNew = x + i;
                                    yNew = y + j;
                                    f = this.checkNear(0, x, y, xNew, yNew, arr);
                                }
                            }
                        }
                    }
                    if (!f) { // если целых частей корабля не обнаружено, то обстреливаем ближайшие точки
                        this.checkNear(1, -1, -1, x, y, arr);
                        if (player == 0) {
                            this.changeView(x, y, this.el.enemyField, "enemy");
                            this.inform(player, "destroy");
                        }
                        if (player == 1) this.isHit = false;
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
            let fieldUI = (player == 0) ? this.el.enemyField : this.el.playerField;
            let field = (player == 0) ? this.enemy : this.main;
            let hit = (player == 0) ? this.playerHit : this.enemyHit;
            if (field[x][y] == 2) {
                this.changeView(x, y, fieldUI, "hit");
                (player == 0) ? this.playerHit++ : this.enemyHit++;
                field[x][y] = 4;
                if (sw == true) {
                    if (player == 0) {
                        this.shootnear(player, x, y);
                        this.inform(player, "hit", x, y);
                    }
                    if (player == 1) {
                        this.lastStep.x = x;
                        this.lastStep.y = y;
                        this.isHit = true;
                        this.shootnear(player, x, y);
                        this.inform(player, "hit", x, y);
                        this.enemyStep();
                    }
                }
            } else if ((field[x][y] == 1) || (field[x][y] == 0)) {
                this.changeView(x, y, fieldUI, "miss");
                field[x][y] = 3;
                if (sw == true) {
                    this.inform(player, "miss", x, y);
                    if (player == 0) this.removeListener();
                    this.togglePlayer();
                }
            }
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
            let name = (player == 0) ? urlParams.get('name') : "Компьютер";
            x++;
            y++;
            switch (message) {
                case "hit":
                    this.el.info.value = `${name}: ${x}:${y} - попал!\n${this.el.info.value}`;
                    break;
                case "miss":
                    this.el.info.value = `${name}: ${x}:${y} - мимо\n${this.el.info.value}`;
                    break;
                case "destroy":
                    this.el.info.value = `${name} - уничтожил корабль!\n${this.el.info.value}`;
                    break;
                case "surrend":
                    this.el.info.value = `${name} сдается\n${this.el.info.value}`;
                    break;
                case "win":
                    this.el.info.value = `${name} победил!\n${this.el.info.value}`;
                    break;
            }

        }

        /**
         * Добавление массива с данными о кораблях
         * @param player - чьи данные
         * @param array - массив с данными
         */
        add(player, array) {
            if (player == 0) {
                this.main = array
            } else {
                this.enemy = array;
            }
        }

    }

    const init = new GameHandler();
    return init;

});
