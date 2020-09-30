/**
 * 2D Camera
 */
class Camera {
    constructor(screenSize) {
        this.dirty = true;
        this.viewMatrix = null;
        this.projectionMatrix = null;
        this.viewProjectionMatrix = null;
        this.screensize = null;
        this.screensize = screenSize;
    }
    getViewProjectionMatrix() {
        if (this.dirty) {
            this.createMatrices();
            this.dirty = false;
        }
        return this.viewProjectionMatrix;
    }
    getProjectionMatrix() {
        if (this.dirty) {
            this.createMatrices();
            this.dirty = false;
        }
        return this.projectionMatrix;
    }
    getViewMatrix() {
        if (this.dirty) {
            this.createMatrices();
            this.dirty = false;
        }
        return this.viewMatrix;
    }
}
class LookAtCamera extends Camera {
    constructor(screenSize, pos, target) {
        super(screenSize);
        this.pos = [0, 0, 0];
        this.target = [0, 0, 0];
        if (pos.length != 3)
            throw "Position must be number vector of length 3";
        if (target.length != 3)
            throw "Target must be number vector of length 3";
        this.pos = pos;
        this.target = target;
        this.dirty = true;
    }
    createMatrices() {
        // @ts-ignore
        this.viewMatrix = lookAt(vec3(this.pos), vec3(this.target), vec3(0, 1, 0));
        // @ts-ignore
        this.projectionMatrix = ortho(-this.screensize[0] / 2.0, this.screensize[0] / 2.0, -this.screensize[1] / 2.0, this.screensize[1] / 2.0, -10000, 10000);
        // @ts-ignore
        this.viewProjectionMatrix = mult(this.projectionMatrix, this.viewMatrix);
    }
    setTarget(target) {
        if (target.length != 3)
            throw "Target must be number vector of length 3";
        this.target = target;
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
