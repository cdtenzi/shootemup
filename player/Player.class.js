import { GlobalConstants } from "../util/GlobalConstants.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  weaponLevel;
  ghostUntil;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);
    this.scene = scene;
    this.ghostUntil = 0;

    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 30,
      repeat: -1,
    });

    this.anims.create({
      key: "ghost",
      frames: scene.anims.generateFrameNumbers("player", {
        frames: [3, 0, 3, 1],
      }),
      frameRate: 20,
      repeat: 12,
    });

    this.weaponLevel = 0;
    this.speed = GlobalConstants.PLAYER_SPEED;

    // we set up an event listener to restart the default anim after hit.
    this.on("animationcomplete", () => {
      this.play("fly");
    });

    //start flying!
    this.play("fly");

    //enabling physics
    scene.physics.world.enableBody(this);
    // 20 x 20 pixel hitbox, is setup differently in P3 (no body)
    this.setBodySize(40, 40); //scene.player.body.setSize(20, 20, 0, -5);
  }
}
