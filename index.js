async function splatoonDrawer() {
    const fs = require('fs');
    const Canvas = require('canvas');
    const config = require("./config.json");
    const net = require("net");
    const port = config.port;
    const host = config.ip; // change to switch's IP
    const input = config.fileName;
    const layout = config.layout; // 0 = horizontal | 1 = vertical
    let drawingWidth = 320;
    let drawingHeight = 120;
    let blackTreshold = config.blackTreshold;
    if (layout == 1) {
        drawingWidth = 120;
        drawingHeight = 320;
    };

    let img = await Canvas.loadImage(`./${input}`).catch(err => {
        return console.log(err);
    });

    let canvas = Canvas.createCanvas(img.width, img.height);
    let ctx = canvas.getContext('2d');
    const conn = net.createConnection(port, host); // connect
    conn.setEncoding("utf-8"); // sends all commands as utf-8 (same as .encode())
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    conn.write("detachController \r\n"); // detach from console
    console.log("Detached controller from console.");
    // Reconnect
    conn.write("click A \r\n");
    console.log("Connected controller to console.");
    await sleep(1000);
    conn.write("click A \r\n");

    let pixelData;
    let x = 0;
    let y = 0;
    console.log("Starting y0 x0");
    pixelData = ctx.getImageData(0, 0, drawingWidth, drawingHeight).data;
    console.log(pixelData)
    return;
    // draw(conn, pixelData, blackTreshold);
    // await for (y = 0; y < drawingHeight; y++) {
    //     if (x > 0) {
    //         console.log("Resetting cursor to x0 and moving down.");
    //         await for (i = 0; i < drawingWidth; i++) {
    //             conn.write("click DLEFT \r\n");
    //         };
    //         conn.write("click DDOWN \r\n");
    //         console.log(`Starting y${y} x${x}`);
    //     };
    //     await for (x = 0; x < drawingWidth; x++) {
    //         pixelData = ctx.getImageData(x, y, 1, 1).data;
    //         draw(conn, pixelData, blackTreshold);
    //         conn.write("click DRIGHT \r\n");
    //     };
    // };
};
splatoonDrawer();

function draw(conn, pixelData, blackTreshold) {
    if (pixelData[0] + pixelData[1] + pixelData[2] > blackTreshold) conn.write("click A \r\n");
    return;
};