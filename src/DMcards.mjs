import { Shield, DamagingShield } from "./DMshields.mjs";
import * as GFX from "./gfx.js";
import { addToAllCards } from "./cards/cards.mjs";

export class DMCard {
    constructor(
        name,
        shieldValue = 0,
        healValue = 0,
        dmgValue = 0,
        extraActions = 0,
        drawCards = 0,
        extraPowers = [],
        dummyCard = false
    ) {
        this.name = name;
        this.shieldValue = shieldValue;
        this.healValue = healValue;
        this.dmgValue = dmgValue;
        this.extraActions = extraActions;
        this.drawCards = drawCards;
        this.extraPowers = extraPowers;
        if (!dummyCard) addToAllCards(this);

        // this.modelInWorld.canvas= document.createElement("canvas");
        // this.modelInWorld.context= canvas.getContext("2d");
        // this.modelInWorld.texture= new THREE.Texture(canvas);
    }

    setFrontTexture(f) {
        this.frontTexture = f;
        return this;
    }
    async frontTexture() {
        if (this.modelInWorld.texture.isDummyTextTexture)
            GFX.setCardObjectText(
                this.modelInWorld.canvas,
                this.modelInWorld.context,
                this.modelInWorld.texture,
                this.getCardText(),
                "#00ff00"
            );
        return {
            // texture: this.modelInWorld.texture,
        };
    }
    setBackTexture(f) {
        this.backTexture = f;
        return this;
    }
    async backTexture() {
        if (this.modelInWorld.texture.isDummyTextTexture) {
            console.log("backTexture dummy text");
            GFX.setCardObjectText(
                this.modelInWorld.canvas,
                this.modelInWorld.context,
                this.modelInWorld.texture,
                this.getCardText(),
                "#000000"
            );
        }
        return {
            // texture: this.modelInWorld ? this.modelInWorld.texture : null,
        };
    }
    async hideShow(hidden) {
        // console.trace("hideShow");
        if (hidden) {
            // FIXME: hiding cards in local mode is broken?
            const tex = await this.backTexture();
            GFX.renderCard(this.modelInWorld.children[0], tex);
            GFX.renderCard(this.modelInWorld.children[1], tex);
        } else {
            const backTex = await this.backTexture();
            const tex = await this.frontTexture();
            GFX.renderCard(this.modelInWorld.children[0], tex);
            GFX.renderCard(this.modelInWorld.children[1], backTex);
        }
        // const backTex = await this.backTexture();
        // const tex = hidden ? backTex : await this.frontTexture();
        // GFX.renderCard(this.modelInWorld.children[0], tex);
        // GFX.renderCard(this.modelInWorld.children[1], backTex);
        // if (tex.texture && tex.texture != this.modelInWorld.texture) {
        //     this.modelInWorld.texture = tex.texture;
        //     this.modelInWorld.children[0].material.map = tex.texture;
        //     tex.texture.needsUpdate = true;
        //     this.modelInWorld.children[0].material.needsUpdate = true;
        // }
        // if (tex.uvCorners) {
        //     this.modelInWorld.children[0].geometry.attributes.uv.set(
        //         uvFromCorner(tex.uvCorners)
        //     );
        //     this.modelInWorld.children[0].geometry.attributes.uv.needsUpdate = true;
        // }
        // if (tex.uvCoords) {
        //     console.trace(tex.uvCoords);
        //     this.modelInWorld.children[0].geometry.attributes.uv.set(
        //         tex.uvCoords
        //     );
        //     this.modelInWorld.children[0].geometry.attributes.uv.needsUpdate = true;
        // }
    }

    // encode() {
    //     return {
    //         name: this.name,
    //         shieldValue: this.shieldValue,
    //         healValue: this.healValue,
    //         dmgValue: this.dmgValue,
    //         extraActions: this.extraActions,
    //         drawCards: this.drawCards,
    //         extraPowers: this.extraPowers.map(power => power.encode()),
    //     };
    // }
    // decode(obj) {
    //     this.name = obj.name;
    //     this.shieldValue = obj.shieldValue;
    //     this.healValue = obj.healValue;
    //     this.dmgValue = obj.dmgValue;
    //     this.extraActions = obj.extraActions;
    //     this.drawCards = obj.drawCards;
    //     this.extraPowers.push(
    //         ...obj.extraPowers.map(pow => new allPowers[pow.id](pow.amount))
    //     );
    // }
    encode() {
        return {
            indexInAllCards: this.indexInAllCards,
        };
    }

    /**
     * Clone the card
     * @returns A cloned card
     */
    clone() {
        let clone = new DMCard(
            this.name,
            this.shieldValue,
            this.healValue,
            this.dmgValue,
            this.extraActions,
            this.drawCards,
            this.extraPowers.slice(0),
            false
        );
        return clone;
    }

    static shieldCard(name, amount) {
        return new DMCard(name, amount, 0, 0, 0, 0);
    }
    static healCard(name, amount) {
        return new DMCard(name, 0, amount, 0, 0, 0);
    }
    static damageCard(name, amount) {
        return new DMCard(name, 0, 0, amount, 0, 0);
    }
    static actionCard(name, amount) {
        return new DMCard(name, 0, 0, 0, amount, 0);
    }
    static drawCardsCard(name, amount) {
        return new DMCard(name, 0, 0, 0, 0, amount);
    }
    static powerCard(name, power, extraPowers = []) {
        return new DMCard(name, 0, 0, 0, 0, 0, [power].concat(extraPowers));
    }

    addHeal(amount) {
        this.healValue = amount;
        return this;
    }
    addShield(amount) {
        this.shieldValue = amount;
        return this;
    }
    addDamage(amount) {
        this.dmgValue = amount;
        return this;
    }
    addActions(amount) {
        this.extraActions = amount;
        return this;
    }
    addDrawCards(amount) {
        this.drawCards = amount;
        return this;
    }
    addMightyPower(power) {
        this.extraPowers.push(power);
        return this;
    }

    getCardText() {
        return (
            this.name +
            (this.shieldValue > 0 ? ", shield=" + this.shieldValue : "") +
            (this.healValue > 0 ? ", heal=" + this.healValue : "") +
            (this.dmgValue > 0 ? ", dmg=" + this.dmgValue : "") +
            (this.extraActions > 0 ? ", extra=" + this.extraActions : "") +
            (this.drawCards > 0 ? ", draw=" + this.drawCards : "") +
            " " +
            (this.extraPowers.length === 0
                ? ""
                : this.extraPowers[0].constructor.name)
        );
    }

    /**
     * Play the card
     *
     * @param {*} player The object of the player playing this card rn
     * See DMplayer.mjs
     * @param {*} context A object that gives access to the game context (players etc)
     * See DMgame.mjs
     */
    async play(player, context) {
        //debug
        if (!player.isClone)
            console.log("" + player.name + " plays " + this.name);

        let discard = true;
        player.character.actionsLeft -= 1;
        for (const p of this.extraPowers) {
            await p.play(player, context);
            // special cases
            if (p.constructor.name === "GelCubeDmgShield") {
                this.shieldObj = new DamagingShield(3, 2);
                player.addShield(this);
                discard = false;
            }
            if (p.constructor.name === "RogueImmune") {
                GFX.moveCardToShields(
                    this,
                    player,
                    player.character.shields.length
                );
                discard = false;
                player.character.startTurnCallbacks.push(() => {
                    player.disCard(this);
                });
            }
            if (p.constructor.name === "DruidShapeshiftBear" || p.constructor.name === "DruidShapeshiftWolf") {
                GFX.moveCardToShields(
                    this,
                    player,
                    player.character.shields.length
                );
                discard = false;
                // discard old form card
                if (player.character.formCard != null) {
                    player.disCard(player.character.formCard);
                }
                player.character.formCard = this;
            }
        }
        if (this.shieldValue != 0) {
            this.shieldObj = new Shield(this.shieldValue);
            player.addShield(this);
            discard = false;
        }
        if (discard) player.disCard(this);
        if (this.healValue != 0) {
            player.character.heal(this.healValue);
        }
        if (this.extraActions != 0) {
            player.addExtraAction(this.extraActions);
        }
        if (this.dmgValue != 0) {
            let targets = [];
            if (player.multiAttack) {
                targets = context.allAliveOpponents(player);
            } else {
                targets = await context.choosePlayer(player);
            }
            player.character.doDamage(targets, this.dmgValue);
        }
        if (this.drawCards != 0) {
            player.drawCards(this.drawCards);
        }
        if (player.hand.length === 0) {
            player.drawCards(2);
        }
    }
}
