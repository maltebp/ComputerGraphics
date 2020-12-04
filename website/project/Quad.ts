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

        
        constructor( width: number, height: number, position: number[], rotation: number, color: Util.Color) {
            this.position = position;
            this.width = width;
            this.height = height;
            this.rotation = rotation;
            this.color = color;
        }      
    }


}