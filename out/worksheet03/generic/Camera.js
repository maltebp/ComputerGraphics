var Sheet3;
(function (Sheet3) {
    /**
     * Abstract generic Camera class, defining methods to get View and Projection matrices
     */
    class Camera {
        constructor() {
            this.dirty = true;
            this.viewMatrix = null;
            this.projectionMatrix = null;
            this.viewProjectionMatrix = null;
            this.screensize = null;
        }
        clean() {
            if (!this.dirty)
                return;
            this.createViewMatrix();
            this.createProjectionMatrix();
            // @ts-ignore
            this.viewProjectionMatrix = mult(this.projectionMatrix, this.viewMatrix);
            this.dirty = false;
        }
        getViewProjectionMatrix() {
            this.clean();
            return this.viewProjectionMatrix;
        }
        getProjectionMatrix() {
            this.clean();
            return this.projectionMatrix;
        }
        getViewMatrix() {
            this.clean();
            return this.viewMatrix;
        }
    }
    Sheet3.Camera = Camera;
    class LookAtCamera extends Camera {
        constructor(screenSize, pos, target) {
            super();
            this.pos = [0, 0, 0];
            this.target = [0, 0, 0];
            this.screensize = null;
            this.screensize = screenSize;
            this.pos = pos;
            this.target = target;
            this.dirty = true;
        }
        createViewMatrix() {
            // @ts-ignore
            this.viewMatrix = lookAt(vec3(this.pos), vec3(this.target), vec3(0, 1, 0));
        }
        setTarget(target) {
            if (target.length != 3)
                throw "Target must be number vector of length 3";
            this.target = target;
            this.dirty = true;
        }
        setY(y) {
            this.pos[1] = y;
            this.dirty = true;
        }
        /**
         * Rotates the camera's position around the target's y axis
         * @param angle  Radians to rotate around the y axis
         */
        rotateY(angle) {
            // @ts-ignore
            let translationMatrix = translate(-this.target[0], -this.target[1], -this.target[2]);
            // @ts-ignore
            let rotationMatrix = rotateY((angle / Math.PI) * 180);
            // @ts-ignore
            let totalMatrix = mult(translate(this.target), mult(rotationMatrix, translationMatrix));
            // @ts-ignore
            this.pos = mult(totalMatrix, vec4(this.pos));
            this.pos = this.pos.splice(0, 3);
            this.dirty = true;
        }
    }
    Sheet3.LookAtCamera = LookAtCamera;
    class OrthographicCamera extends LookAtCamera {
        createProjectionMatrix() {
            // @ts-ignore
            this.projectionMatrix = ortho(-this.screensize[0] / 2.0, this.screensize[0] / 2.0, -this.screensize[1] / 2.0, this.screensize[1] / 2.0, -10000, 10000);
        }
        ;
    }
    Sheet3.OrthographicCamera = OrthographicCamera;
    class PerspectiveCamera extends LookAtCamera {
        constructor(screenSize, pos, target, fov) {
            super(screenSize, pos, target);
            this.fov = fov;
        }
        setFOV(fov) {
            this.fov = fov;
            this.dirty = true;
        }
        createProjectionMatrix() {
            // @ts-ignore
            this.projectionMatrix = perspective(this.fov, this.screensize[0] / this.screensize[1], 0.01, 10000);
        }
        ;
    }
    Sheet3.PerspectiveCamera = PerspectiveCamera;
})(Sheet3 || (Sheet3 = {}));
