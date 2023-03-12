import { GlobalConstants } from "../../util/GlobalConstants.js";

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  reward;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.reward = GlobalConstants.POWERUP_REWARD;
    //enabling physics
    scene.physics.world.enableBody(this);
  }
}
