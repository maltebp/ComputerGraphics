
namespace Project {

    export class Light {

        private position: number[];
        private radius: number;
        private color: Util.Color;

        private matrix: number[]

        private dirty = true;
        
        constructor(position: number[], radius: number, color: Util.Color) {
            this.position = position;
            this.radius = radius;
            this.color = color;
        }


        getMatrix() {
            // TODO: Remove this
            if( this.dirty ){
                
                //@ts-ignore
                this.matrix = mult(
                    //@ts-ignore
                    mat3(
                        1, 0, this.position[0],
                        0, 1, this.position[1],
                        0, 0,                1
                    ),
                    // @ts-ignore
                    mat3(
                        this.radius,           0, 0,
                                  0, this.radius, 0,
                                  0,           0, 1
                    )
                );
                
                this.dirty = false;
            }
            return this.matrix;
        }
        
        getPosition() {
            return [this.position[0], this.position[1]];
        }

        getRadius() {
            return this.radius;
        }

        getColor() {
            return this.color.copy();
        }

    }
    


}