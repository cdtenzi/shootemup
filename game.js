import { GlobalConstants } from "./util/GlobalConstants.js";

export default class Game {
  //BasicGame.Game = class Game {
  create() {
    this.setupBackground();
    this.setupPlayer();
    this.setupEnemies();
    this.setupBullets();
    this.setupExplosions();
    this.setupPlayerIcons();
    this.setupText();

    this.setupAudio();

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.checkCollisions();
    this.spawnEnemies();
    this.enemyFire();
    this.processPlayerInput();
    this.processDelayedEffects();
  }

  setupBackground() {
    this.sea = this.add.tileSprite(
      0,
      0,
      this.game.width,
      this.game.height,
      "sea"
    );
    this.sea.autoScroll(0, GlobalConstants.SEA_SCROLL_SPEED);
  }

  setupAudio() {
    this.sound.volume = 0.3;
    this.explosionSFX = this.add.audio("explosion");
    this.playerExplosionSFX = this.add.audio("playerExplosion");
    this.enemyFireSFX = this.add.audio("enemyFire");
    this.playerFireSFX = this.add.audio("playerFire");
    this.powerUpSFX = this.add.audio("powerUp");
  }

  setupPlayer() {
    this.player = this.add.sprite(
      this.game.width / 2,
      this.game.height - 50,
      "player"
    );
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add("fly", [0, 1, 2], 20, true);
    this.player.animations.add("ghost", [3, 0, 3, 1], 20, true);
    this.player.play("fly");
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.speed = this.player.speed = GlobalConstants.PLAYER_SPEED;
    this.player.body.collideWorldBounds = true;
    // 20 x 20 pixel hitbox, centered a little bit higher than the center
    this.player.body.setSize(20, 20, 0, -5);
    this.weaponLevel = 0;
  }

  setupEnemies() {
    //Green enemies:
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(50, "greenEnemy");
    this.enemyPool.setAll("anchor.x", 0.5);
    this.enemyPool.setAll("anchor.y", 0.5);
    this.enemyPool.setAll("outOfBoundsKill", true);
    this.enemyPool.setAll("checkWorldBounds", true);
    this.enemyPool.setAll(
      "reward",
      GlobalConstants.ENEMY_REWARD,
      false,
      false,
      0,
      true
    );
    this.enemyPool.setAll(
      "dropRate",
      GlobalConstants.ENEMY_DROP_RATE,
      false,
      false,
      0,
      true
    );
    // Set the animation for each sprite
    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add("fly", [0, 1, 2], 20, true);
      enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
      enemy.events.onAnimationComplete.add(function (e) {
        e.play("fly");
      }, this);
    });
    this.nextEnemyAt = 0;
    this.enemyDelay = GlobalConstants.SPAWN_ENEMY_DELAY;

    // Harder white enemies
    this.shooterPool = this.add.group();
    this.shooterPool.enableBody = true;
    this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooterPool.createMultiple(20, "whiteEnemy");
    this.shooterPool.setAll("anchor.x", 0.5);
    this.shooterPool.setAll("anchor.y", 0.5);
    this.shooterPool.setAll("outOfBoundsKill", true);
    this.shooterPool.setAll("checkWorldBounds", true);
    this.shooterPool.setAll(
      "reward",
      GlobalConstants.SHOOTER_REWARD,
      false,
      false,
      0,
      true
    );
    this.shooterPool.setAll(
      "dropRate",
      GlobalConstants.SHOOTER_DROP_RATE,
      false,
      false,
      0,
      true
    );
    // Set the animation for each sprite
    this.shooterPool.forEach(function (enemy) {
      enemy.animations.add("fly", [0, 1, 2], 20, true);
      enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
      enemy.events.onAnimationComplete.add(function (e) {
        e.play("fly");
      }, this);
    });
    // start spawning 5 seconds into the game
    this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
    this.shooterDelay = GlobalConstants.SPAWN_SHOOTER_DELAY;

    // Boss setup
    this.bossPool = this.add.group();
    this.bossPool.enableBody = true;
    this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bossPool.createMultiple(1, "boss");
    this.bossPool.setAll("anchor.x", 0.5);
    this.bossPool.setAll("anchor.y", 0.5);
    this.bossPool.setAll("outOfBoundsKill", true);
    this.bossPool.setAll("checkWorldBounds", true);
    this.bossPool.setAll(
      "reward",
      GlobalConstants.BOSS_REWARD,
      false,
      false,
      0,
      true
    );
    this.bossPool.setAll(
      "dropRate",
      GlobalConstants.BOSS_DROP_RATE,
      false,
      false,
      0,
      true
    );
    // Set the animation for each sprite
    this.bossPool.forEach(function (enemy) {
      enemy.animations.add("fly", [0, 1, 2], 20, true);
      enemy.animations.add("hit", [3, 1, 3, 2], 20, false);
      enemy.events.onAnimationComplete.add(function (e) {
        e.play("fly");
      }, this);
    });
    this.boss = this.bossPool.getTop();
    this.bossApproaching = false;
  }

  setupBullets() {
    this.enemyBulletPool = this.add.group();
    this.enemyBulletPool.enableBody = true;
    this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBulletPool.createMultiple(100, "enemyBullet");
    this.enemyBulletPool.setAll("anchor.x", 0.5);
    this.enemyBulletPool.setAll("anchor.y", 0.5);
    this.enemyBulletPool.setAll("outOfBoundsKill", true);
    this.enemyBulletPool.setAll("checkWorldBounds", true);
    this.enemyBulletPool.setAll("reward", 0, false, false, 0, true);

    // Add an empty sprite group into our game
    this.bulletPool = this.add.group();
    // Enable physics to the whole sprite group
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    // Add 100 'bullet' sprites in the group.
    // By default this uses the first frame of the sprite sheet and
    //   sets the initial state as non-existing (i.e. killed/dead)
    this.bulletPool.createMultiple(100, "bullet");
    // Sets anchors of all sprites
    this.bulletPool.setAll("anchor.x", 0.5);
    this.bulletPool.setAll("anchor.y", 0.5);

    // Automatically kill the bullet sprites when they go out of bounds
    this.bulletPool.setAll("outOfBoundsKill", true);
    this.bulletPool.setAll("checkWorldBounds", true);

    this.nextShotAt = 0;
    this.shotDelay = GlobalConstants.SHOT_DELAY;
  }

  setupExplosions() {
    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, "explosion");
    this.explosionPool.setAll("anchor.x", 0.5);
    this.explosionPool.setAll("anchor.y", 0.5);
    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add("boom");
    });
  }

  setupText() {
    this.instructions = this.add.text(
      this.game.width / 2,
      this.game.height - 100,
      "Use Arrow Keys to Move, Press Z to Fire\n" +
        "Tapping/clicking does both",
      { font: "20px monospace", fill: "#fff", align: "center" }
    );
    this.instructions.anchor.setTo(0.5, 0.5); // Establece el punto ded anclaje en el centro del texto
    this.instExpire = this.time.now + GlobalConstants.INSTRUCTION_EXPIRE;
    //Game score text
    this.score = 0;
    this.scoreText = this.add.text(
      this.game.width / 2,
      30,
      "Reward: " + this.score,
      {
        font: "20px monospace",
        fill: "#fff",
        align: "center",
      }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
  }

  setupPlayerIcons() {
    this.powerUpPool = this.add.group();
    this.powerUpPool.enableBody = true;
    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.powerUpPool.createMultiple(5, "powerup1");
    this.powerUpPool.setAll("anchor.x", 0.5);
    this.powerUpPool.setAll("anchor.y", 0.5);
    this.powerUpPool.setAll("outOfBoundsKill", true);
    this.powerUpPool.setAll("checkWorldBounds", true);
    this.powerUpPool.setAll(
      "reward",
      GlobalConstants.POWERUP_REWARD,
      false,
      false,
      0,
      true
    );

    this.lives = this.add.group();
    // calculate location of first life icon
    var firstLifeIconX =
      this.game.width - 10 - GlobalConstants.PLAYER_EXTRA_LIVES * 30;
    for (var i = 0; i < GlobalConstants.PLAYER_EXTRA_LIVES; i++) {
      var life = this.lives.create(firstLifeIconX + 30 * i, 30, "player");
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
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
    this.addToScore(powerUp.reward);
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
      this.addToScore(enemy.reward);
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

  addToScore(score) {
    this.score += score;
    this.scoreText.text = this.score;
    // this approach prevents the boss from spawning again upon winning
    if (this.score >= 20000 && this.bossPool.countDead() == 1) {
      this.spawnBoss();
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
