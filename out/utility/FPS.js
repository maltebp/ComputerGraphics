/**
 * Just a simple set of utility function keep track of the frame rate
 * The framerate is update into the paragraph element given in the
 * textElement variable.
 */
var FPS;
(function (FPS) {
    const UPDATE_FREQ = 250;
    FPS.textElement = null;
    var frameTimes = [];
    var frameCount = 0;
    var isFirst = true;
    var lastTime = 0;
    var updateCooldown = UPDATE_FREQ;
    function registerFrame() {
        frameCount++;
        var newTime = Date.now();
        if (isFirst) {
            isFirst = false;
        }
        else {
            let timeDiff = newTime - lastTime;
            updateCooldown -= timeDiff;
            if (updateCooldown <= 0) {
                if (FPS.textElement != null) {
                    FPS.textElement.innerHTML = "FPS: " + (frameCount / (UPDATE_FREQ / 1000));
                }
                updateCooldown += UPDATE_FREQ;
                frameCount = 0;
            }
        }
        lastTime = newTime;
    }
    FPS.registerFrame = registerFrame;
})(FPS || (FPS = {}));
