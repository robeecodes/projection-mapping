/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates separating people from the background with ml5.bodySegmentation.
 */

// REFERENCE: bodySegmentation-mask-background (ml5.js)

let bodySegmentation;
let segmentation;

let options = {
    maskType: "background",
    flipped: true,
    segmentationThreshold: 0.1,
    architecture: 'ResNet50',
    // quantBytes: 4
};

async function setupBodySegmentation(video) {
    bodySegmentation = await ml5.bodySegmentation("BodyPix", options);

    bodySegmentation.detectStart(video, gotResults);
}

function drawBodySegmentation(video) {
    clear();

    let img = createImage(480, 640);

    // Load the image's pixels into memory.
    img.loadPixels();

    // Set all the image's pixels to black.
    for (let x = 0; x < img.width; x += 1) {
        for (let y = 0; y < img.height; y += 1) {
            img.set(x, y, 0);
        }
    }
    // Update the image's pixel values.
    img.updatePixels();

    if (segmentation) {
        img.mask(segmentation.mask);
        image(img, 0, 0);
    }
}

// callback function for body segmentation
function gotResults(result) {
    segmentation = result;
}

export {setupBodySegmentation, drawBodySegmentation, segmentation}