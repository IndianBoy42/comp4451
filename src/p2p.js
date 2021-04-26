import Peer from "simple-peer";

/**
 *
 * @param {Promise/ReadableStream} signalIn - from this promise/stream signals are fed into the peer, so anything produced by the signalOut from the remote peer (send manually)
 * @param {*} initiator
 * @returns peer - the Peer object,
 * use peer.send to send data
 * use peer.on("data", data => {}) to receive data
 * @returns signalOut - a Promise for the token you need to signalIn() on the remote
 * @returns connected - a Promise for the event that the connection is made
 */
export function createPeer(signalIn, initiator) {
    const peer = new Peer({
        initiator: initiator,
        trickle: false,
    });

    signalIn.then(signal => peer.signal(JSON.parse(signal)));

    const connected = new Promise(resolve => {
        peer.on("connect", () => {
            console.log("CONNECT");
            resolve(peer);
        });
    });

    const signalOut = new Promise(resolve => {
        peer.on("signal", data => {
            const signal = JSON.stringify(data);
            console.log("SIGNAL", signal);
            resolve(signal);
        });
    });
    // peer.on("signal", data => {
    //     const signal = JSON.stringify(data);
    //     console.log("SIGNAL", signal);
    //     signalOut(signal);
    // });
    peer.on("error", err => {
        console.log("error", err);
    });

    return { peer, signalOut, connected };
}
