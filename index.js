async function splatoonDrawer() {
    const fs = require('fs');
    const Canvas = require('canvas');
    const config = require("./config.json");
    const net = require("net");
    const port = config.port;
    const host = config.ip; // change to switch's IP
    const input = config.fileName;
    let drawingWidth = 320;
    let drawingHeight = 120;
    let blackTreshold = config.blackTreshold;

    let img = await Canvas.loadImage(`./${input}`).catch(err => {
        return console.log(err);
    });
    if (!(img.width == drawingWidth && img.height == drawingHeight) || (img.width == drawingHeight && img.height == drawingWidth)) return console.log("Make sure image is 320x120 or 120x320.");

    let canvas = Canvas.createCanvas(img.width, img.height);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const conn = net.createConnection(port, host); // connect
    conn.setEncoding("utf-8"); // sends all commands as utf-8 (same as .encode())

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    conn.write("detachController \r\n"); // detach from console
    console.log("Detached controller from console.");
    await sleep(1000);
    // Reconnect
    conn.write("click A \r\n");
    console.log("Connected controller to console.");
    await sleep(1500);
    conn.write("click A \r\n");


    console.log("Starting y0 x0");
    let allPixelData = Array.from(ctx.getImageData(0, 0, img.width, img.height).data);
    let pixelsArray = [], size = 4;
    while (allPixelData.length > 0) {
        await pixelsArray.push(allPixelData.splice(0, size));
    };

    console.log(pixelsArray);
    let x = 0;
    let y = 0;
    for (pixel of pixelsArray) {
        console.log(pixel);
        if (pixel[0] + pixel[1] + pixel[2] > blackTreshold) conn.write("click A \r\n");
        conn.write("click DRIGHT \r\n");
        x++;
        if (x == img.width) {
            for (let i = 0; i < img.width; i++) {
                conn.write("click DLEFT \r\n");
            };
            conn.write("click DDOWN \r\n");
            x = 0;
            y++;
            if (y > img.height) return;
        };
    };
    return;
};
splatoonDrawer();