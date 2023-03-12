export class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.anims.create({
      key: "boom",
      frames: scene.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true,
    });
    //enabling physics
    scene.physics.world.enableBody(this);

    this.on("animationcomplete", () => {
      this.disableBody(true, true);
    });
  }
}

export function setupExplosions(scene) {
  scene.explosionPool = scene.physics.add.group();
  scene.explosionPool.createMultiple({
    key: "greenEnemy",
    classType: Explosion,
    quantity: 100,
    active: false,
  });
  /*
  scene.explosionPool.enasbleBody = true;
  scene.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.explosionPool.createMultiple(100, "explosion");
  scene.explosionPool.setAll("anchor.x", 0.5);
  scene.explosionPool.setAll("anchor.y", 0.5);
  scene.explosionPool.forEach(function (explosion) {
    explosion.animations.add("boom");
  });
  */
}
