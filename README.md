# COMP4451 Final Project Game

by **Anshuman Medhi** and **Dung Dinh Anh**

## Playing the game

If you got the source code from the git repo please run:
For COMP4451 submission this should already be built
```sh
npm install
npm run build # pack all the sources into dist/
```
This packs the application into `dist`

You can then run the game by opening a server that serves files from the `dist/` folder

```sh
cd dist
python3 -m http.server # or any other server
# open the page served in any browser
```
Open the page and enjoy the Game

## For development

```sh
npm run start
```
will open the page, and also automatically rebuild and reload the webpage

See `package.json` for other commands

## Resources Sources:

### Models for Player Token

https://www.shapeways.com/shops/dmworkshop

### Networking:

https://github.com/feross/simple-peer
