
namespace Project {

    export class Camera2D {

        private position: number[];
        private screenSize: number[];
        private matrix: number[];
        private dirty = true;

        constructor(screensize, position) {
            this.screenSize = [screensize[0], screensize[1]];
            this.position = [position[0], position[1]];
        }


        getMatrix() {
            if( this.dirty ){

                let translation;
                // @ts-ignore
                translation = mat3( [1, 0, -this.position[0]], [0, 1, -this.position[1]], [0, 0, 1] );

                let projection;
                // @ts-ignore
                projection = mat3( [2/this.screenSize[0], 0, 0], [0, 2/this.screenSize[1], 0], [0, 0, 1] );

                // @ts-ignore
                this.matrix = mult(projection, translation);

                this.dirty = false;
            }
            
            return this.matrix;
        }


    }

}