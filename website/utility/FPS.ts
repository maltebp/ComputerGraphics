
/**
 * Just a simple set of utility function keep track of the frame rate
 * The framerate is update into the paragraph element given in the 
 * textElement variable.
 */
namespace FPS {

    const UPDATE_FREQ = 250;

    export var textElement: HTMLParagraphElement = null;
    var frameTimes: number[] = [];

    var frameCount: number = 0;

    var isFirst = true;

    var lastTime = 0;

    var updateCooldown = UPDATE_FREQ;

    export function registerFrame(){
        frameCount++;
        
        var newTime = Date.now();
        
        if( isFirst ){
            isFirst = false;
        }else {
            let timeDiff = newTime - lastTime;
            updateCooldown -= timeDiff;
            if( updateCooldown <= 0 ){
                if( textElement != null ){
                    textElement.innerHTML = "FPS: " + (frameCount/(UPDATE_FREQ/1000));
                }
                updateCooldown += UPDATE_FREQ;
                frameCount = 0;
            }
        }

        lastTime = newTime;
    }
}