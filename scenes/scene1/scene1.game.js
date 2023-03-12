import { GlobalConstants } from "../../util/GlobalConstants.js";
import { setupBackground, setupAudio } from "./scene1.setup.js";
import { setupEnemies, setupEnemyBullets } from "./scene1.enemies.setup.js";
import {
  setupPlayer,
  setupPlayerIcons,
  setupPlayerBullets,
} from "../../player/player.setup.js";
import { setupText, addToScore } from "../../gameUI/textSetup.js";
import { setupExplosions } from "../../effects/explosions.js";
import { loadSprites } from "./scene1.preloader.js";
import { getRandomInt } from "../../util/utils.js";

// We inherit from Phaser.Scene, converting all our old "States" into Scenes
export default class Game extends Phaser.Scene {
  background;
  preloadBar;
  returnText;
  showReturn;
  player;
  bulletPool;
  enemyBulletPool;
  enemyPool;
  enemyDelay;
  nextEnemyAt;
  shooterPool;
  shooterDelay;
  nextShooterAt;
  bossPool;
  boss;
  nextShotAt;
  shotDelay;
  powerUpPool;
  explosionPool;
  lives;
  endText;
  instExpire;
  score;
  scoreText;
  instructions;
  bossApproaching;
  zKey;
  gameOver;

  constructor() {
    super("Game");
    this.bulletPool = null;
    this.enemyBulletPool = null;
    this.background = null;
    this.showReturn = false;
    this.preloadBar = null;
    this.enemyPool = null;
    this.enemyDelay = GlobalConstants.SPAWN_ENEMY_DELAY;
    this.shooterPool = null;
    this.bossPool = null;
    this.nextEnemyAt = Date.now();
    this.nextShooterAt = Date.now() + 5000;
    this.nextShotAt = 0;
    this.shooterDelay = GlobalConstants.SPAWN_SHOOTER_DELAY;
    this.shotDelay = GlobalConstants.SHOT_DELAY;
    this.boss = null;
    this.powerUpPool = null;
    this.explosionPool = null;
    this.lives = GlobalConstants.PLAYER_EXTRA_LIVES;
    this.endText = null;
    this.instExpire = GlobalConstants.INSTRUCTION_EXPIRE;
    this.score = null;
    this.scoreText = null;
    this.instructions = null;
    this.bossApproaching = true;
    this.zKey = null;
    this.gameOver = false;
  }

  preload() {
    loadSprites(this);
  }

  create() {
    setupBackground(this);
    setupPlayer(this);
    setupEnemies(this);
    setupPlayerIcons(this);
    setupPlayerBullets(this);
    setupEnemyBullets(this);
    setupExplosions(this);
    setupText(this);
    setupAudio(this);
    // we dont need colliders
    //this.setUpCollisions();
    this.setUpOverlappings();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  }

  update() {
    this.processPlayerInput();
    // we keep running things until the game is over:
    if (!this.gameOver) {
      // we make the background automatically scroll down
      this.background.tilePositionY -= 0.05;

      this.spawnEnemies();
      this.enemyFire();
      this.spawnBoss();

      //trigger enemies update
      if (this.enemyPool.children)
        this.enemyPool.children.each((child) => child.update());
      if (this.shooterPool.children)
        this.shooterPool.children.each((child) => child.update());
      if (this.bulletPool.children)
        this.bulletPool.children.each((child) => child.update());
      if (this.enemyBulletPool.children)
        this.enemyBulletPool.children.each((child) => child.update());
    }
    this.processDelayedEffects();
  }

  fire() {
    // chequeamos el ratio de disparo y si pasaron más de los milisegundos
    // esperados para emitir la siguiente bala, si no, cortamos la ejecución
    if (this.nextShotAt > Date.now() || !this.player.active) {
      return;
    }
    this.nextShotAt = Date.now() + this.shotDelay;
    this.playerFireSFX.play();

    var bullet;
    if (this.player.weaponLevel === 0) {
      // reset dead bullets
      bullet = this.bulletPool.getFirstDead(false, 0, 0, null, null, true);
      if (bullet) {
        bullet.enableBody(true, this.player.x, this.player.y, true, true);
        bullet.body.velocity.y = -GlobalConstants.BULLET_VELOCITY;
      }
    } else {
      //if (this.bulletPool.countActive() > this.player.weaponLevel * 2) {
      // we create a bullet for each powerUp collected
      for (var i = 0; i < this.player.weaponLevel; i++) {
        //for (var i = 0; i < 2; i++) {
        bullet = this.bulletPool.getFirstDead(false, 0, 0, null, null, true);
        // spawn left bullet slightly left off center
        bullet.enableBody(
          true,
          this.player.x - (10 + i * 6),
          this.player.y - 20,
          true,
          true
        );
        // the left bullets spread from -95 degrees to -135 degrees
        //this.physics.arcade.velocityFromAngle(
        this.physics.velocityFromRotation(
          // I modified the math to use radians and reduce bullet spreadings
          Math.PI / -2 - i / 20, // -95 - i * 10,
          GlobalConstants.BULLET_VELOCITY,
          bullet.body.velocity
        );

        bullet = this.bulletPool.getFirstDead(false, 0, 0, null, null, true);
        // spawn right bullet slightly right off center
        bullet.enableBody(
          true,
          this.player.x + (10 + i * 6),
          this.player.y - 20,
          true,
          true
        );
        // the right bullets spread from -85 degrees to -45
        //this.physics.arcade.velocityFromAngle(
        this.physics.velocityFromRotation(
          // I modified the math to use radians and reduce bullet spreading
          Math.PI / -2 + i / 20, // -85 + i * 10,
          GlobalConstants.BULLET_VELOCITY,
          bullet.body.velocity
        );
      }
      //}
    }
  }

  enemyFire() {
    this.shooterPool.children.each(function (enemy) {
      //return;
      if (enemy.active && Date.now() > this.shooterDelay) {
        if (Date.now() > this.shooterDelay) {
          var bullet = this.enemyBulletPool.getFirstDead(
            false,
            enemy.x,
            enemy.y,
            null,
            null,
            true
          );
          if (bullet) {
            bullet.enableBody(true, enemy.x, enemy.y, true, true);
            this.physics.moveToObject(
              bullet,
              this.player,
              GlobalConstants.ENEMY_BULLET_VELOCITY
            );
            this.shooterDelay = Date.now() + GlobalConstants.SHOOTER_SHOT_DELAY;
            this.enemyFireSFX.play();
          }
        }
      }
    }, this);

    // Disparos del Boss
    if (
      this.bossApproaching === false &&
      this.bossPool.countActive() > 0 &&
      this.boss.nextShotAt < Date.now() &&
      this.enemyBulletPool.countActive(false) >= 10
    ) {
      this.boss.nextShotAt = Date.now() + GlobalConstants.BOSS_SHOT_DELAY;
      for (var i = 0; i < 5; i++) {
        this.enemyFireSFX.play();
        // process 2 bullets at a time
        var leftBullet = this.enemyBulletPool.getFirstDead(false);
        //leftBullet.body.reset(this.boss.x - 10 - i * 10, this.boss.y + 20);
        leftBullet.enableBody(
          true,
          this.boss.x - 10 - i * 10,
          this.boss.y + 20,
          true,
          true
        );
        var rightBullet = this.enemyBulletPool.getFirstDead(false);
        //rightBullet.body.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);
        rightBullet.enableBody(
          true,
          this.boss.x + 10 + i * 10,
          this.boss.y + 20,
          true,
          true
        );
        //if (this.boss.health > GlobalConstants.BOSS_HEALTH / 2) {
        // aim directly at the player
        this.physics.moveToObject(
          leftBullet,
          this.player,
          GlobalConstants.ENEMY_BULLET_VELOCITY
        );
        this.physics.moveToObject(
          rightBullet,
          this.player,
          GlobalConstants.ENEMY_BULLET_VELOCITY
        );
        /*} else {
          this doesn't work like this in P3, so for the sake of this code migration
          I'll keep things simple and just comment this piece of code. 
          // aim slightly off center of the player
          this.physics.moveToObject(
            leftBullet,
            this.player.x - i * 10,
            this.player.y,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
          this.physics.moveToObject(
            rightBullet,
            this.player.x + i * 10,
            this.player.y,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
        }*/
      }
    }
  }

  // we changed this from checkCollisions()
  setUpOverlappings() {
    // we translate this to the P3 style, using the physics .overlap:
    //this.physics.arcade.overlap(

    // player overlapping enemies:
    this.physics.add.overlap(
      this.player,
      this.enemyPool,
      this.playerCrash,
      null,
      this
    );

    // bullets overlapping enemies
    this.physics.add.overlap(
      this.bulletPool,
      this.enemyPool,
      this.enemyHit,
      null,
      this
    );
    this.physics.add.overlap(
      this.bulletPool,
      this.shooterPool,
      this.enemyHit,
      null,
      this
    );

    //player crashing on shooters
    this.physics.add.overlap(
      this.player,
      this.shooterPool,
      this.playerCrash,
      null,
      this
    );

    // player vs enemy bullets
    this.physics.add.overlap(
      this.player,
      this.enemyBulletPool,
      this.playerHit,
      null,
      this
    );

    // player vs Power Up!
    this.physics.add.overlap(
      this.player,
      this.powerUpPool,
      this.playerPowerUp,
      null,
      this
    );

    // bullets vs Boss
    this.physics.add.overlap(
      this.bulletPool,
      this.bossPool,
      this.enemyHit,
      null,
      this
    );
    // crashing with the Boss
    this.physics.add.overlap(
      this.player,
      this.bossPool,
      this.playerCrash,
      null,
      this
    );
  }

  setUpCollisions() {
    //we don't want bullets to collide stuff, we want them to go through and kill
    //this.physics.add.collider(this.bulletPool, this.enemyPool);
    //this.physics.add.collider(this.bulletPool, this.shooterPool);
    /*
    We don't want enemies to collide neither we want to. We all just explode.
    this.physics.add.collider(this.player, this.enemyPool);
    // Jugador vs enemigos
    this.physics.add.collider(this.player, this.shooterPool);
    
    // jugador vs balas enemigas
    this.physics.add.collider(this.player, this.enemyBulletPool);

    // jugador vs Power Up!
    this.physics.add.collider(this.player, this.powerUpPool);
    //Boss: Solo colisiona una vez que esta en posición
    this.physics.add.collider(this.bulletPool, this.bossPool);
    */
  }

  //
  // update()- related functions
  //
  spawnEnemies() {
    if (this.nextEnemyAt < Date.now()) {
      //&& this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = Date.now() + this.enemyDelay;
      var enemy = this.enemyPool.getFirstDead(false, 0, 0, null, null, true);
      // spawn at a random location top of the screen
      if (enemy) {
        //enemy.setPosition(getRandomInt(20, this.scale.width - 20), 0);
        enemy.enableBody(
          true,
          getRandomInt(20, this.scale.width - 20),
          -32,
          true,
          true
        );
        enemy.health = GlobalConstants.ENEMY_HEALTH;
        // also randomize the speed
        enemy.body.velocity.y = getRandomInt(
          GlobalConstants.ENEMY_MIN_Y_VELOCITY,
          GlobalConstants.ENEMY_MAX_Y_VELOCITY
        );
        enemy.play("fly");
      }
    }

    // Spawning white enemies that move differently:
    // We try to keep 3 shooters at all times:
    //if (this.nextShooterAt < Date.now() && this.shooterPool.countActive() < 3) {
    //  this.nextShooterAt = Date.now() + this.shooterDelay;
    if (this.shooterPool.countActive() < 3) {
      var shooter = this.shooterPool.getFirstDead(
        false,
        this.scale.width / 2,
        -32,
        null,
        null,
        true
      );
      if (shooter) {
        // spawn at a random location at the top
        shooter.enableBody(
          true,
          getRandomInt(20, this.scale.width - 20),
          -32,
          true,
          true
        );
        /*
        shooter.health = GlobalConstants.SHOOTER_HEALTH;
   
        // we need to translate this to P3 way of doing things, see below:
        // choose a random target location at the bottom
        var targetX = getRandomInt(20, this.game.width - 20);
        // move to target and rotate the sprite accordingly
        shooter.rotation =
          this.physics.arcade.moveToXY(
            shooter,
            targetX,
            scene.scale.height,
            getRandomInt(
              GlobalConstants.SHOOTER_MIN_VELOCITY,
              GlobalConstants.SHOOTER_MAX_VELOCITY
            )
          ) -
          Math.PI / 2; //--> Esto es importante: Phser asume que los sprites tienen
        // orientación horizontal de izquierda a derecha. Pero en este caso, nuestros
        // sprites se orienta de arriba hacia abajo, lo cual implica que están "girados"
        // desde el punto de vista de Phaser en +(PI/2) radianes. Es por eso que a la
        // cuenta del target rotation le restamos esa rotación, para que el avión apunte
        // hacia donde realmente se dirige.
        */
        var target = new Phaser.Math.Vector2();
        target.x = getRandomInt(20, this.scale.width - 20);
        target.y = this.scale.height + 32; // (32px is the asset size + the screen height)
        // now we find the angle between the shooter and its target:
        var angle = Phaser.Math.Angle.Between(
          shooter.x,
          shooter.y,
          target.x,
          target.y
        );
        // Now that we found the rotation angle, here we aim the shooter to its target position:
        shooter.rotation = angle - Math.PI / 2;
        // we ask the scene to move the shooter to the target destination:
        // at a random speed between max and min.
        this.physics.moveToObject(
          shooter,
          target,
          getRandomInt(
            GlobalConstants.SHOOTER_MIN_VELOCITY,
            GlobalConstants.SHOOTER_MAX_VELOCITY
          )
        );
        this.nextShooterAt = Date.now() + this.shooterDelay;
      }
    }
  }

  processPlayerInput() {
    this.player.body.setVelocityX(0);
    this.player.body.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }

    this.input.on(
      "pointermove",
      function (pointer) {
        this.player.x = pointer.position.x;
        this.player.y = pointer.position.y;
        // Force the sprite to stay on screen
        /* we don't need this anymore:
        this.player.x = Phaser.Math.Wrap(
          this.player.x,
          0,
          this.game.renderer.width
        );
        this.player.y = Phaser.Math.Wrap(
          this.player.y,
          0,
          this.game.renderer.height
        );
        */
      },
      this
    );
    /* if (
      this.input.activePointer.isDown &&
      this.physics.distanceToPointer(this.player) > 20
    ) {
      this.physics.moveTo(
        this.player,
        this.input.activePointer.x,
        this.input.activePointer.y
      );
    }
    if (
      //this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.Z) ||
      this.zKey.isDown ||
      this.input.activePointer.isDown
    ) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } else {
        this.fire();
      }
    }*/
    if (this.zKey.isDown) {
      this.quitGame();
    }

    this.input.on("pointerdown", this.fire, this);
  }

  quitGame() {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.background.destroy(); //this.sea.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
    this.bulletPool.destroy();
    this.explosionPool.destroy();
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    //this.returnText.destroy();
    //  Then let's go back to the main menu.
    this.scene.start("MainMenu");
  }

  enemyHit(bullet, enemy) {
    bullet.disableBody(true, true); //bullet.kill() --> there's no kill() in P3
    this.damageEnemy(enemy, GlobalConstants.BULLET_DAMAGE);
  }

  playerHit(player, bullet) {
    // check first if this.ghostUntil is not not undefined or null
    if (player.ghostUntil && player.ghostUntil > Date.now()) {
      return;
    }
    bullet.disableBody(true, true);
    var life = this.lives.getFirstAlive();
    if (life) {
      life.active = false; //life.disableBody(true, true);
      life.visible = false;
      this.player.weaponLevel = 0;
      this.player.ghostUntil = Date.now() + GlobalConstants.PLAYER_GHOST_TIME;
      this.player.play("ghost");
    } else {
      this.explode(player);
      this.player.disableBody(true, true);
      this.displayEnd(false);
    }
  }

  playerCrash(player, enemy) {
    // check first if this.ghostUntil is not not undefined or null
    if (player.ghostUntil && player.ghostUntil > Date.now()) {
      return;
    }
    //this.playerExplosionSFX.play();
    // crashing into an enemy only deals 5 damage
    this.damageEnemy(enemy, GlobalConstants.CRASH_DAMAGE);
    // si al jugador le quedan vidas, ghostea, si no, muere
    var life = this.lives.getFirstAlive();
    if (life) {
      life.active = false; //life.disableBody(true, true);
      life.visible = false;
      this.player.weaponLevel = 0;
      this.player.ghostUntil = Date.now() + GlobalConstants.PLAYER_GHOST_TIME;
      this.player.play("ghost");
    } else {
      this.explode(player);
      this.player.disableBody(true, true);
      this.displayEnd(false);
    }
  }

  playerPowerUp(player, powerUp) {
    addToScore(this, powerUp.reward);
    powerUp.disableBody(true, true);
    this.powerUpSFX.play();

    if (player.weaponLevel < 5) {
      player.weaponLevel++;
    }
  }

  explode(sprite) {
    /*
    if (this.explosionPool.countDead() === 0) {
      return;
    }
    */
    var explosion = this.explosionPool.getFirstDead(
      false,
      sprite.x,
      sprite.y,
      null,
      null,
      true
    );
    //explosion.body.reset(sprite.x, sprite.y);
    explosion.enableBody(true, sprite.x, sprite.y, true, true);
    explosion.play("boom"); //, 15, false, true);
    // add the original sprite's velocity to the explosion
    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;
  }

  damageEnemy(enemy, damage) {
    //Using this custom damage() method automatically kills the sprite once its health is reduced to zero.
    enemy.damage(damage);
    // if after damage has been done the enemy is still alive, we show it's been hit.
    if (enemy.health > 0) {
      enemy.play("hit");
    } /* else {
      this.explode(enemy);
      this.explosionSFX.play();
      this.spawnPowerUp(enemy);
      addToScore(this, enemy.reward);*/
    /*
      // We check the sprite key (e.g. 'greenEnemy') to see if the sprite is a boss
      // For full games, it would be better to set flags on the sprites themselves
      if (enemy.key === "boss") {
        this.enemyPool.destroy();
        this.shooterPool.destroy();
        this.bossPool.destroy();
        this.enemyBulletPool.destroy();
        this.displayEnd(true);
      }
    }*/
  }

  spawnBoss() {
    if (this.score >= 200 && this.bossPool.countActive() < 1) {
      this.bossApproaching = true;
      //make it approach from the top:
      this.boss = this.bossPool.getFirstDead(
        false,
        this.scale.width / 2,
        -80,
        null,
        null,
        true
      );
      this.boss.enableBody(true, this.scale.width / 2, -80, true, true);
      this.boss.body.velocity.y = GlobalConstants.BOSS_Y_VELOCITY;
      //this.boss.play("fly");

      /*
      this.boss.reset(this.game.width / 2, 0, GlobalConstants.BOSS_HEALTH);
      this.physics.enable(this.boss, Phaser.Physics.ARCADE);
      */
    }
    //if it's in position, start fighting
    if (
      this.bossPool.countActive() > 0 &&
      this.bossApproaching &&
      this.boss.y > 80
    ) {
      // make sure we execute this lines only once:
      this.bossApproaching = false;
      //start fighting!!
      this.boss.nextShotAt = 0;
      this.boss.body.velocity.y = 0;
      this.boss.body.velocity.x = GlobalConstants.BOSS_X_VELOCITY;
      // allow bouncing off world bounds
      this.boss.body.bounce.x = 1;
      this.boss.body.collideWorldBounds = true;
    }
  }

  spawnPowerUp(enemy) {
    //(this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) {
    if (this.player.weaponLevel === 5) return;

    if (Phaser.Math.RND.frac() < enemy.dropRate) {
      var powerUp = this.powerUpPool.getFirstDead(
        false,
        enemy.x,
        enemy.y,
        null,
        null,
        true
      );
      if (powerUp) {
        powerUp.enableBody(true, enemy.x, enemy.y, true, true);
        powerUp.body.velocity.y = GlobalConstants.POWERUP_VELOCITY;
      }
    }
  }

  processDelayedEffects() {
    if (this.instructions && Date.now() > this.instExpire) {
      this.instructions.destroy();
    }

    /* We created an event in the player class to accomplish this
    if (this.player.ghostUntil && this.player.ghostUntil < Date.now()) {
      this.player.ghostUntil = 0;
      this.player.play("fly");
    }
    */
    if (this.showReturn && Date.now() > this.showReturn) {
      this.returnText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        "Press Z or Tap Game to go back to Main Menu",
        { font: "16px sans-serif", fill: "#fff" }
      );
      this.returnText.setOrigin(0.5, 0.5); //this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }
  }

  displayEnd(win) {
    /* you can't win and lose at the same time
    if (this.endText && this.endText.exists) {
      return;
    }*/
    if (!this.gameOver) {
      var msg = win ? "You Win!!!" : "Game Over!";
      this.endText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 - 60,
        msg,
        { font: "72px serif", fill: "#fff" }
      );
      //this.endText.anchor.setTo(0.5, 0);
      this.endText.setOrigin(0.5, 0);

      this.showReturn = Date.now() + GlobalConstants.RETURN_MESSAGE_DELAY;
      this.gameOver = true;
    }
  }
}
