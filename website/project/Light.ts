
namespace Project {

    export class Light {

        private position: number;
        private radius: number;
        private color: Util.Color;

        
        constructor(position: number, radius: number, color: Util.Color) {
            this.position = position;
            this.radius = radius;
            this.color = color;
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