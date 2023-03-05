import Boot from "./scenes/_boot/boot.js";
import MainMenu from "./gameUI/mainMenu.js";
import Game from "./scenes/scene1/scene1.game.js";

window.onload = () => {
  //  Create your Phaser game and inject it into the gameContainer div.
  //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)

  // here we had to set a Canvas because phaser 2.19 was not
  // working with WebGL and I don't know why yet...
  //var game = new Phaser.Game(600, 900, Phaser.CANVAS, "gameContainer");

  //  Add the States your game has.
  /* Phaser 2 works with states, but Phaser 3 works with scenes, which are
  // also configured in a different way using a configuration object.
  game.state.add("Boot", Boot);
  game.state.add("Preloader", Preloader);
  game.state.add("MainMenu", MainMenu);
  game.state.add("Game", Game);
  // Let's translate this to a phaser 3 configuration below: */
  var boot = new Boot();
  var mainMenu = new MainMenu();
  var scene1 = new Game();
  // As we explained in the documentation, we remove the Preloader scene,
  // because we will preload what we need in each scene inside each scene's code.
  var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [boot, mainMenu, scene1],
  };
  var game = new Phaser.Game(config);

  //  Now start the Boot state. (not necesary in Phaser 3)
  //game.state.start("Boot");
};
