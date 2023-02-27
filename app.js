import Preloader from "./preloader.js";
import MainMenu from "./mainMenu.js";
import Boot from "./boot.js";
import Game from "./game.js";

window.onload = () => {
  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
  var game = new Phaser.Game(800, 600, Phaser.AUTO, "gameContainer");

  //  Add the States your game has.
  //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
  game.state.add("Boot", Boot); // BasicGame.Boot);
  game.state.add("Preloader", Preloader); // BasicGame.Preloader);
  game.state.add("MainMenu", MainMenu); //BasicGame.MainMenu);
  game.state.add("Game", Game); // BasicGame.Game);

  //  Now start the Boot state.
  game.state.start("Boot");
};
