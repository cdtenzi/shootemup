# Migrating from Phase2/PhaserCE to Phaser3

Migrating from Phaser 2 (P2 from now on) can be complex sometimes but mostly because of the way things are done in Phaser 3 (P3 from now on).

The first thing to take into account is that P3 replaces the "States" with the "Scenes", and this has some constraints from the "software architecture" point of view, that are there to force a better code organization, improving readability and maintenance.

That said, you'll see that our code structure has 2 fundamental differences between P2 and P3:

1. We are replacing the Game.state objects with Game.scene objects:
