export function setupBackground(scene) {
  //
  scene.backgroundColor = "#2d2d2d";
  // we replace .sea by .background property: just because it feels more generic
  // and later we can re-use this scene to setup others like this one
  scene.background = scene.add.tileSprite(
    0,
    0,
    scene.scale.width,
    scene.scale.height,
    "sea"
  );
  // we don't have auto-scrolling in P3, so we'll have to do this
  // differently we do it in the update() loop inside the actual scene.
  // autoScroll(0, GlobalConstants.SEA_SCROLL_SPEED);
  scene.background.setOrigin(0, 0); //---> sets this image's anchor to 0, 0
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
