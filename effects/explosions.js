export function setupExplosions(scene) {
  scene.explosionPool = scene.add.group();
  scene.explosionPool.enableBody = true;
  scene.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.explosionPool.createMultiple(100, "explosion");
  scene.explosionPool.setAll("anchor.x", 0.5);
  scene.explosionPool.setAll("anchor.y", 0.5);
  scene.explosionPool.forEach(function (explosion) {
    explosion.animations.add("boom");
  });
}
