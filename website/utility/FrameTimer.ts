namespace Util {

    /**
     * Timer which calculates time steps and FPS, and updates 
     * a provided text element with the current FPS.
     */
    export class FrameTimer {
        
        private textElement: HTMLParagraphElement = null;
        
        private updateFrequency: number; 
        private updateCooldown: number;

        private frameCount: number = 0;
        private lastTime = 0;


        /**
         * Constructs a new FrameTimer, which calculates time steps and FPS, and updates a given text
         * element with the calculated fps
         * 
         * @param textElementId Id of the HTML element which should display the FPS 
         * @param updateFrequency How often the FPS should be updated in the given text element (seconds)
         */
        constructor(textElementId: string, updateFrequency = 0.250) {
            this.textElement = <HTMLParagraphElement>document.getElementById(textElementId);
            this.lastTime = Date.now() / 1000;
            this.updateFrequency = updateFrequency;
            this.updateCooldown = this.updateFrequency;            
        }

            
        /**
         * Registers a new frame in the timer. This make it recalculate the FPS.
         * 
         * @return  Time since last frame in seconds
         */
        registerFrame() {
            this.frameCount++;
        
            let newTime = Date.now() / 1000;
            let timeDiff = newTime - this.lastTime;
            this.updateCooldown -= timeDiff;
            
            if( this.updateCooldown <= 0 ){
                this.textElement.innerHTML = "FPS: " + (this.frameCount/this.updateFrequency);
                this.updateCooldown += this.updateFrequency;
                this.frameCount = 0;
            }
            this.lastTime = newTime;      
            
            return timeDiff;
        }

    }
}