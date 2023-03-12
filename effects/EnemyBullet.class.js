export default class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    let x = scene.player.x;
    let y = scene.player.y;
    super(scene, x, y, "enemyBullet");

    //enable physics:
    scene.physics.world.enableBody(this);
    this.tint = 0xff0000; //red
  }

  update() {
    // we reset out of bounds enemies
    if (this.y > this.scene.scale.height + 32 || this.y < -32)
      this.disableBody(true, true);
  }
}
