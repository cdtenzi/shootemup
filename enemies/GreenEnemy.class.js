import { GlobalConstants } from "../util/GlobalConstants.js";
import { addToScore } from "../gameUI/textSetup.js";

export default class GreenEnemy extends Phaser.Physics.Arcade.Sprite {
  reward;
  dropRate;
  health;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);
    this.health = GlobalConstants.ENEMY_HEALTH;
    this.reward = GlobalConstants.ENEMY_REWARD;
    this.dropRate = GlobalConstants.ENEMY_DROP_RATE;
    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("greenEnemy", {
        start: 0,
        end: 2,
      }),
      frameRate: 30,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: scene.anims.generateFrameNumbers("greenEnemy", {
        frames: [3, 1, 3, 2],
      }),
      frameRate: 20,
      repeat: 1,
    });

    //this is different in P3
    //this.checkWorldBounds = true;
    //this.outOfBoundsKill = true;

    //event listener to restart fly anim after hit (or any other anim)
    this.on("animationcomplete", () => {
      this.play("fly");
    });
    //start anim
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
    this.health = GlobalConstants.ENEMY_HEALTH;
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
