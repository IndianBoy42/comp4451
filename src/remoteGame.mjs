import { currentGame } from "./3dgame.js";
import {
    MSG_ACK,
    MSG_NEW_GAME_START,
    MSG_GAME_STATE,
    MSG_PLAYER_ID,
    MSG_SEL_CARD,
    MSG_SEL_PLAYER,
    MSG_SEL_SHIELD,
    MSG_SEL_DISCARD,
    MSG_CHAR_CONNECT,
    MSG_ERROR_SEL,
    MSG_CHOSEN,
} from "./DMRemotePlayer.mjs";

function send(msg) {
    console.log("remoteGameSend", msg);
    currentGame.peer.send(JSON.stringify(msg));
}

let currentPlayer;
function getPlayer(id) {
    return currentGame.players[id - 1];
}

function sendChoice(idx) {
    send({ id: MSG_CHOSEN, chosen: idx });
}
export async function remoteGameData(gameValues, datau8) {
    const data = JSON.parse(datau8);
    console.log("remoteGameData", data);
    switch (data.id) {
        case MSG_NEW_GAME_START:
        // The same for now, idk if I even need this?
        case MSG_GAME_STATE:
            currentGame.decode(data.game);
            currentGame.updateGameState();
            if (currentPlayer) {
                for (const player of currentGame.players) {
                    player.handHideShow(player.id != currentPlayer.id);
                }
            }
            break;

        case MSG_PLAYER_ID:
            currentPlayer = getPlayer(data.player);
            for (const player of currentGame.players) {
                player.handHideShow(player.id != currentPlayer.id);
            }
            // TODO: Make camera see from this perspective.
            break;

        case MSG_SEL_CARD:
            if (data.player != currentPlayer.id) {
                // weird...
                console.error("Choose a card sent to wrong player");
                send({
                    id: MSG_ERROR_SEL,
                    data: data,
                });
            }
            sendChoice(await currentPlayer.selectCard());
            return;

        case MSG_SEL_PLAYER:
            sendChoice(
                await currentPlayer.selectPlayer(data.opponents.map(getPlayer))
            );
            return;

        case MSG_SEL_SHIELD:
            sendChoice(await currentPlayer.selectShield(getPlayer(data.id)));
            return;

        case MSG_SEL_DISCARD:
            sendChoice(
                await currentPlayer.selectDiscardedCard(getPlayer(data.id))
            );
            return;

        default:
            break;
    }
    send({ id: MSG_ACK, ack: data.id });
}
export async function remoteGameLoop(game) {}
export function remoteGameConnect(gameValues) {
    currentGame.guiValues = gameValues;
    currentGame.peer = gameValues.peer;

    send({
        id: MSG_CHAR_CONNECT,
        name: gameValues.name,
        class: gameValues.class,
    });
}
