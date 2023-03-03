import Preloader from "./scenes/_preloader/preloader.js";
import MainMenu from "./gameUI/mainMenu.js";
import Boot from "./scenes/_boot/boot.js";
import Game from "./scenes/scene1/game.js";

window.onload = () => {
  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)

  // here we had to set a Canvas because phaser 2.19 was not
  // working with WebGL and I don't know why yet...
  var game = new Phaser.Game(600, 900, Phaser.CANVAS, "gameContainer");

  //  Add the States your game has.
  game.state.add("Boot", Boot);
  game.state.add("Preloader", Preloader);
  game.state.add("MainMenu", MainMenu);
  game.state.add("Game", Game);

  //  Now start the Boot state.
  game.state.start("Boot");
};
