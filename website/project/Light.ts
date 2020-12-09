
namespace Project {

    const LIGHT_COLLISION_SIZE = 15;

    export class Light implements Selectable{

        private position: number[];
        private radius: number;
        private color: Util.Color;

        private matrix: number[]

        private collisionPoints: number[][];

        private dirty = true;
        
        constructor(position: number[], radius: number, color: Util.Color) {
            this.position = position;
            this.radius = radius;
            this.color = color;
        }


        setPosition(position: number[]) {
            this.position = [position[0], position[1]];
            this.dirty = true;
        }


        adjustRotation(rotation: number) {
            // Doesn't have any effect on a light
        }


        getCollisionPoints() {
            if( this.dirty ) this.clean();
            return this.collisionPoints;
        }
        

        getMatrix() {
            if( this.dirty ) this.clean();
            return this.matrix;
        }
        
        getPosition() {
            return [this.position[0], this.position[1]];
        }

        setRadius(radius: number) {
            this.radius = radius;
            this.dirty = true;
        }

        getRadius() {
            return this.radius;
        }

        setColor(color: Util.Color) {
            this.color = color.copy();
        }

        getColor() {
            return this.color.copy();
        }

        private clean(){
            // TODO: Remove this
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

            // Collision box doesn't change size for a point light
            this.collisionPoints = [
                [this.position[0]-LIGHT_COLLISION_SIZE, this.position[1]-LIGHT_COLLISION_SIZE],
                [this.position[0]+LIGHT_COLLISION_SIZE, this.position[1]-LIGHT_COLLISION_SIZE],
                [this.position[0]+LIGHT_COLLISION_SIZE, this.position[1]+LIGHT_COLLISION_SIZE],
                [this.position[0]-LIGHT_COLLISION_SIZE, this.position[1]+LIGHT_COLLISION_SIZE]
            ]
            
            this.dirty = false;
        }

    }
    


}