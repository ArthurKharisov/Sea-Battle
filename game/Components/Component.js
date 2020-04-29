define('game/Components/Component.js', function () {

    return class Component {

        constructor() {

        }

        toString() {
            return this.render();
        }

        render() {}
    }

});
