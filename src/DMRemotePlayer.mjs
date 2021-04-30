import { Player } from "./DMplayer.mjs";

let MSG_COUNTER = 0;
const MSG_ACK = MSG_COUNTER++;
const MSG_NEW_GAME_START = MSG_COUNTER++;
const MSG_GAME_STATE = MSG_COUNTER++;
const MSG_PLAYER_ID = MSG_COUNTER++;
const MSG_SEL_CARD = MSG_COUNTER++;
const MSG_SEL_PLAYER = MSG_COUNTER++;
const MSG_SEL_SHIELD = MSG_COUNTER++;
const MSG_SEL_DISCARD = MSG_COUNTER++;

export function remotePlayerData(playerValues, data) {
    // Some messages intercept here (the initialize)
    playerValues.dataResolve(data);
}
export function remotePlayerConnect(playerValues) {
    playerValues.playerObject.callAndResponse();
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
        this.peer.send(JSON.stringify(msg));
        const prom = new Promise(resolve => {
            this.player.guiValues.dataResolve = resolve;
        });
        // TODO: check if the promise is an ACK? what would I even do? IDK
        return prom;
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
        return await this.callAndResponse({
            id: MSG_SEL_CARD,
            player: this.id,
        });
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(opponents) {
        await this.context.updateGameState();
        return await this.callAndResponse({
            id: MSG_SEL_PLAYER,
            opponents: opponents.map(p => p.id),
        });
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield
     */
    async selectShield(player) {
        await this.context.updateGameState();
        return await this.callAndResponse({
            id: MSG_SEL_SHIELD,
            player: player.id,
        });
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
    async selectDiscardedCard(player) {
        await this.context.updateGameState();
        return await this.callAndResponse({
            id: MSG_SEL_DISCARD,
            player: player.id,
        });
    }
}
