import Peer from "simple-peer";
import { createPeer } from "./p2p";
import { Base64 } from "js-base64";

const body = `
    <p>From the Host click Copy Token, and then paste somewhere to send the token to your friend</p>
    <p>From the received, click Enter Token after having copied the token from your friend, this writes your reply token to your clipboard, send it back</p>
    <p>The Host should enter token with the reply token from the receiver</p>
    <p>After the page says connected you should be able to send and receive messages throuhg the textbox (use submit)</p>
    <style>
        #outgoing {
            width: 600px;
            word-wrap: break-word;
            white-space: normal;
        }
    </style>
    <form id="connect">
        <textarea id="incoming"></textarea>
        <button  id="in">Enter Token</button>
        <button  id="out">Copy Token</button>
        <button type="submit"  id="send">Send</button>
    </form>
    <pre id="outgoing"></pre>
`;
document.body.innerHTML = body;

const initiator = location.hash === "#1";

const { peer, signalOut, connected } = createPeer(
    new Promise(resolve => {
        document.querySelector("#connect #in").addEventListener("click", ev => {
            ev.preventDefault();
            if (document.querySelector("#incoming").value) {
                const code = document.querySelector("#incoming").value;
                const signal = Base64.decode(code);
                resolve(signal);
            } else {
                navigator.clipboard.readText().then(code => {
                    document.querySelector("#incoming").value = code;
                    const signal = Base64.decode(code);
                    resolve(signal);
                });
            }
        });
    }),
    initiator
);
connected.then(peer => {
    document.querySelector("#outgoing").textContent = "connected";
});
signalOut.then(signal => {
    const code = Base64.encode(signal);
    document.querySelector("#outgoing").textContent = code;
    navigator.clipboard.writeText(code);
});
document.querySelector("#connect #out").addEventListener("click", ev => {
    ev.preventDefault();
    const signal = document.querySelector("#outgoing").textContent;
    navigator.clipboard.writeText(signal);
});
peer.on("data", data => {
    document.querySelector("#outgoing").textContent = data;
});
document.querySelector("#connect").addEventListener("submit", ev => {
    ev.preventDefault();
    const text = document.querySelector("#incoming").value;
    console.log("sending message");
    console.log(text);
    peer.send(text);
});

function demo() {
    const p = new Peer({
        initiator: location.hash === "#1",
        trickle: false,
    });

    p.on("error", err => console.log("error", err));

    p.on("signal", data => {
        const signal = JSON.stringify(data);
        console.log("SIGNAL", signal);
        document.querySelector("#outgoing").textContent = signal;
        navigator.clipboard.writeText(signal);
    });

    document.querySelector("#connect #in").addEventListener("click", ev => {
        ev.preventDefault();
        navigator.clipboard.readText().then(signal => {
            document.querySelector("#incoming").value = signal;
            p.signal(JSON.parse(signal));
        });
    });
    document.querySelector("#connect #out").addEventListener("click", ev => {
        ev.preventDefault();
        const signal = document.querySelector("#outgoing").textContent;
        navigator.clipboard.writeText(signal);
    });
    document.querySelector("#connect").addEventListener("submit", ev => {
        ev.preventDefault();
        const text = document.querySelector("#incoming").value;
        console.log("sending message");
        console.log(text);
        p.send(text);
    });

    p.on("connect", () => {
        console.log("CONNECT");
        p.send("whatever" + Math.random());
    });

    p.on("data", data => {
        document.querySelector("#outgoing").textContent = data;
    });
}
