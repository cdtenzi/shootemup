export default class Boot extends Phaser.Scene {
  // we create a constructor for the scene, giving its parent with the "Boot" key name
  constructor(keyName) {
    console.log(keyName);
    if (!keyName || keyName == "" || keyName === undefined)
      throw console.error("a Scene key (string) is required");
    super(keyName);
  }

  init() {
    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here
      console.log("running on desktop?");
    } else {
      console.log("not running on desktop?");
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.Scale.NONE; //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      //this.scale.setMinMax(480, 260, 1024, 768);
      //this.scale.forceLandscape = true;
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  preload() {
    //  Here we load the assets required for our preloader (in this case a loading bar)
    this.load.image("preloaderBar", "assets/preloader-bar.png");
  }

  create() {
    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.add.text(
      this.scale.width / 2 - 60,
      this.scale.height / 2,
      "Loading..."
    );
    this.add.sprite(
      this.scale.width / 2 - 15,
      this.scale.height / 2 + 40,
      "preloaderBar"
    );
    // we start the mainMenu scene in P3 way:
    this.scene.start("MainMenu");
  }
}
