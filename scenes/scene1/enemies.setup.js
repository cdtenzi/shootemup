import { GlobalConstants } from "../../util/GlobalConstants.js";

export function setupEnemies(scene) {
  //Green enemies:
  scene.enemyPool = scene.add.group();
  scene.enemyPool.enableBody = true;
  scene.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.enemyPool.createMultiple(50, "greenEnemy");
  scene.enemyPool.setAll("anchor.x", 0.5);
  scene.enemyPool.setAll("anchor.y", 0.5);
  scene.enemyPool.setAll("outOfBoundsKill", true);
  scene.enemyPool.setAll("checkWorldBounds", true);
  scene.enemyPool.setAll(
    "reward",
    GlobalConstants.ENEMY_REWARD,
    false,
    false,
    0,
    true
  );
  scene.enemyPool.setAll(
    "dropRate",
    GlobalConstants.ENEMY_DROP_RATE,
    false,
    false,
    0,
    true
  );
  // Set the animation for each sprite
  scene.enemyPool.forEach(function (enemy) {
    enemy.animations.add("fly", [0, 1, 2], 20, true);
    enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly");
    }, scene);
  });
  scene.nextEnemyAt = 0;
  scene.enemyDelay = GlobalConstants.SPAWN_ENEMY_DELAY;

  // Harder white enemies
  scene.shooterPool = scene.add.group();
  scene.shooterPool.enableBody = true;
  scene.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.shooterPool.createMultiple(20, "whiteEnemy");
  scene.shooterPool.setAll("anchor.x", 0.5);
  scene.shooterPool.setAll("anchor.y", 0.5);
  scene.shooterPool.setAll("outOfBoundsKill", true);
  scene.shooterPool.setAll("checkWorldBounds", true);
  scene.shooterPool.setAll(
    "reward",
    GlobalConstants.SHOOTER_REWARD,
    false,
    false,
    0,
    true
  );
  scene.shooterPool.setAll(
    "dropRate",
    GlobalConstants.SHOOTER_DROP_RATE,
    false,
    false,
    0,
    true
  );
  // Set the animation for each sprite
  scene.shooterPool.forEach(function (enemy) {
    enemy.animations.add("fly", [0, 1, 2], 20, true);
    enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly");
    }, scene);
  });
  // start spawning 5 seconds into the game
  scene.nextShooterAt = scene.time.now + Phaser.Timer.SECOND * 5;
  scene.shooterDelay = GlobalConstants.SPAWN_SHOOTER_DELAY;

  // Boss setup
  scene.bossPool = scene.add.group();
  scene.bossPool.enableBody = true;
  scene.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.bossPool.createMultiple(1, "boss");
  scene.bossPool.setAll("anchor.x", 0.5);
  scene.bossPool.setAll("anchor.y", 0.5);
  scene.bossPool.setAll("outOfBoundsKill", true);
  scene.bossPool.setAll("checkWorldBounds", true);
  scene.bossPool.setAll(
    "reward",
    GlobalConstants.BOSS_REWARD,
    false,
    false,
    0,
    true
  );
  scene.bossPool.setAll(
    "dropRate",
    GlobalConstants.BOSS_DROP_RATE,
    false,
    false,
    0,
    true
  );
  // Set the animation for each sprite
  scene.bossPool.forEach(function (enemy) {
    enemy.animations.add("fly", [0, 1, 2], 20, true);
    enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly");
    }, scene);
  });
  scene.boss = scene.bossPool.getTop();
  scene.bossApproaching = false;
}

export function setupEnemyBullets(scene) {
  scene.enemyBulletPool = scene.add.group();
  scene.enemyBulletPool.enableBody = true;
  scene.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.enemyBulletPool.createMultiple(100, "enemyBullet");
  scene.enemyBulletPool.setAll("anchor.x", 0.5);
  scene.enemyBulletPool.setAll("anchor.y", 0.5);
  scene.enemyBulletPool.setAll("outOfBoundsKill", true);
  scene.enemyBulletPool.setAll("checkWorldBounds", true);
  scene.enemyBulletPool.setAll("reward", 0, false, false, 0, true);
}
