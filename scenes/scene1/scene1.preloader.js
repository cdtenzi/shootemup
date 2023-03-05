/*
export default class Preloader extends Phaser.Scene {

  preloadBar;

  constructor(sceneConfig) {
    super(sceneConfig);
    this.preloadBar = null;
    this.key = "Preloader";
  }
*/

// So, because of how P3 works (explained in "Migrating_from_Phaser2_to_Phaser3.md" here),
// we conver our Preloader Scene into a function that will load everything we need for
// our scene1. We will invoke this function from there (scene1.game.js).
export function loadSprites(scene) {
  //  Show the loading progress bar asset we loaded in boot.js
  scene.preloadBar = scene.add.sprite(
    scene.game.width / 2 - 100,
    scene.game.height / 2,
    "preloaderBar"
  );
  scene.preloadBar.cropEnabled = false;

  scene.add.text(
    scene.game.width / 2,
    scene.game.height / 2 - 30,
    "Loading...",
    {
      font: "32px monospace",
      fill: "#fff",
    }
  ); // .anchor.setTo(0.5, 0.5); // comes by default with P3

  //  Here we load the rest of the assets our game needs.
  scene.load.image("titlepage", "assets/titlepage.png");
  scene.load.image("sea", "assets/sea.png");
  scene.load.image("bullet", "assets/bullet.png");
  scene.load.image("enemyBullet", "assets/enemy-bullet.png");
  scene.load.image("powerup1", "assets/powerup1.png");
  // {frameWidth: 32,frameHeight: 32} is the main difference with P3
  scene.load.spritesheet("greenEnemy", "assets/enemy.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("whiteEnemy", "assets/shooting-enemy.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("boss", "assets/boss.png", {
    frameWidth: 93,
    frameHeight: 75,
  });
  scene.load.spritesheet("explosion", "assets/explosion.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  scene.load.spritesheet("player", "assets/player.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  scene.load.audio("explosion", [
    "assets/explosion.ogg",
    "assets/explosion.wav",
  ]);
  scene.load.audio("playerExplosion", [
    "assets/player-explosion.ogg",
    "assets/player-explosion.wav",
  ]);
  scene.load.audio("enemyFire", [
    "assets/enemy-fire.ogg",
    "assets/enemy-fire.wav",
  ]);
  scene.load.audio("playerFire", [
    "assets/player-fire.ogg",
    "assets/player-fire.wav",
  ]);
  scene.load.audio("powerUp", ["assets/powerup.ogg", "assets/powerup.wav"]);
  //scene.load.audio('titleMusic', ['audio/main_menu.mp3']);
  //  + lots of other required assets here
}

/*
  create() {
    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    scene.preloadBar.cropEnabled = false;
  }

  update() {
    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.

    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.

    //if (scene.cache.isSoundDecoded('titleMusic') && scene.ready == false)
    //{
    //  scene.ready = true;

    scene.state.start("MainMenu");
    //scene.state.start("Game");

    //}
  }
}
*/
