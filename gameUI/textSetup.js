import { GlobalConstants } from "../util/GlobalConstants.js";

export function setupText(scene) {
  scene.instructions = scene.add.text(
    scene.game.width / 2,
    scene.game.height - 100,
    "Use Arrow Keys to Move, Press Z to Fire\n" + "Tapping/clicking does both",
    { font: "20px monospace", fill: "#fff", align: "center" }
  );
  scene.instructions.anchor.setTo(0.5, 0.5); // Establece el punto ded anclaje en el centro del texto
  scene.instExpire = scene.time.now + GlobalConstants.INSTRUCTION_EXPIRE;
  //Game score text
  scene.score = 0;
  scene.scoreText = scene.add.text(
    scene.game.width / 2,
    30,
    "Reward: " + scene.score,
    {
      font: "20px monospace",
      fill: "#fff",
      align: "center",
    }
  );
  scene.scoreText.anchor.setTo(0.5, 0.5);
}

export function addToScore(scene, score) {
  scene.score += score;
  scene.scoreText.text = scene.score;
  // this approach prevents the boss from spawning again upon winning
  if (scene.score >= 20000 && scene.bossPool.countDead() == 1) {
    scene.spawnBoss();
  }
}
