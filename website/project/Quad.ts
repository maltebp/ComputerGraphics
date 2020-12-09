// Position
// Width
// Height
// Rotation

namespace Project {

    export class Quad {
        
        public width: number;
        public height: number;
        public position: number[];
        public rotation: number;
        public color: Util.Color;

        // The 4 world coordinates describing this quad
        private worldPoints: number[][];
        private matrix: number[];
        private dirty = true;

        
        constructor( width: number, height: number, position: number[], rotation: number, color: Util.Color) {
            this.position = position;
            this.width = width;
            this.height = height;
            this.rotation = rotation;
            this.color = color;
        }


        /**
         * @returns The model matrix to transform the coordinates corner coordinates (-1,-1)
         *          (-1,1), (1,-1) and (1,1) to world coordinates
         */
        getMatrix() {
            if( this.dirty ) this.clean();
            return this.matrix;
        }


        getPoints(){
            if( this.dirty ) this.clean();
            return this.worldPoints;
        }
        
        
        private clean(){
            // @ts-ignore
            let scaling = mat3(
                this.width/2.0,               0, 0,
                             0, this.height/2.0, 0,
                             0,               0, 1
            );

            // @ts-ignore
            let radianRotation = radians(this.rotation); 
            
            // @ts-ignore
            let rotation = mat3(
                Math.cos(radianRotation), -Math.sin(radianRotation), 0,
                Math.sin(radianRotation),  Math.cos(radianRotation), 0,
                                        0,                         0, 1
            );

            // @ts-ignore
            let translation = mat3(
                1, 0, this.position[0],
                0, 1, this.position[1],
                0, 0,                1
            );

            // @ts-ignore
            this.matrix = mult(translation, mult(rotation, scaling));

            this.worldPoints = [
                //@ts-ignore
                vec2(mult(this.matrix, vec3(-1,-1, 1))),
                //@ts-ignore
                vec2(mult(this.matrix, vec3( 1,-1, 1))),
                //@ts-ignore
                vec2(mult(this.matrix, vec3( 1, 1, 1))),
                //@ts-ignore
                vec2(mult(this.matrix, vec3(-1, 1, 1))),
            ]
            

            this.dirty = false;
        }

    }


}