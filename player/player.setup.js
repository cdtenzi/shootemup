import { GlobalConstants } from "../util/GlobalConstants.js";

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.on("animationcomplete", (e) => {
      e.play("fly");
    });

    // 20 x 20 pixel hitbox, is setup differently in P3 (no body)
    this.setSize(20, 20, 0, -5); //scene.player.body.setSize(20, 20, 0, -5);
  }
}

export function setupPlayer(scene) {
  scene.player = scene.physics.add.sprite(
    new Player(scene, scene.game.width / 2, scene.game.height - 50, "player")
  );
  /*
  scene.player = scene.add.sprite(
    scene.game.width / 2,
    scene.game.height - 50,
    "player"
  );
  
  //scene.player.anchor.setTo(0.5, 0.5); // P3 has this by default

  // ANIMATIONS: We do this differently in P3:
  //scene.player.animations.add("fly", [0, 1, 2], 20, true);
  //scene.player.animations.add("ghost", [3, 0, 3, 1], 20, true);

  // we create a "fly" animation using the "player" spriteSheet we preloaded in the Preloader class
  scene.player.anims.create({
    key: "fly",
    frames: scene.anims.generateFrameNumbers("player", {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: -1,
  });
  scene.player.play("fly");
  */
  // enabling physics is different in Phaser3, we add the object to the scene physics:
  // scene.physics.enable(scene.player, Phaser.Physics.ARCADE);

  scene.player.speed = GlobalConstants.PLAYER_SPEED;
  //scene.player.setCollideWorldBounds(true);

  scene.weaponLevel = 0;
}

export class PowerUp extends Phaser.GameObjects.Sprite {
  reward;

  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.reward = GlobalConstants.POWERUP_REWARD;

    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
  }
}

export function setupPlayerIcons(scene) {
  scene.powerUpPool = scene.physics.add.group();
  scene.powerUpPool.createMultiple({
    key: "powerup1",
    classType: PowerUp,
    quantity: 100,
  });
  /*
  scene.powerUpPool.enableBody = true;
  scene.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.powerUpPool.createMultiple(5, "powerup1");
  //scene.powerUpPool.setAll("anchor.x", 0.5); // P3 has this by default
  //scene.powerUpPool.setAll("anchor.y", 0.5); // P3 has this by default
  scene.powerUpPool.setAll("outOfBoundsKill", true);
  scene.powerUpPool.setAll("checkWorldBounds", true);
  scene.powerUpPool.setAll(
    "reward",
    GlobalConstants.POWERUP_REWARD,
    false,
    false,
    0,
    true
  );
  */
  scene.lives = scene.add.group();
  // calculate location of first life icon
  var firstLifeIconX =
    scene.game.width - 10 - GlobalConstants.PLAYER_EXTRA_LIVES * 30;
  for (var i = 0; i < GlobalConstants.PLAYER_EXTRA_LIVES; i++) {
    var life = scene.lives.create(firstLifeIconX + 30 * i, 30, "player");
    life.setScale(0.5); // .scale.setTo(0.5, 0.5);
    //life.anchor.setTo(0.5, 0.5); // P3 has this by default
  }
}

export class PlayerBullet extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, assetName) {
    super(scene, x, y, assetName);

    this.reward = GlobalConstants.ENEMY_REWARD;
    this.dropRate = GlobalConstants.ENEMY_DROP_RATE;
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
  }
}

export function setupPlayerBullets(scene) {
  // Add an empty sprite group into our game
  scene.bulletPool = scene.physics.add.group();
  scene.bulletPool.createMultiple({
    key: "bullet",
    classType: PlayerBullet,
    quantity: 100,
  });

  /*
  // Enable physics to the whole sprite group
  scene.bulletPool.enableBody = true;
  scene.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
  // Add 100 'bullet' sprites in the group.
  // By default this uses the first frame of the sprite sheet and
  //   sets the initial state as non-existing (i.e. killed/dead)
  scene.bulletPool.createMultiple(100, "bullet");
  // Sets anchors of all sprites
  //scene.bulletPool.setAll("anchor.x", 0.5);
  //scene.bulletPool.setAll("anchor.y", 0.5);

  // Automatically kill the bullet sprites when they go out of bounds
  scene.bulletPool.setAll("outOfBoundsKill", true);
  scene.bulletPool.setAll("checkWorldBounds", true);
  */
  scene.nextShotAt = 0;
  scene.shotDelay = GlobalConstants.SHOT_DELAY;
}
