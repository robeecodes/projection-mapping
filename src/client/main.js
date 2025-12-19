import {setupBodySegmentation, drawBodySegmentation, segmentation} from "./scripts/bodySegmentation.js";
import {drawPoseEstimation, isTree, setupPoseEstimation} from "./scripts/poseEstimation";
import {initSpeed, showTransition} from "./scripts/routes.js";

let video, cnv, treeMask, isPaused, currentMask, newMask = false;
let targetPositions = [];
let morphAmount = 0;

let treeHeldTimer = 0;
let transitioning = false;

async function setup() {
    // Ensure speed is set to 1 in resolume
    await initSpeed();

    pixelDensity(1);
    frameRate(60);

    cnv = createCanvas(480, 640);

    // Create the video and hide it
    video = createCapture(VIDEO, {
        flipped: true
    });
    video.size(480, 640);
    video.hide();

    // Setup pose estimation
    await setupPoseEstimation(video);
    // Setup background removal
    await setupBodySegmentation(video);

    treeMask = await loadImage("/tree.webp");
    treeMask.resize(480, 640);
    initTargetPositions();
}

function draw() {
    if (isTree && !isPaused) {
        treeHeldTimer++;
        if (treeHeldTimer >= 75) {
            isPaused = true
        }
    } else {
        treeHeldTimer = 0;
    }

    drawPoseEstimation();

    if (!isPaused) {
        // Draw the video
        drawBodySegmentation(video);

        if (segmentation) currentMask = segmentation.mask;

        morphAmount = 0;

        filter(BLUR, 2);
    } else {
        morphAmount += 0.05;
        if (morphAmount <= 1 && !transitioning) maskMorph(morphAmount);

        if (morphAmount > 2 && !transitioning) {
            transitioning = true;
            morphAmount = 0;
            showTransition().then(
                () => {
                    setTimeout(() => {
                        isPaused = false;
                        transitioning = false;
                    }, 2000);
                }
            )
        }
        treeHeldTimer = 0;
    }
}

function initTargetPositions() {
    treeMask.loadPixels();

    for (let y = 0; y < treeMask.height; y++) {
        for (let x = 0; x < treeMask.width; x++) {
            let index = (x + y * treeMask.width) * 4;
            let a = treeMask.pixels[index + 3];
            // Store positions where the alpha is greater than 0
            if (a > 0) {
                targetPositions.push({x: x, y: y});
            }
        }
    }
}

// Updating Pixel Array REFERENCE: The Coding Train (2016)
function maskMorph(morphAmount) {
    clear();
    currentMask.loadPixels();

    newMask = createImage(currentMask.width, currentMask.height);
    newMask.loadPixels();

    let newPixels = new Uint8ClampedArray(treeMask.pixels.length);

    // Create an array of current positions for pixels in currentMask
    let currentPositions = [];
    for (let y = 0; y < currentMask.height; y++) {
        for (let x = 0; x < currentMask.width; x++) {
            let index = (x + y * currentMask.width) * 4;
            let a = currentMask.pixels[index + 3]; // Current mask alpha
            if (a > 0) {
                currentPositions.push({x: x, y: y});
            }
        }
    }

    // Ensure the position arrays are equal in size
    // let minLength = Math.min(currentPositions.length, targetPositions.length);

    let divFactor = Math.ceil(targetPositions.length / currentPositions.length);

    let currPosIdx = 0;

    for (let i = 0; i < targetPositions.length; i++) {

        if (i % divFactor === 0) currPosIdx++;

        if (currPosIdx >= currentPositions.length) continue;

        let targetPos = targetPositions[i];
        let currPos = currentPositions[currPosIdx];

        // Calculate new positions based on lerping
        let newX = Math.round(lerp(currPos.x, targetPos.x, morphAmount));
        let newY = Math.round(lerp(currPos.y, targetPos.y, morphAmount));

        // Check for collisions and find next available position
        let newPixelIndex = (newX + newY * currentMask.width) * 4;

        newPixels[newPixelIndex] = 0;
        newPixels[newPixelIndex + 1] = 0;
        newPixels[newPixelIndex + 2] = 0;
        newPixels[newPixelIndex + 3] = 255;
    }

    newMask.pixels.set(newPixels);
    newMask.updatePixels();


    // Draw the current mask
    image(newMask, 0, 0);
}


function keyPressed() {
    if (key === 'p') {
        isPaused = !isPaused; // Toggle pause
    }
}

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;