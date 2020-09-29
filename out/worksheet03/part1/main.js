function update() {
    gl.clear(gl.COLOR_BUFFER_BIT);
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
// gl.enable(gl.DEPTH_TEST);
var camera = new LookAtCamera(CANVAS_SIZE, [0.1, 0.1, 0.1], [0, 0, 0]);
var cubeRenderer = new CubeRenderer(gl, camera);
gl.clear(gl.COLOR_BUFFER_BIT);
var cube = new Cube();
// ------------------------------------------------------------------------------------------------
// EVENTS 
document.onkeypress = e => {
    console.log(e.code);
    // switch(e.code) {
    //     case 'KeyD':
    //         clearSelectedLayer();
    //         break;
    //     case 'KeyC':
    //         clearAll();
    //         break;
    //     case 'KeyH':
    //         toggleLayerVisibility();
    //         break;
    // }    
};
// ------------------------------------------------------------------------------------------------
update();
