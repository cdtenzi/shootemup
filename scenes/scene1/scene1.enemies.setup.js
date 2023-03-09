import { GlobalConstants } from "../../util/GlobalConstants.js";

export class GreenEnemy extends Phaser.GameObjects.Sprite {
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
      frames: scene.anims.generateFrameNumbers("greenEnemy", [3, 1, 3, 2]),
      frameRate: 20,
      repeat: -1,
    });
    //this is different in P3
    //this.checkWorldBounds = true;
    //this.outOfBoundsKill = true;
    this.on("animationcomplete", (e) => {
      e.play("fly");
    });
    //start anim
    this.play("fly");
    //enabling physics
    scene.physics.world.enableBody(this);
  }

  update() {
    // we disable out of bounds enemies
    if (this.y > this.scene.scale.height || this.y < -32) this.disableSelf();
    if (this.x > this.scene.scale.width || this.x < 0) this.disableSelf();
  }

  disableSelf() {
    this.visible = false;
    this.setActive(false);
  }

  enableSelf() {
    this.visible = true;
    this.setActive(true);
  }
}

export class WhiteEnemy extends Phaser.GameObjects.Sprite {
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
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: scene.anims.generateFrameNumbers("whiteEnemy", [3, 1, 3, 2]),
      frameRate: 10,
      repeat: -1,
    });
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.on("animationcomplete", (e) => {
      e.play("fly");
    });
    //enabling physics
    scene.physics.world.enableBody(this);
  }
}

export class GreenEnemyBoss extends Phaser.GameObjects.Sprite {
  reward;
  dropRate;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.reward = GlobalConstants.BOSS_REWARD;
    this.dropRate = GlobalConstants.BOSS_DROP_RATE;
    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("boss", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: scene.anims.generateFrameNumbers("boss", [3, 1, 3, 2]),
      frameRate: 10,
      repeat: -1,
    });
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.on("animationcomplete", (e) => {
      e.play("fly");
    });
    //enabling physics
    scene.physics.world.enableBody(this);
  }
}

export function setupEnemies(scene) {
  scene.enemyPool = scene.physics.add.group();
  scene.enemyPool.createMultiple({
    key: "greenEnemy",
    classType: GreenEnemy,
    quantity: 50,
    active: false,
    setXY: { x: 0, y: -32 },
  });

  /*
  scene.enemyPool.children.iterate((child) => {
    console.log(child);
    //child.enableBody(true, child.x, 0, true, true);
  });
  scene.shooterPool = scene.physics.add.group();
  scene.shooterPool.createMultiple({
    key: "whiteEnemy",
    classType: WhiteEnemy,
    quantity: 50,
  });

  scene.bossPool = scene.physics.add.group();
  scene.bossPool.createMultiple({
    key: "boss",
    classType: GreenEnemyBoss,
    quantity: 50,
  });
  */
  /*
  //Green enemies:
  scene.enemyPool = scene.add.group();
  scene.enemyPool.enableBody = true;
  scene.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.enemyPool.createMultiple(50, "greenEnemy");
  // no need for these in P3:
  //  scene.enemyPool.setAll("anchor.x", 0.5);
  //  scene.enemyPool.setAll("anchor.y", 0.5);
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
    enemy.animations.add("fly2", [0, 1, 2], 20, true);
    enemy.animations.add("hit2", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly2");
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
    enemy.animations.add("fly3", [0, 1, 2], 20, true);
    enemy.animations.add("hit3", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly3");
    }, scene);
  });
  */
  // start spawning 5 seconds into the game
  scene.nextShooterAt = scene.time.now + 5000; // Phaser.Timer.SECOND * 5;
  scene.shooterDelay = GlobalConstants.SPAWN_SHOOTER_DELAY;
  /*
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
    enemy.animations.add("fly4", [0, 1, 2], 20, true);
    enemy.animations.add("hit4", [3, 1, 3, 2], 20, false);
    enemy.events.onAnimationComplete.add(function (e) {
      e.play("fly4");
    }, scene);
  });
  */
  //scene.boss = scene.bossPool.getFirstAlive(); // .getTop();
  //scene.bossApproaching = false;
}

export class EnemyBullet extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.reward = 0;
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
  }
}

export function setupEnemyBullets(scene) {
  scene.enemyBulletPool = scene.physics.add.group();
  scene.bulletPool.createMultiple({
    key: "enemyBullet",
    classType: EnemyBullet,
    quantity: 100,
  });
  /*
  scene.enemyBulletPool.enableBody = true;
  scene.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.enemyBulletPool.createMultiple(100, "enemyBullet");
  scene.enemyBulletPool.setAll("anchor.x", 0.5);
  scene.enemyBulletPool.setAll("anchor.y", 0.5);
  scene.enemyBulletPool.setAll("outOfBoundsKill", true);
  scene.enemyBulletPool.setAll("checkWorldBounds", true);
  scene.enemyBulletPool.setAll("reward", 0, false, false, 0, true);
  */
}
