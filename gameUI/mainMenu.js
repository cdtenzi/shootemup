export default class MainMenu {
  music = null;
  playButton = null;

  constructor() {
    this.music = null;
    this.playButton = null;
  }

  create() {
    this.add.sprite(0, 0, "titlepage");

    this.loadingText = this.add.text(
      this.game.width / 2,
      this.game.height / 2 + 80,
      "Press Z or tap/click game to start",
      { font: "20px monospace", fill: "#fff" }
    );
    this.loadingText.anchor.setTo(0.5, 0.5);
    this.add
      .text(
        this.game.width / 2,
        this.game.height - 90,
        "image assets Copyright (c) 2002 Ari Feldman",
        { font: "12px monospace", fill: "#fff", align: "center" }
      )
      .anchor.setTo(0.5, 0.5);
    this.add
      .text(
        this.game.width / 2,
        this.game.height - 75,
        "sound assets Copyright (c) 2012 - 2013 Devin Watson",
        { font: "12px monospace", fill: "#fff", align: "center" }
      )
      .anchor.setTo(0.5, 0.5);
  }

  update() {
    if (
      this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      this.input.activePointer.isDown
    ) {
      this.startGame();
    }
  }

  startGame(pointer) {
    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start("Game");
  }
}
