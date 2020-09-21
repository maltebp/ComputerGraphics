

/**
 * 2D Camera
 */
class Camera {

    constructor(screenSize){
        this._dirty = true;
        this._transform = [];
        this._screenSize = screenSize;
    }
    


    getTransform(){
        // Check if the matrix needs to be recalculated
        if( this._dirty ){
            var matrix = mult(
                scalem(2.0/this._screenSize[0], 2.0/this._screenSize[1], 1),
                translate(-this._screenSize[0]/2.0, -this._screenSize[1]/2.0, 0)
            );
            this._transform = flatten(matrix);
            console.log(matrix);
            this._dirty = false;
        }
        return this._transform;
    }
}