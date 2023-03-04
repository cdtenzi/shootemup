import { GlobalConstants } from "../../util/GlobalConstants.js";
import { setupBackground, setupAudio } from "./scene1.setup.js";
import { setupEnemies, setupEnemyBullets } from "./enemies.setup.js";
import {
  setupPlayer,
  setupPlayerIcons,
  setupPlayerBullets,
} from "../../player/player.setup.js";
import { setupText, addToScore } from "../../gameUI/textSetup.js";
import { setupExplosions } from "../../effects/explosions.js";

// We inherit from Phaser.Scene, converting all our old "States" into Scenes
export default class Game extends Phaser.Scene {
  constructor(sceneConfig) {
    super(sceneConfig);
    this.key = "Game";
  }

  create() {
    console.log("setupBackground...");
    setupBackground(this);
    console.log("setupPlayer...");
    setupPlayer(this);
    console.log("setupEnemies...");
    setupEnemies(this);
    console.log("setupPlayerBullets...");
    setupPlayerBullets(this);
    console.log("setupEnemyBullets...");
    setupEnemyBullets(this);
    console.log("setupExplosions...");
    setupExplosions(this);
    console.log("setupPlayerIcons...");
    setupPlayerIcons(this);
    console.log("setupText...");
    setupText(this);

    setupAudio(this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.checkCollisions();
    this.spawnEnemies();
    this.enemyFire();
    this.processPlayerInput();
    this.processDelayedEffects();
  }

  fire() {
    // chequeamos el ratio de disparo y si pasaron más de los milisegundos
    // esperados para emitir la siguiente bala, si no, cortamos la ejecución
    if (this.nextShotAt > this.time.now || !this.player.alive) {
      return;
    }
    this.nextShotAt = this.time.now + this.shotDelay;

    this.playerFireSFX.play();

    var bullet;
    if (this.weaponLevel === 0) {
      // resetea las balas muertas
      if (this.bulletPool.countDead() === 0) {
        return;
      }
      bullet = this.bulletPool.getFirstExists(false);
      bullet.reset(this.player.x, this.player.y - 20);
      bullet.body.velocity.y = -GlobalConstants.BULLET_VELOCITY;
    } else {
      // chequea que el poder del arma no quede por debajo de la cantidad de balas
      if (this.bulletPool.countDead() < this.weaponLevel * 2) {
        return;
      }
      // genera una bala por cada powerUp (nivel/poder del arma)
      for (var i = 0; i < this.weaponLevel; i++) {
        bullet = this.bulletPool.getFirstExists(false);
        // spawn left bullet slightly left off center
        bullet.reset(this.player.x - (10 + i * 6), this.player.y - 20);
        // the left bullets spread from -95 degrees to -135 degrees
        this.physics.arcade.velocityFromAngle(
          -95 - i * 10,
          GlobalConstants.BULLET_VELOCITY,
          bullet.body.velocity
        );

        bullet = this.bulletPool.getFirstExists(false);
        // spawn right bullet slightly right off center
        bullet.reset(this.player.x + (10 + i * 6), this.player.y - 20);
        // the right bullets spread from -85 degrees to -45
        this.physics.arcade.velocityFromAngle(
          -85 + i * 10,
          GlobalConstants.BULLET_VELOCITY,
          bullet.body.velocity
        );
      }
    }
  }

  enemyFire() {
    this.shooterPool.forEachAlive(function (enemy) {
      if (
        this.time.now > enemy.nextShotAt &&
        this.enemyBulletPool.countDead() > 0
      ) {
        var bullet = this.enemyBulletPool.getFirstExists(false);
        bullet.reset(enemy.x, enemy.y);
        this.physics.arcade.moveToObject(
          bullet,
          this.player,
          GlobalConstants.ENEMY_BULLET_VELOCITY
        );
        enemy.nextShotAt = this.time.now + GlobalConstants.SHOOTER_SHOT_DELAY;
        this.enemyFireSFX.play();
      }
    }, this);

    // Disparos del Boss
    if (
      this.bossApproaching === false &&
      this.boss.alive &&
      this.boss.nextShotAt < this.time.now &&
      this.enemyBulletPool.countDead() >= 10
    ) {
      this.boss.nextShotAt = this.time.now + GlobalConstants.BOSS_SHOT_DELAY;
      this.enemyFireSFX.play();
      for (var i = 0; i < 5; i++) {
        // process 2 bullets at a time
        var leftBullet = this.enemyBulletPool.getFirstExists(false);
        leftBullet.reset(this.boss.x - 10 - i * 10, this.boss.y + 20);
        var rightBullet = this.enemyBulletPool.getFirstExists(false);
        rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);

        if (this.boss.health > GlobalConstants.BOSS_HEALTH / 2) {
          // aim directly at the player
          this.physics.arcade.moveToObject(
            leftBullet,
            this.player,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
          this.physics.arcade.moveToObject(
            rightBullet,
            this.player,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
        } else {
          // aim slightly off center of the player
          this.physics.arcade.moveToXY(
            leftBullet,
            this.player.x - i * 100,
            this.player.y,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
          this.physics.arcade.moveToXY(
            rightBullet,
            this.player.x + i * 100,
            this.player.y,
            GlobalConstants.ENEMY_BULLET_VELOCITY
          );
        }
      }
    }
  }

  //
  // update()- related functions
  //
  checkCollisions() {
    this.physics.arcade.overlap(
      this.bulletPool,
      this.enemyPool,
      this.enemyHit,
      null,
      this
    );
    this.physics.arcade.overlap(
      this.bulletPool,
      this.shooterPool,
      this.enemyHit,
      null,
      this
    );
    this.physics.arcade.overlap(
      this.player,
      this.enemyPool,
      this.playerHit,
      null,
      this
    );
    // Jugador vs enemigos
    this.physics.arcade.overlap(
      this.player,
      this.shooterPool,
      this.playerHit,
      null,
      this
    );
    // jugador vs balas enemigas
    this.physics.arcade.overlap(
      this.player,
      this.enemyBulletPool,
      this.playerHit,
      null,
      this
    );
    // jugador vs Power Up!
    this.physics.arcade.overlap(
      this.player,
      this.powerUpPool,
      this.playerPowerUp,
      null,
      this
    );

    //Boss: Solo colisiona una vez que esta en posición
    if (this.bossApproaching === false) {
      this.physics.arcade.overlap(
        this.bulletPool,
        this.bossPool,
        this.enemyHit,
        null,
        this
      );
      this.physics.arcade.overlap(
        this.player,
        this.bossPool,
        this.playerHit,
        null,
        this
      );
    }
  }

  spawnEnemies() {
    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20),
        0,
        GlobalConstants.ENEMY_HEALTH
      );
      // also randomize the speed
      enemy.body.velocity.y = this.rnd.integerInRange(
        GlobalConstants.ENEMY_MIN_Y_VELOCITY,
        GlobalConstants.ENEMY_MAX_Y_VELOCITY
      );
      enemy.play("fly");
    }

    // Spawning white enemies that move differently:
    if (
      this.nextShooterAt < this.time.now &&
      this.shooterPool.countDead() > 0
    ) {
      this.nextShooterAt = this.time.now + this.shooterDelay;
      var shooter = this.shooterPool.getFirstExists(false);
      // spawn at a random location at the top
      shooter.reset(
        this.rnd.integerInRange(20, this.game.width - 20),
        0,
        GlobalConstants.SHOOTER_HEALTH
      );
      // choose a random target location at the bottom
      var target = this.rnd.integerInRange(20, this.game.width - 20);
      // move to target and rotate the sprite accordingly
      shooter.rotation =
        this.physics.arcade.moveToXY(
          shooter,
          target,
          this.game.height,
          this.rnd.integerInRange(
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
      shooter.play("fly");
      // each shooter has their own shot timer
      shooter.nextShotAt = 0;
    }
  }

  processPlayerInput() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

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

    if (
      this.input.activePointer.isDown &&
      this.physics.arcade.distanceToPointer(this.player) > 15
    ) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }

    if (
      this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      this.input.activePointer.isDown
    ) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } else {
        this.fire();
      }
    }
  }

  processDelayedEffects() {
    if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    }
  }

  quitGame(pointer) {
    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.sea.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
    this.bulletPool.destroy();
    this.explosionPool.destroy();
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();
    //  Then let's go back to the main menu.
    this.state.start("MainMenu");
  }

  enemyHit(bullet, enemy) {
    bullet.kill();
    this.damageEnemy(enemy, GlobalConstants.BULLET_DAMAGE);
  }

  playerHit(player, enemy) {
    // check first if this.ghostUntil is not not undefined or null
    if (this.ghostUntil && this.ghostUntil > this.time.now) {
      return;
    }
    this.playerExplosionSFX.play();
    // crashing into an enemy only deals 5 damage
    this.damageEnemy(enemy, GlobalConstants.CRASH_DAMAGE);
    // si al jugador le quedan vidas, ghostea, si no, muere
    var life = this.lives.getFirstAlive();
    if (life !== null) {
      life.kill();
      this.weaponLevel = 0;
      this.ghostUntil = this.time.now + GlobalConstants.PLAYER_GHOST_TIME;
      this.player.play("ghost");
    } else {
      this.explode(player);
      player.kill();
      this.displayEnd(false);
    }
  }

  playerPowerUp(player, powerUp) {
    addToScore(this, powerUp.reward);
    powerUp.kill();
    this.powerUpSFX.play();

    if (this.weaponLevel < 5) {
      this.weaponLevel++;
    }
  }

  explode(sprite) {
    if (this.explosionPool.countDead() === 0) {
      return;
    }
    var explosion = this.explosionPool.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    explosion.play("boom", 15, false, true);
    // add the original sprite's velocity to the explosion
    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;
  }

  damageEnemy(enemy, damage) {
    //Using damage() automatically kill()s the sprite once its health is reduced to zero.
    enemy.damage(damage);
    if (enemy.alive) {
      enemy.play("hit");
    } else {
      this.explode(enemy);
      this.explosionSFX.play();
      this.spawnPowerUp(enemy);
      addToScore(this, enemy.reward);
      // We check the sprite key (e.g. 'greenEnemy') to see if the sprite is a boss
      // For full games, it would be better to set flags on the sprites themselves
      if (enemy.key === "boss") {
        this.enemyPool.destroy();
        this.shooterPool.destroy();
        this.bossPool.destroy();
        this.enemyBulletPool.destroy();
        this.displayEnd(true);
      }
    }
  }

  spawnBoss() {
    this.bossApproaching = true;
    this.boss.reset(this.game.width / 2, 0, GlobalConstants.BOSS_HEALTH);
    this.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.body.velocity.y = GlobalConstants.BOSS_Y_VELOCITY;
    this.boss.play("fly");
  }

  spawnPowerUp(enemy) {
    if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) {
      return;
    }

    if (this.rnd.frac() < enemy.dropRate) {
      var powerUp = this.powerUpPool.getFirstExists(false);
      powerUp.reset(enemy.x, enemy.y);
      powerUp.body.velocity.y = GlobalConstants.POWERUP_VELOCITY;
    }
  }

  processDelayedEffects() {
    if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    }

    if (this.ghostUntil && this.ghostUntil < this.time.now) {
      this.ghostUntil = null;
      this.player.play("fly");
    }

    if (this.showReturn && this.time.now > this.showReturn) {
      this.returnText = this.add.text(
        this.game.width / 2,
        this.game.height / 2 + 20,
        "Press Z or Tap Game to go back to Main Menu",
        { font: "16px sans-serif", fill: "#fff" }
      );
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

    if (this.bossApproaching && this.boss.y > 80) {
      this.bossApproaching = false;
      this.boss.nextShotAt = 0;

      this.boss.body.velocity.y = 0;
      this.boss.body.velocity.x = GlobalConstants.BOSS_X_VELOCITY;
      // allow bouncing off world bounds
      this.boss.body.bounce.x = 1;
      this.boss.body.collideWorldBounds = true;
    }
  }

  displayEnd(win) {
    // you can't win and lose at the same time
    if (this.endText && this.endText.exists) {
      return;
    }

    var msg = win ? "You Win!!!" : "Game Over!";
    this.endText = this.add.text(
      this.game.width / 2,
      this.game.height / 2 - 60,
      msg,
      { font: "72px serif", fill: "#fff" }
    );
    this.endText.anchor.setTo(0.5, 0);

    this.showReturn = this.time.now + GlobalConstants.RETURN_MESSAGE_DELAY;
  }
}