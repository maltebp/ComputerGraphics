

/**
 * 2D Camera
 */
namespace Sheet2{

    export class Camera2D {
        private screenSize: number[];
        private transform: Float32Array;
        private dirty = true;

        
        constructor(screenSize: number[]){
            this.screenSize = screenSize;
        }
    
    
        getTransform(){
            // Check if the matrix needs to be recalculated
            if( this.dirty ){

                //@ts-ignore
                var matrix = mult(
                    //@ts-ignore
                    scalem(2.0/this.screenSize[0], 2.0/this.screenSize[1], 1),

                    //@ts-ignore
                    translate(-this.screenSize[0]/2.0, -this.screenSize[1]/2.0, 0)
                );

                // @ts-ignore
                this.transform = new Float32Array(flatten(matrix));

                this.dirty = false;
            }
            return this.transform;
        }
    }
}
