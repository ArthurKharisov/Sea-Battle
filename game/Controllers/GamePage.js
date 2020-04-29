define('game/Controllers/GamePage.js', [
    "game/Components/Component.js",
    "game/Controllers/GameHandler.js",
    "game/Components/Popup.js",
    "game/Components/Informator.js",
    "game/Components/Field.js",
    "game/Components/Controls.js"
], function (Component, GameHandler, Popup, Informator, Field, Controls) {

    return class GamePage extends Component{

        constructor() {
            super();
        }

        render() {
            return (`
               <div class="wrapper"></div>
            `);
        }

        

    }

});

