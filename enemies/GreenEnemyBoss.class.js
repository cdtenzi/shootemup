import { GlobalConstants } from "../util/GlobalConstants.js";
import { addToScore } from "../gameUI/textSetup.js";

export default class GreenEnemyBoss extends Phaser.Physics.Arcade.Sprite {
  reward;
  dropRate;
  health;
  nextShotAt;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.health = GlobalConstants.BOSS_HEALTH;
    this.reward = GlobalConstants.BOSS_REWARD;
    this.dropRate = GlobalConstants.BOSS_DROP_RATE;
    this.nextShotAt = GlobalConstants.BOSS_SHOT_DELAY;

    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("boss", {
        start: 0,
        end: 2,
      }),
      frameRate: 30,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: scene.anims.generateFrameNumbers("boss", {
        frames: [3, 1, 3, 2],
      }),
      frameRate: 20,
      repeat: 1,
    });

    this.on("animationcomplete", () => {
      this.play("fly");
    });

    this.play("fly");
    //enabling physics
    scene.physics.world.enableBody(this);
  }

  update() {
    // we reset out of bounds enemies
    if (this.y > this.scene.scale.height + 32 || this.y < -32)
      this.disableBody(true, true);
  }

  explodeAndDie() {
    console.log("boss is dead!!");
    this.scene.explode(this);
    this.scene.explosionSFX.play();
    addToScore(this.scene, this.reward);
    this.y = -32;
    this.health = GlobalConstants.BOSS_HEALTH;
    this.disableBody(true, true);
    this.scene.displayEnd(true);
  }

  damage(hitPoints) {
    //receive damage only if it's in fighting position
    if (this.scene.bossApproaching == false) {
      this.health -= hitPoints;
      this.play("hit");
      if (this.health <= 0) {
        this.explodeAndDie();
      }
    }
  }
}
