export default class MainMenu extends Phaser.Scene {
  music;
  playButton;
  zKey;

  constructor(keyName) {
    if (!keyName || keyName == "" || keyName === undefined)
      throw console.error(
        "MainMenu: this Scene constructor needs a key name [string]."
      );
    super(keyName);
    this.music = null;
    this.playButton = null;
    this.zKey = null;
  }

  preload() {
    this.load.image("titlepage", "/assets/titlepage.png");
  }

  create() {
    console.log("loading main menu...");
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "titlepage")
      .setScale(Phaser.Scale.WIDTH_CONTROLS_HEIGHT);

    this.loadingText = this.add.text(
      this.scale.width / 2 - 200,
      this.scale.height / 2 + 80,
      "Press Z or tap/click game to start",
      { font: "20px monospace", fill: "#fff" }
    );
    this.add.text(
      this.scale.width / 2 - 160,
      this.scale.height - 90,
      "image assets Copyright (c) 2002 Ari Feldman",
      { font: "12px monospace", fill: "#fff", align: "center" }
    );
    this.add.text(
      this.scale.width / 2 - 190,
      this.scale.height - 75,
      "sound assets Copyright (c) 2012 - 2013 Devin Watson",
      { font: "12px monospace", fill: "#fff", align: "center" }
    );

    this.zKey = this.input.keyboard.addKey("Z");
    console.log(this.zKey);
  }

  update() {
    if (
      // this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      this.zKey.isDown ||
      this.input.activePointer.isDown
    ) {
      this.startGame();
    }
  }

  startGame(pointer) {
    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game in P3 way
    console.log("starting the game...");
    this.scene.start("Game");
  }
}
