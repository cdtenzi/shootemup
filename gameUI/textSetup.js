import { GlobalConstants } from "../util/GlobalConstants.js";

export function setupText(scene) {
  scene.instructions = scene.add.text(
    20,
    scene.scale.height - 100,
    "Use Arrow Keys to Move, Press Z to Fire\n" + "Tapping/clicking does both",
    { font: "16px monospace", fill: "#fff", align: "left" }
  );
  //scene.instructions.anchor.setTo(0.5, 0.5); // Establece el punto ded anclaje en el centro del texto
  scene.instExpire = Date.now() + GlobalConstants.INSTRUCTION_EXPIRE;
  //Game score text
  scene.score = 0;
  scene.scoreText = scene.add.text(
    scene.scale.width / 2,
    30,
    "Reward: " + scene.score,
    {
      font: "20px monospace",
      fill: "#fff",
      align: "center",
    }
  );
  scene.scoreText.setOrigin(0.5, 0.5); //scene.scoreText.anchor.setTo(0.5, 0.5);
}

export function addToScore(scene, score) {
  scene.score += score;
  scene.scoreText.text = scene.score;
}
