import { GlobalConstants } from "../../util/GlobalConstants.js";

export function setupBackground(scene) {
  //
  scene.background = "#2d2d2d";

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
  // Translating to P3 sound:
  scene.explosionSFX = scene.sound.add("explosion"); //scene.add.audio("explosion");
  scene.playerExplosionSFX = scene.sound.add("playerExplosion"); //scene.add.audio("playerExplosion");
  scene.enemyFireSFX = scene.sound.add("enemyFire"); //scene.add.audio("enemyFire");
  scene.playerFireSFX = scene.sound.add("playerFire"); //scene.add.audio("playerFire");
  scene.powerUpSFX = scene.sound.add("powerUp"); //scene.add.audio("powerUp");
}
