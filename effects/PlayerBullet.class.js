export default class PlayerBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    let x = scene.player.x;
    let y = scene.player.y;
    super(scene, x, y, "bullet");

    //enable physics:
    scene.physics.world.enableBody(this);
  }

  update() {
    // we reset out of bounds enemies
    if (this.y > this.scene.scale.height + 32 || this.y < -32)
      this.disableBody(true, true);
  }
}
