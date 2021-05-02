import { loaderProgress, loaderError } from "../gfx";
import * as THREE from "three";
const textureLoader = new THREE.TextureLoader();
const helper = name =>
    new Promise(resolve =>
        textureLoader.load(
            name,
            texture => resolve(texture),
            loaderProgress(name),
            loaderError
        )
    );
import cardText12 from "../assets/cards/cardText12.png";
export const cardTexture12 = helper(cardText12);
import cardText17 from "../assets/cards/cardText17.png";
export const cardTexture17 = helper(cardText17);
import cardText21 from "../assets/cards/cardText21.jpg";
export const cardTexture21 = helper(cardText21);
import cardText26 from "../assets/cards/cardText26.png";
export const cardTexture26 = helper(cardText26);
import cardText30 from "../assets/cards/cardText30.jpg";
export const cardTexture30 = helper(cardText30);
import cardText35 from "../assets/cards/cardText35.jpg";
export const cardTexture35 = helper(cardText35);
import cardText4 from "../assets/cards/cardText4.png";
export const cardTexture4 = helper(cardText4);
import cardText44 from "../assets/cards/cardText44.jpg";
export const cardTexture44 = helper(cardText44);
import cardText49 from "../assets/cards/cardText49.jpg";
export const cardTexture49 = helper(cardText49);
import cardText8 from "../assets/cards/cardText8.jpg";
export const cardTexture8 = helper(cardText8);
import cardText0 from "../assets/cards/cardText0.jpg";
export const cardTexture0 = helper(cardText0);
import cardText13 from "../assets/cards/cardText13.jpg";
export const cardTexture13 = helper(cardText13);
import cardText18 from "../assets/cards/cardText18.jpg";
export const cardTexture18 = helper(cardText18);
import cardText22 from "../assets/cards/cardText22.jpg";
export const cardTexture22 = helper(cardText22);
import cardText27 from "../assets/cards/cardText27.jpg";
export const cardTexture27 = helper(cardText27);
import cardText31 from "../assets/cards/cardText31.jpg";
export const cardTexture31 = helper(cardText31);
import cardText36 from "../assets/cards/cardText36.jpg";
export const cardTexture36 = helper(cardText36);
import cardText40 from "../assets/cards/cardText40.jpg";
export const cardTexture40 = helper(cardText40);
import cardText45 from "../assets/cards/cardText45.jpg";
export const cardTexture45 = helper(cardText45);
import cardText5 from "../assets/cards/cardText5.jpg";
export const cardTexture5 = helper(cardText5);
import cardText9 from "../assets/cards/cardText9.jpg";
export const cardTexture9 = helper(cardText9);
import cardText1 from "../assets/cards/cardText1.png";
export const cardTexture1 = helper(cardText1);
import cardText14 from "../assets/cards/cardText14.jpg";
export const cardTexture14 = helper(cardText14);
import cardText19 from "../assets/cards/cardText19.jpg";
export const cardTexture19 = helper(cardText19);
import cardText23 from "../assets/cards/cardText23.png";
export const cardTexture23 = helper(cardText23);
import cardText28 from "../assets/cards/cardText28.jpg";
export const cardTexture28 = helper(cardText28);
import cardText32 from "../assets/cards/cardText32.jpg";
export const cardTexture32 = helper(cardText32);
import cardText37 from "../assets/cards/cardText37.jpg";
export const cardTexture37 = helper(cardText37);
import cardText41 from "../assets/cards/cardText41.jpg";
export const cardTexture41 = helper(cardText41);
import cardText46 from "../assets/cards/cardText46.png";
export const cardTexture46 = helper(cardText46);
import cardText50 from "../assets/cards/cardText50.jpg";
export const cardTexture50 = helper(cardText50);
import cardText10 from "../assets/cards/cardText10.jpg";
export const cardTexture10 = helper(cardText10);
import cardText15 from "../assets/cards/cardText15.jpg";
export const cardTexture15 = helper(cardText15);
import cardText2 from "../assets/cards/cardText2.jpg";
export const cardTexture2 = helper(cardText2);
import cardText24 from "../assets/cards/cardText24.jpg";
export const cardTexture24 = helper(cardText24);
import cardText29 from "../assets/cards/cardText29.jpg";
export const cardTexture29 = helper(cardText29);
import cardText33 from "../assets/cards/cardText33.jpg";
export const cardTexture33 = helper(cardText33);
import cardText38 from "../assets/cards/cardText38.jpg";
export const cardTexture38 = helper(cardText38);
import cardText42 from "../assets/cards/cardText42.jpg";
export const cardTexture42 = helper(cardText42);
import cardText47 from "../assets/cards/cardText47.jpg";
export const cardTexture47 = helper(cardText47);
import cardText6 from "../assets/cards/cardText6.jpg";
export const cardTexture6 = helper(cardText6);
import cardText11 from "../assets/cards/cardText11.png";
export const cardTexture11 = helper(cardText11);
import cardText16 from "../assets/cards/cardText16.jpg";
export const cardTexture16 = helper(cardText16);
import cardText20 from "../assets/cards/cardText20.jpg";
export const cardTexture20 = helper(cardText20);
import cardText25 from "../assets/cards/cardText25.jpg";
export const cardTexture25 = helper(cardText25);
import cardText3 from "../assets/cards/cardText3.jpg";
export const cardTexture3 = helper(cardText3);
import cardText34 from "../assets/cards/cardText34.jpg";
export const cardTexture34 = helper(cardText34);
import cardText39 from "../assets/cards/cardText39.jpg";
export const cardTexture39 = helper(cardText39);
import cardText43 from "../assets/cards/cardText43.jpg";
export const cardTexture43 = helper(cardText43);
import cardText48 from "../assets/cards/cardText48.jpg";
export const cardTexture48 = helper(cardText48);
import cardText7 from "../assets/cards/cardText7.png";
export const cardTexture7 = helper(cardText7);
