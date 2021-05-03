% Final Presentation
% Group 10 Anshuman & Dzung
% May 2021

# Dungeon Mayhem Online

![](dm.png)

## A Refresher

- A fast-paced and easy-to-learn card game based on Dungeons and Dragons
- 12 classes with unique cards and abilities to choose from

# Our goals for the project

- Implement the Game
- 3D tabletop 
- Local Multiplayer
- AI
<!-- - ~~Custom Cards~~ -->

## The Game on a 3D Tabletop
<video data-autoplay>
  <source src="./RandomFastPan.webm">
          data-external="1" type="video/webm">
  </source>
</video>

## Local Multiplayer and AI
<video data-autoplay>
  <source src="./StartingAGame.webm">
          data-external="1" type="video/webm">
  </source>
</video>

# Details and Challenges

# The 3D Tabletop

The Game looks okay, I could not achieve some of the more interesting visual effects I wanted.

## Demo
<!-- <video data-autoplay>
  <source src="./RandomFast.webm">
          data-external="1" type="video/webm">
  </source>
</video> -->
<video data-autoplay>
  <source src="./PlayingWith2Tabs2.webm">
          data-external="1" type="video/webm">
  </source>
</video>

## Assets
I used a online free collection of 3D printable miniatures for Dungeons and Dragons to create the tokens for each character

An EquirectangularTexture is used to create the background image

The cards were scanned and cut from the original game.

- A single image with all the cards was created, we modify the UV coordinates to map to a different sections of the Texture sheet
- This cuts down on loading time

## THREE.js

Very easy to work with.

Dynamic typing is very flexible

We used async/await to handle loading of assets

We use GLB files for the models, which are natively supported

There is also a Raycaster inbuilt which we used for implementing selections

## Other Libraries

OrbitControls, an auxiliary library for THREE.js

dat.gui, easy library for the sidebar GUI

# Game Logic

We have implemented 8 of the classes from the original game.

The rest of the classes have more complicated mechanics, so we focused on AI and networking first.

The Game logic had a lot of edge cases due to the complex nature of the game with many unique abilities

##
<video data-autoplay>
  <source src="./PlayingWith2Tabs2.webm">
          data-external="1" type="video/webm">
  </source>
</video>

# AI

Inspired by Monte Carlo Tree Search. ie
Iterate over all the Cards it has to play and randomly play out a selection of games starting with that move.

This gives an expected value of playing that card.

We don't use minimax as the decision tree is too complicated, its not just one move per turn, there are subdecisions and a lot of randomness

## Challenges

We reduce our use of global state as much as possible.

This makes it easier to

1. Make an isolated and complete clone of the Game state
2. Simulate the game with random moves without affecting everything else

##
<video data-autoplay>
  <source src="./AITop.webm">
          data-external="1" type="video/webm">
  </source>
</video>

##
<video data-autoplay>
  <source src="./AISide3.webm">
          data-external="1" type="video/webm">
  </source>
</video>


# Local Multiplayer

Use WebRTC to allow Peer to Peer connections without any server. 

Use the `simple-peer` library to make setting up the connection easy


## How

<!-- On the host side, RemotePlayer is a subclass of Player that uses WebRTC to coordinate making choices with the other computer

On the remote side, it is event driven, either we receives a request to choose from some players or cards, or we receive a serialized version of the game state. -->

All the game logic runs on one computer (the host), the remote players simply react and render

We use inheritance hierarchies to make the decision making functions overridable.

We made sure to store all state within Player and Card objects, and make rendering a pure function of state.  

<!-- ##
<video data-autoplay controls=1>
  <source src="./StartingAGame.webm">
          data-external="1" type="video/webm">
  </source>
</video> -->

##
<video data-autoplay controls=1>
  <source src="./PlayingWith2Tabs2.webm">
          data-external="1" type="video/webm">
  </source>
</video>

# Thank you for Listening

we will publish the game to github.io soon :)