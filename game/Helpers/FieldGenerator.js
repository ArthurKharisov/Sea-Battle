/**
 * Функция, которая возвращает массив со случайно сгенерированными кораблями
 */

define('game/Helpers/FieldGenerator.js', function () {

    return {
        generateField: function () {

            /**
             * Функция рандома
             * @param max - максимально число генератора
             * @returns {number}
             */
            function random(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }

            /**
             * Функция генерации корабля
             * @param size - размер корабля
             * @param count - кол-во кораблей
             * @param array - массив с кораблями
             * @returns {Array} возвращает массив с добавленными кораблями
             */
            function generateShip(size, count, array) {
                for (let k = 1; k <= count; k++) {
                    let type = random(2); // расположение корабля 0 - вертикально, 1 - горизонтально
                    let f = true;
                    let x;
                    let y;
                    if (type == 0) { // генерация вертикального корабля
                        while (f) {
                            f = false;
                            x = random(10 - size);
                            y = random(10);
                            for (let i = 0; i < size; i++) {
                                if (array[x + i][y] !== 0) {
                                    f = true;
                                }
                            }
                        }
                        for (let i = 0; i < size; i++) {
                            if (i == 0) { // если точка начало корабля, то зменяем вокруг нее точки на 1
                                array[x - 1][y - 1] = 1;
                                array[x - 1][y] = 1;
                                array[x - 1][y + 1] = 1;
                                array[x][y - 1] = 1;
                                array[x][y + 1] = 1;
                            } else {
                                array[x + i][y - 1] = 1;
                                array[x + i][y + 1] = 1;
                            }
                            if (i == size - 1) { // если точка конец корабля, то зменяем вокруг нее точки на 1
                                array[x + i + 1][y - 1] = 1;
                                array[x + i + 1][y] = 1;
                                array[x + i + 1][y + 1] = 1;
                                array[x + i][y - 1] = 1;
                                array[x + i][y + 1] = 1;
                            }
                            array[x + i][y] = 2; // точка корабля
                        }
                    } else { // генерация горизонтального корабля
                        while (f) {
                            f = false;
                            x = random(10);
                            y = random(10 - size);
                            for (let i = 0; i < size; i++) {
                                if (array[x][y + i] !== 0) {
                                    f = true;
                                }
                            }
                        }
                        for (let i = 0; i < size; i++) {
                            if (i == 0) { // если точка начало корабля, то зменяем вокруг нее точки на 1
                                array[x - 1][y] = 1;
                                array[x - 1][y - 1] = 1;
                                array[x][y - 1] = 1;
                                array[x + 1][y - 1] = 1;
                                array[x + 1][y] = 1;
                            } else {
                                array[x - 1][y + i] = 1;
                                array[x + 1][y + i] = 1;
                            }
                            if (i == size - 1) { // если точка конец корабля, то зменяем вокруг нее точки на 1
                                array[x - 1][y + i] = 1;
                                array[x - 1][y + i + 1] = 1;
                                array[x][y + i + 1] = 1;
                                array[x + 1][y + i + 1] = 1;
                                array[x + 1][y + i] = 1;
                            }
                            array[x][y + i] = 2; // точка корабля
                        }
                    }
                }
                return array;
            }

            // генерация поля
            let arr = [];
            for (let i = -1; i <= 10; i++) {
                arr[i] = [];
                for (let j = -1; j <= 10; j++) {
                    arr[i][j] = 0;
                }
            }

            // генерация кораблей
            let n = 5;
            for (let i = 1; i < n; i++) {
                generateShip(n - i, i, arr);
            }
            return arr;
        }

    };

});
