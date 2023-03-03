import Preloader from "./util/preloader.js";
import MainMenu from "./gameUI/mainMenu.js";
import Boot from "./boot.js";
import Game from "./game.js";

window.onload = () => {
  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)

  // here we had to set a Canvas because phaser was not working with WebGL and I don't know why yet
  var game = new Phaser.Game(600, 900, Phaser.CANVAS, "gameContainer");

  //  Add the States your game has.
  //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
  game.state.add("Boot", Boot); // BasicGame.Boot);
  game.state.add("Preloader", Preloader); // BasicGame.Preloader);
  game.state.add("MainMenu", MainMenu); //BasicGame.MainMenu);
  game.state.add("Game", Game); // BasicGame.Game);

  //  Now start the Boot state.
  game.state.start("Boot");
};
