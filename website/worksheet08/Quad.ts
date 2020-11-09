

namespace Sheet8 {
    
    export class Quad {
        private position: number[];
        private corners: number[][];
        private textureIndex: number;
        private vertices: Float32Array;

        /**
         * @param position The position of the quad in world space
         * @param corners Coordinates of the 4 corners of the quad relative to its position
         * @param textureIndex Which texture it should use
         */
        constructor( position: number[], corners: number[][], textureIndex: number, ) {
            if( position.length != 3 )
                throw "Quad position must be array of length 3"
            if( corners.length != 4 )
                throw "Quad must have 4 corners";

            this.position = position;
            this.corners = corners;
            this.textureIndex = textureIndex;    
        }

        getVertices() {
            var adjustedCorners = [
                // @ts-ignore
                add(this.position, this.corners[0]),
                // @ts-ignore
                add(this.position, this.corners[1]),
                // @ts-ignore
                add(this.position, this.corners[2]),
                // @ts-ignore
                add(this.position, this.corners[3])
            ];

            this.vertices = Util.toFloatArray(              
                adjustedCorners[0], 0, 0, this.textureIndex,
                adjustedCorners[3], 0, 1, this.textureIndex,
                adjustedCorners[1], 1, 0, this.textureIndex,
                adjustedCorners[3], 0, 1, this.textureIndex,
                adjustedCorners[2], 1, 1, this.textureIndex,
                adjustedCorners[1], 1, 0, this.textureIndex,
            );
            return this.vertices;
        }


    }

}