import SimplePeer from "simple-peer";
var peer1 = new SimplePeer({ initiator: true });
var peer2 = new SimplePeer();

peer1.on("signal", data => {
    // when peer1 has signaling data, give it to peer2 somehow
    peer2.signal(data);
});

peer2.on("signal", data => {
    // when peer2 has signaling data, give it to peer1 somehow
    peer1.signal(data);
});

peer1.on("connect", () => {
    // wait for 'connect' event before using the data channel
    peer1.send("hey peer2, how is it going?");
});

peer2.on("data", data => {
    // got a data channel message
    console.log("got a message from peer1: " + data);
});

// const body = `
//     <style>
//         #outgoing {
//             width: 600px;
//             word-wrap: break-word;
//             white-space: normal;
//         }
//     </style>
//     <form>
//         <textarea id="incoming"></textarea>
//         <button type="submit">submit</button>
//     </form>
//     <pre id="outgoing"></pre>
// `;
// document.body.innerHTML = body;

// const p = new SimplePeer({
//     initiator: location.hash === "#1",
//     trickle: false,
// });

// p.on("error", err => console.log("error", err));

// p.on("signal", data => {
//     console.log("SIGNAL", JSON.stringify(data));
//     document.querySelector("#outgoing").textContent = JSON.stringify(data);
// });

// document.querySelector("form").addEventListener("submit", ev => {
//     ev.preventDefault();
//     p.signal(JSON.parse(document.querySelector("#incoming").value));
// });

// p.on("connect", () => {
//     console.log("CONNECT");
//     p.send("whatever" + Math.random());
// });

// p.on("data", data => {
//     console.log("data: " + data);
// });
