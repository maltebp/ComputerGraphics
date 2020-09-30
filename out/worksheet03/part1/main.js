function update() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (rotateCamera)
        camera.rotateY(0.01);
    cubeRenderer.drawWireFrame(cube, camera);
    requestAnimationFrame(update);
}
// Setup ------------------------------------------------------------------------
const CANVAS_SIZE = [720, 480];
var canvas = document.getElementById("canvas");
// @ts-ignore
var gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
var camera = new LookAtCamera(CANVAS_SIZE, [-100, 100, -100], [0, 0, 0]);
var rotateCamera = false;
var cubeRenderer = new CubeRenderer(gl, camera);
gl.clear(gl.COLOR_BUFFER_BIT);
var cube = new Cube();
// Rotation Check box
document.getElementById("rotate").onchange = (e) => {
    rotateCamera = !rotateCamera;
};
// Cube size slider
let sizeSlider = document.getElementById("cube-size");
sizeSlider.oninput = (e) => {
    cube.setSize(sizeSlider.valueAsNumber);
};
cube.setSize(sizeSlider.valueAsNumber);
// ------------------------------------------------------------------------------------------------
update();
