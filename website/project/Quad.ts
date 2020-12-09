
namespace Project {

    export class Quad implements Selectable {
        
        public position: number[];

        public width: number;
        public height: number;
        
        public rotation: number;

        // Texture of this sprite
        // If null, it's just quad colored with the color below
        private texture: Util.Texture = null;

        // The tinting color of this sprite, which is multiplied to
        // the base texture.
        // If the object has no texture, it will have this color
        public color: Util.Color = Util.Color.WHITE.copy();

        // How much the object is lit up by lights
        private diffuseFactor: number = 0.80;

        // Whether or not this object should occlude lights (cause shadows)
        private occluder: boolean = true;

        // The 4 world coordinates describing this quad
        private worldPoints: number[][];
        private matrix: number[];
        private dirty = true;

        
        constructor( width: number, height: number, position: number[], rotation: number) {
            this.position = [position[0], position[1]];
            this.width = width;
            this.height = height;
            this.rotation = rotation;
        }


        setWidth(width: number){
            this.width = width;
            this.dirty = true;
        }

        getWidth(){
            return this.width;
        }


        setHeight(height: number){
            this.height = height;
            this.dirty = true;
        }

        getHeight(){
            return this.height;
        }

        
        setRotation(rotation: number){
            let newRotation = rotation % 360;
            if( newRotation < 0 ) newRotation += 360;
            this.rotation = newRotation;
            this.dirty = true;
        }

        getRotation(){
            return this.rotation;
        }


        setTexture(texture: Util.Texture){
            this.texture = texture;
        }

        getTexture() {
            return this.texture;
        }


        setDiffuseFactor(factor: number){
            if( factor < 0 ) this.diffuseFactor = 0;
            else if( factor > 1 ) this.diffuseFactor = 1;
            else this.diffuseFactor = factor;
        }

        getDiffuseFactor(){
            return this.diffuseFactor;
        }


        setOccluder(toggle: boolean){
            this.occluder = toggle;
        }

        isOccluder() {
            return this.occluder;
        }


        setColor(color: Util.Color){
            this.color = color.copy();
        }

        getColor(){
            return this.color.copy();
        }

        getPositionX(){
            return this.position[0];
        }

        getPositionY(){
            return this.position[1];
        }


        getPosition(){
            return [this.position[0], this.position[1]];
        }


        setPosition(position: number[]) {
            this.position = [position[0], position[1]];
            this.dirty = true;
        }


        adjustRotation(rotation: number) {
            let newRotation = rotation % 360;
            if( newRotation < 0 ) newRotation += 360;
            this.rotation = newRotation;
            this.dirty = true;
        }


        /**
         * @returns The model matrix to transform the coordinates corner coordinates (-1,-1)
         *          (-1,1), (1,-1) and (1,1) to world coordinates
         */
        getMatrix() {
            if( this.dirty ) this.clean();
            return this.matrix;
        }


        getPoints() {
            if( this.dirty ) this.clean();
            return this.worldPoints;
        }


        getCollisionPoints() {
            return this.getPoints();
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