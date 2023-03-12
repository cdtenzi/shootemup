import { GlobalConstants } from "../util/GlobalConstants.js";
import { Player } from "./Player.class.js";
import { PowerUp } from "./powerups/PowerUp1.class.js";
import PlayerBullet from "../effects/PlayerBullet.class.js";

export function setupPlayer(scene) {
  var avatar = new Player(
    scene,
    scene.scale.width / 2,
    scene.scale.height - 50,
    "player"
  );
  scene.player = scene.add.existing(avatar);

  //scene.player.play("fly");
  /*
  scene.player.on("animationcomplete", (e) => {
    e.play("fly");
  });
  */
  //scene.physics.world.add(scene.player);
  //scene.player.enableBody(true, true);
  //scene.player.play("fly");
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

  //scene.player.speed = GlobalConstants.PLAYER_SPEED;
  //scene.player.setCollideWorldBounds(true);
}

export function setupPlayerIcons(scene) {
  // creating the powerUps
  scene.powerUpPool = scene.physics.add.group();
  scene.powerUpPool.createMultiple({
    key: "powerup1",
    classType: PowerUp,
    quantity: 5,
    active: false,
  });
  scene.powerUpPool.children.each((child) => {
    child.reward = GlobalConstants.POWERUP_REWARD;
  });

  /* all body and Physics moved to PowerUp class
  scene.powerUpPool.enableBody = true;
  scene.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
  scene.powerUpPool.createMultiple({ quantity: 5, key: "powerup1" });
  //scene.powerUpPool.setAll("anchor.x", 0.5); // P3 has this by default
  //scene.powerUpPool.setAll("anchor.y", 0.5); // P3 has this by default
  //scene.powerUpPool.setAll("outOfBoundsKill", true);
  //scene.powerUpPool.setAll("checkWorldBounds", true);
    scene.powerUpPool.setAll(
    "reward",
    GlobalConstants.POWERUP_REWARD,
    false,
    false,
    0,
    true
  );*/
  // Creating extra lives
  scene.lives = scene.add.group();
  // calculate location of first life icon
  var firstLifeIconX =
    scene.scale.width - 10 - GlobalConstants.PLAYER_EXTRA_LIVES * 30;
  for (var i = 0; i < GlobalConstants.PLAYER_EXTRA_LIVES; i++) {
    // We dynamically create 1 icon for each life we have left:
    var life = scene.lives.create(firstLifeIconX + 30 * i, 30, "player");
    life.setScale(0.5); // .scale.setTo(0.5, 0.5);
    //life.anchor.setTo(0.5, 0.5); // P3 has this by default
  }
}

export function setupPlayerBullets(scene) {
  // we declared a PlayerBullet class for this inside the effects folder
  scene.bulletPool = scene.physics.add.group();
  scene.bulletPool.createMultiple({
    key: "bullet",
    classType: PlayerBullet,
    quantity: 200,
    active: false,
    visible: false,
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
  // we've done these in the scene constructor:
  scene.nextShotAt = 0;
  scene.shotDelay = GlobalConstants.SHOT_DELAY;
  */
}
