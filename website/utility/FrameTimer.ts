namespace Util {

    /**
     * Timer which calculates time steps and FPS, and updates 
     * a provided text element with the current FPS.
     */
    export class FrameTimer {
        
        private static UPDATE_FREQ = 250;

        private textElement: HTMLParagraphElement = null;

        private frameCount: number = 0;
        private lastTime = 0;
        private updateCooldown = FrameTimer.UPDATE_FREQ;

        constructor(textElementId: string) {
            this.textElement = <HTMLParagraphElement>document.getElementById(textElementId);
            this.lastTime = Date.now();            
        }

            
        /**
         * Registers a new frame in the timer, which returns the timestep
         * and recalculates the FPS
         */
        registerFrame() {
            this.frameCount++;
        
            let newTime = Date.now();
            let timeDiff = newTime - this.lastTime;
            this.updateCooldown -= timeDiff;
            
            if( this.updateCooldown <= 0 ){
                this.textElement.innerHTML = "FPS: " + (this.frameCount/(FrameTimer.UPDATE_FREQ/1000));
                this.updateCooldown += FrameTimer.UPDATE_FREQ;
                this.frameCount = 0;
            }
            this.lastTime = newTime;      
            
            return timeDiff;
        }

    }
}