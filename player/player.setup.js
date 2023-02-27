import { GlobalConstants } from "../util/GlobalConstants.js";

export function setupPlayer(scene) {
  scene.player = scene.add.sprite(
    scene.game.width / 2,
    scene.game.height - 50,
    "player"
  );
  scene.player.anchor.setTo(0.5, 0.5);
  scene.player.animations.add("fly", [0, 1, 2], 20, true);
  scene.player.animations.add("ghost", [3, 0, 3, 1], 20, true);
  scene.player.play("fly");
  scene.physics.enable(scene.player, Phaser.Physics.ARCADE);
  scene.player.speed = scene.player.speed = GlobalConstants.PLAYER_SPEED;
  scene.player.body.collideWorldBounds = true;
  // 20 x 20 pixel hitbox, centered a little bit higher than the center
  scene.player.body.setSize(20, 20, 0, -5);
  scene.weaponLevel = 0;
}

export function setupPlayerIcons(scene) {
  scene.powerUpPool = scene.add.group();
  scene.powerUpPool.enableBody = true;
  scene.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.powerUpPool.createMultiple(5, "powerup1");
  scene.powerUpPool.setAll("anchor.x", 0.5);
  scene.powerUpPool.setAll("anchor.y", 0.5);
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

  scene.lives = scene.add.group();
  // calculate location of first life icon
  var firstLifeIconX =
    scene.game.width - 10 - GlobalConstants.PLAYER_EXTRA_LIVES * 30;
  for (var i = 0; i < GlobalConstants.PLAYER_EXTRA_LIVES; i++) {
    var life = scene.lives.create(firstLifeIconX + 30 * i, 30, "player");
    life.scale.setTo(0.5, 0.5);
    life.anchor.setTo(0.5, 0.5);
  }
}

export function setupPlayerBullets(scene) {
  // Add an empty sprite group into our game
  scene.bulletPool = scene.add.group();
  // Enable physics to the whole sprite group
  scene.bulletPool.enableBody = true;
  scene.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
  // Add 100 'bullet' sprites in the group.
  // By default this uses the first frame of the sprite sheet and
  //   sets the initial state as non-existing (i.e. killed/dead)
  scene.bulletPool.createMultiple(100, "bullet");
  // Sets anchors of all sprites
  scene.bulletPool.setAll("anchor.x", 0.5);
  scene.bulletPool.setAll("anchor.y", 0.5);

  // Automatically kill the bullet sprites when they go out of bounds
  scene.bulletPool.setAll("outOfBoundsKill", true);
  scene.bulletPool.setAll("checkWorldBounds", true);

  scene.nextShotAt = 0;
  scene.shotDelay = GlobalConstants.SHOT_DELAY;
}
