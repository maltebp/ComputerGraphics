namespace Sheet10.Part2 {

    export class QuaternionCamera extends Util.Camera {

        protected screenSize: number[];
        protected target: number[];
        protected fov: number;
        protected direction: number[];

        protected rotation: Quaternion;
        protected up: number[];

        constructor(screenSize: number[], target: number[], initialEye: number[], fov: number ){
            super();

            this.screenSize = screenSize;
            this.fov = fov;
            this.target = target;

            // @ts-ignore
            let normalizedEye = normalize(subtract(initialEye, target));

            // I belive this can be replaced with identity quaternion
            this.rotation = new Quaternion().make_rot_vec2vec([0,0,1], normalizedEye);
            
            // Up vector
            this.up = this.rotation.apply([0,1,0]);

        }


        adjustRotation(xAdjustment: number, yAdjustment: number){
            // Create quaternion which rotates by the amount
            // corresponding from the center of the screen
            // to the new mouse position
            let rotationIncrement = new Quaternion().make_rot_vec2vec([0,0,1], this.projectToSphere(xAdjustment, yAdjustment));
            this.rotation = this.rotation.multiply(rotationIncrement);
            this.dirty = true;
        }


        getDirection(){
            this.clean();
            return this.direction;
        }


        createViewMatrix() {
            // Hardcoded distance for this part
            let distance = 350;

            let eye = this.rotation.apply([0, 0, distance]);
            this.position = eye;

            let up = this.rotation.apply(this.up);

            // Actually unused in this worksheet
            // @ts-ignore
            this.direction = normalize(subtract(this.target, eye)); 
            
            // @ts-ignore
            this.viewMatrix = lookAt(eye, this.target, up);
        }


        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screenSize[0]/this.screenSize[1], 1, 10000);
        };


        /**
         * Source: trackball.js example
         * 
         * Projects a pair of screen space coordinates onto sphere of radius 2.
         */
        projectToSphere(xScreen: number, yScreen: number) {
            let x = xScreen / (this.screenSize[0]/2.0);
            let y = -yScreen / (this.screenSize[1]/2.0);

            // Project onto sphere
            var r = 2;
            var d = Math.sqrt(x * x + y * y);   
            var t = r * Math.sqrt(2);
            var z = 0;
            if (d < r) // Inside sphere
            z = Math.sqrt(r * r - d * d);
            else if (d < t)
            z = 0;
            else       // On hyperbola
            z = t * t / d;

            // Return coordinates
            // @ts-ignore
            return normalize([x, y, z]);
        }
    }


    

}