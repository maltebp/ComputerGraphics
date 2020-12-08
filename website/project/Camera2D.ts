
namespace Project {

    export class Camera2D {

        private position: number[];
        private zoom = 0;
        private screenSize: number[];

        private matrix: number[];
        private matrixInverse: number[];
        private dirty = true;


        constructor(screensize, position) {
            this.screenSize = [screensize[0], screensize[1]];
            this.position = [position[0], position[1]];
        }

        getMatrix(inversed = false) {
            if( this.dirty ){

                // @ts-ignore
                let translationMatrix = mat3( [1, 0, -this.position[0]], [0, 1, -this.position[1]], [0, 0, 1] );


                let zoomFactor = this.zoom < 0 ? -1 / (this.zoom-1) : this.zoom + 1;
                // @ts-ignore
                let zoomMatrix = mat3(
                        zoomFactor,          0,  0,
                                 0, zoomFactor,  0,
                                 0,          0,  1
                    );

                // @ts-ignore
                let projectionMatrix = mat3( [2/this.screenSize[0], 0, 0], [0, 2/this.screenSize[1], 0], [0, 0, 1] );

                // @ts-ignore
                this.matrix = mult(projectionMatrix, mult(zoomMatrix, translationMatrix));

                // @ts-ignore
                this.matrixInverse = inverse(this.matrix);

                this.dirty = false;
            }

            if( inversed )
                return this.matrixInverse;
            
            return this.matrix;
        }




    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Setters and adjusters

        adjustPosition(x: number, y: number){
            this.position[0] += x;
            this.position[1] += y;
            this.dirty = true;
        }

        adjustZoom(amount: number){
            this.zoom += amount;
            this.dirty = true;
        }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Getters for camera data

        getPosition() {
            return [this.position[0], this.position[1]];
        }

        getPositionX() {
            return this.position[0];
        }

        getPositionY() {
            return this.position[1];
        }

        getScreenWidth() {
            return this.screenSize[0];
        }

        getScreenHeight() {
            return this.screenSize[1];
        }

    }

}