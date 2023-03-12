import { GlobalConstants } from "../util/GlobalConstants.js";
import { addToScore } from "../gameUI/textSetup.js";

export default class WhiteEnemy extends Phaser.Physics.Arcade.Sprite {
  reward;
  dropRate;
  health;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);
    this.health = GlobalConstants.SHOOTER_HEALTH;
    this.reward = GlobalConstants.SHOOTER_REWARD;
    this.dropRate = GlobalConstants.SHOOTER_DROP_RATE;
    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("whiteEnemy", {
        start: 0,
        end: 2,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: scene.anims.generateFrameNumbers("whiteEnemy", {
        frames: [3, 1, 3, 2],
      }),
      frameRate: 20,
      repeat: 1,
    });
    // we set up an event listener to restart the default anim after hit.
    this.on("animationcomplete", () => {
      this.play("fly");
    });
    // start flying
    this.play("fly");
    //enabling physics
    scene.physics.world.enableBody(this);

    this.setBodySize(20, 20);
  }

  update() {
    // we reset out of bounds enemies
    if (this.y > this.scene.scale.height + 32 || this.y < -32)
      this.disableBody(true, true);
  }

  explodeAndDie() {
    this.scene.explode(this);
    this.scene.explosionSFX.play();
    this.scene.spawnPowerUp(this);
    addToScore(this.scene, this.reward);
    this.y = -32;
    this.health = GlobalConstants.SHOOTER_HEALTH;
    this.disableBody(true, true);
  }

  damage(hitPoints) {
    this.health -= hitPoints;
    this.play("hit");
    if (this.health <= 0) {
      this.explodeAndDie();
    }
  }
}
