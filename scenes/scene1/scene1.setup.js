import { GlobalConstants } from "../../util/GlobalConstants.js";

export function setupBackground(scene) {
  scene.sea = scene.add.tileSprite(
    0,
    0,
    scene.game.width,
    scene.game.height,
    "sea"
  );
  scene.sea.scrollFactorY = GlobalConstants.SEA_SCROLL_SPEED; // autoScroll(0, GlobalConstants.SEA_SCROLL_SPEED);
}

export function setupAudio(scene) {
  scene.sound.volume = 0.3;
  scene.explosionSFX = scene.add.audio("explosion");
  scene.playerExplosionSFX = scene.add.audio("playerExplosion");
  scene.enemyFireSFX = scene.add.audio("enemyFire");
  scene.playerFireSFX = scene.add.audio("playerFire");
  scene.powerUpSFX = scene.add.audio("powerUp");
}
