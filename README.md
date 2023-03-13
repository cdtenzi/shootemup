# About

This is a complete migration of the code made by _Bryan Bibat_ in his book [HTML5 Shoot'em up in an afternoon](https://leanpub.com/html5shootemupinanafternoon/read). You will find teh complete code starting from the original one made by Bryan, and the different steps i've made to get it working on Phaser 3. Check out the different tags to see what I've made, and in between tags, you can always check the commits history to find out the small steps i took.

You won't find the challenges proposed by Bryan in his book, but after going through this migration, I'm pretty sure you can do them by yourself. Go on and purchase his book, it is really good and I strongly recommend it if you want to learn Phaser.

# Migrating from Phaser2/PhaserCE to Phaser3

Migrating from Phaser 2 (P2 from now on) can be complex sometimes but mostly because of the way things are done in Phaser 3 (P3 from now on).

The first thing to take into account is that P3 replaces the "States" with the "Scenes", and this has some constraints from the "software architecture" point of view, that are there to force a better code organization, improving readability and maintenance.

That said, you'll see that our code structure has 2 fundamental differences between P2 and P3:

1. We are replacing the _Game_.**state** objects with _Game_.**scene** objects:

   - The first issue with the original code is that _our P2 code_ kinf of _injects_ the states into the game, giving the game a "Preloader" state that is going to "preload" for us absolutely all the sprites in our game.

   - This is very useful in P2, but in P3 we have a different and more _object oriented_ concept of states: we organize our game in so called **Scenes**, you can picture scenes as layers of your game, or windows maybe, where asses live in and are independent from the other scenes. You'll find a very graphical explanation in [Luis Zuno's Youtube channel](https://youtu.be/gFXx7lgxK9A).

   - Based on the above, you'll find that our repo tags `PhaserCE-stable` and `Phaser3-final` have a very different structure: in the later one we grouped all our main scene (scene1) code in one folder

2. In P3 sprites can only be alive at one scene at a time:

   - This means we cannot have a `Preloader` scene that takes care of all the sprites we need in our game, because this collides with our scene1 game.js (our main game scene) where we need to load the sprites. Since we cannot have the sprites living in both the preloader and game scenes, our code will not compile. You can see this in the first commit of this document (part 1 of the P3 migration).

## Converting the Preloader state (into a sprite loading function)

As we explained above, we need our preloader to be part of the scene we are building up. This requires us to covert that preloader class into a function that loads all sprites we need in our game scene (`scene1.game.js`).

For the sake of code readability and maintenance, we are keeping this "preloader code" in its own file: `scene1.preloader.js`.

## Restructuring code in different folders

In the migrated version, you'll find that every single piece of the game was re-structured in different folders that contain the corresponding pieces of the game.

I've made this because it's easier and more sustainable for the code, to have each object being responsible of its own behaviour, animations and data, although you will find certain "common" or "shared" code among all sprites, like for example `explosions.js`, which contains teh explosion class and setup that is being used for every single plane in the game.

## About the room for necessary improvements

Although the code looks better now, there's still a lot of room for improvement. For example:

- I created an "avatars" folder that is still empty, but it was the starting point of making a better code for the Player class. This would contain different kinds of planes/ships the actual player could use.

- Enemy fire and player fire code is still inside the scene code, which is not optimal. Since the actual firing objects are the avatar and the enemies, the actual firing action should be performed by these objects. This would also give thh chance to use different kinds of weapons on each object, which may do different amount of damage, etc.

- Menu items and text should be part of the player UI in a separate scene that could float on top of the current one. Although I've made the first steps of this creating a **gameUI** folder, there's only a MainMenu scene inside of it, which strictly stuck to the original Bryan's code.

- Challenges proposed by **Bryan Bibat** in his book: You'll find that they are not here, so please purchase his book here [HTML5 Shoot'em up in an afternoon](https://leanpub.com/html5shootemupinanafternoon/read) and feel free to complete this game!

## Final words and thanks

If you are new to **Phaser** I'd like to recommend you reading the complete book and making the challenges. Not only because it is the best way to learn, but also because it will lead you to teh fantastic world of game programming. I wish you the best of luck.

Finally, I'd like to thank **Bryan Bibat** because his book opened a new world for me, and made me re-connect with my first working program, which was a very basic arcade snoopy jumping over some rocks. That 12 years old kid became alive again 33 years later, passionate again, and having fun at late night by just programming a game.
