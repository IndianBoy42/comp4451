import { addRemotePlayer } from "./3dgame.js";
import { Player } from "./DMplayer.mjs";
import { characterMap } from "./characters/characters.mjs";

let MSG_COUNTER = 0;
export const MSG_ACK = MSG_COUNTER++;
export const MSG_NEW_GAME_START = MSG_COUNTER++;
export const MSG_GAME_STATE = MSG_COUNTER++;
export const MSG_PLAYER_ID = MSG_COUNTER++;
export const MSG_SEL_CARD = MSG_COUNTER++;
export const MSG_SEL_PLAYER = MSG_COUNTER++;
export const MSG_SEL_SHIELD = MSG_COUNTER++;
export const MSG_SEL_DISCARD = MSG_COUNTER++;
export const MSG_CHAR_CONNECT = MSG_COUNTER++;
export const MSG_ERROR_SEL = MSG_COUNTER++;
export const MSG_CHOSEN = MSG_COUNTER++;

export function remotePlayerData(playerValues, datau8) {
    // Some messages intercept here (the initialize)
    const data = JSON.parse(datau8);
    console.log("remotePlayerData", data);
    switch (data.id) {
        case MSG_CHAR_CONNECT:
            {
                const char = characterMap[data.class];
                addRemotePlayer(playerValues, data.name, new char());
            }
            break;

        case MSG_ERROR_SEL:
            console.error(
                "Error in selection, sent a choose cards msg to the wrong peer/player"
            );
            break;

        default:
            if (playerValues.dataResolve) playerValues.dataResolve(data);
            break;
    }
}
export function remotePlayerConnect(playerValues) {
    // playerValues.playerObject.callAndResponse();
    // addRemotePlayer(player, "Joining...", chooseCharacter());
}

// The host uses this
export class RemotePlayer extends Player {
    constructor(values, name, character, context, isClone = false) {
        super(name, character, context, isClone);
        this.guiValues = values;
        values.playerObject = this;
        this.peer = values.peer;
    }

    callAndResponse(msg) {
        try {
            console.log("callAndResponse", msg);
            this.peer.send(JSON.stringify(msg));
            const prom = new Promise(resolve => {
                this.guiValues.dataResolve = resolve;
            });
            // TODO: check if the promise is an ACK? what would I even do? IDK
            return prom;
        } catch (error) {
            // Probably peer not connected yet, just ignore it
            console.error(error);
            // IDK what I should return
            return new Promise(resolve => resolve(null));
        }
    }
    sendPlayerID() {
        return this.callAndResponse({
            id: MSG_PLAYER_ID,
            player: this.id,
        });
    }
    newGameStart() {
        super.newGameStart();
        const msg = { id: MSG_NEW_GAME_START, game: this.context.encode() };
        return [this.callAndResponse(msg)];
    }
    updateGameState() {
        super.updateGameState();
        const msg = { id: MSG_GAME_STATE, game: this.context.encode() };
        return [this.callAndResponse(msg)];
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        await this.context.updateGameState();
        let resp = await this.callAndResponse({
            id: MSG_SEL_CARD,
            player: this.id,
        });
        if (resp.id != MSG_CHOSEN) {
            console.error("Received an invalid reply to select()");
            return null;
        }
        return resp.chosen;
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(opponents) {
        await this.context.updateGameState();
        let resp = await this.callAndResponse({
            id: MSG_SEL_PLAYER,
            opponents: opponents.map(p => p.id),
        });
        if (resp.id != MSG_CHOSEN) {
            console.error("Received an invalid reply to select()");
            return null;
        }
        return resp.chosen;
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield
     */
    async selectShield(player) {
        await this.context.updateGameState();
        let resp = await this.callAndResponse({
            id: MSG_SEL_SHIELD,
            player: player.id,
        });
        if (resp.id != MSG_CHOSEN) {
            console.error("Received an invalid reply to select()");
            return null;
        }
        return resp.chosen;
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
    async selectDiscardedCard(player) {
        await this.context.updateGameState();
        let resp = await this.callAndResponse({
            id: MSG_SEL_DISCARD,
            player: player.id,
        });
        if (resp.id != MSG_CHOSEN) {
            console.error("Received an invalid reply to select()");
            return null;
        }
        return resp.chosen;
    }
}
