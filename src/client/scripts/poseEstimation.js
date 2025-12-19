/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

// REFERENCE bodyPose-skeleton (ml5.js)

let bodyPose;
let poses = [];
let connections;
let isTree = false;


// Callback function for when bodyPose outputs data
function gotPoses(results) {
    // Save the output to the poses variable
    poses = results;
}

async function setupPoseEstimation(video) {
    // Load the bodyPose model
    bodyPose = await ml5.bodyPose();

    // Start detecting poses in the webcam video
    bodyPose.detectStart(video, gotPoses);
    // Get the skeleton connection information
    connections = bodyPose.getSkeleton();
}

function drawPoseEstimation() {
    // At least one pose
    if (poses.length > 0) {
        let pose = poses[0];

        isTree = pose.left_wrist.y < pose.nose.y && pose.right_wrist.y < pose.nose.y;
    }
}

export {setupPoseEstimation, drawPoseEstimation, isTree}