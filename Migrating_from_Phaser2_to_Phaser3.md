# Migrating from Phase2/PhaserCE to Phaser3

Migrating from Phaser 2 (P2 from now on) can be complex sometimes but mostly because of the way things are done in Phaser 3 (P3 from now on).

The first thing to take into account is that P3 replaces the "States" with the "Scenes", and this has some constraints from the "software architecture" point of view, that are there to force a better code organization, improving readability and maintenance.

That said, you'll see that our code structure has 2 fundamental differences between P2 and P3:

1. We are replacing the _Game_.**state** objects with _Game_.**scene** objects:
   -- The first issue with the original code is that _our P2 code_ kinf of _injects_ the states into the game, giving the game a "Preloader" state that is going to "preload" for us absolutely all the sprites in our game.
   -- This is very useful in P2, but in P3 we have a different and more _object oriented_ concept of states: we organize our game in so called **Scenes**, you can picture scenes as layers of your game, or windows maybe, where asses live in and are independent from the other scenes. You'll find a very graphical explanation in [Luis Zuno's Youtube channel](https://youtu.be/gFXx7lgxK9A).
   -- Based on the above, you'll find that our repo tags `PhaserCE-stable` and `Phaser3-stable` have a very different structure: in the later one we grouped all our main scene (scene1) code in one folder
2. In P3 sprites can only be alive at one scene at a time:
   -- This means we cannot have a `Preloader` scene that takes care of all the sprites we need in our game, because this collides with our scene1 game.js (our main game scene) where we need to load the sprites. Since we cannot have the sprites living in both the preloader and game scenes, our code will not compile. You can see this in the first commit of this document (part 1 of the P3 migration).
