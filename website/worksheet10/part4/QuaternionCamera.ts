namespace Sheet10.Part4 {

    export class QuaternionCamera extends Util.Camera {

        protected screenSize: number[];
        protected target: number[];
        protected fov: number;
        protected direction: number[];
        protected distance: number;
        protected pan: number[];

        protected rotation: Quaternion;
        protected up: number[];


        constructor(screenSize: number[], target: number[], initialEye: number[], fov: number, distance: number ){
            super();

            this.screenSize = screenSize;
            this.fov = fov;
            this.target = target;
            this.distance = distance;

            this.pan = [0, 0];

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


        adjustDistance(amount: number){
            this.distance += amount;
            if( this.distance < 0 ) this.distance = 0;
            this.dirty = true;
        }


        adjustPan(xAdjustment: number, yAdjustment: number) {
            let mappedCoords = this.mapCoordinates(xAdjustment, yAdjustment);
            this.pan[0] +=  mappedCoords[0] * this.distance * 0.25;
            this.pan[1] +=  mappedCoords[1] * this.distance * 0.25;
            this.dirty = true;
        }


        getDirection(){
            this.clean();
            return this.direction;
        }


        createViewMatrix() {
            // Hardcoded distance for this part
            let eye = this.rotation.apply([0, 0, this.distance]);

            // @ts-ignore
            let up = normalize(this.rotation.apply(this.up));

            // @ts-ignore
            let right = normalize(this.rotation.apply([1, 0, 0]));

            let target = [
                this.target[0] - right[0] * this.pan[0] - up[0]*this.pan[1],
                this.target[1] - right[1] * this.pan[0] - up[1]*this.pan[1],
                this.target[2] - right[2] * this.pan[0] - up[2]*this.pan[1]
            ];

            // Translate eye
            // @ts-ignore
            eye = add(target, eye);

            // Update position
            this.position = eye;

            // Actually unused in this worksheet
            // @ts-ignore
            this.direction = normalize(subtract(target, eye)); 
        
            // @ts-ignore
            this.viewMatrix = lookAt(eye, target, up);
        }


        createProjectionMatrix(){
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screenSize[0]/this.screenSize[1], 1, 10000);
        };



        mapCoordinates(xScreen: number, yScreen: number) {
            return [
                xScreen / (this.screenSize[0]/2.0),
                -yScreen / (this.screenSize[1]/2.0)
            ];
        }

        /**
         * Source: trackball.js example
         * 
         * Projects a pair of screen space coordinates onto sphere of radius 2.
         */
        projectToSphere(xScreen: number, yScreen: number) {
            let mappedCoords = this.mapCoordinates(xScreen, yScreen);

            let x = mappedCoords[0];
            let y = mappedCoords[1];

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