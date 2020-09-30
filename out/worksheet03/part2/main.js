var Sheet3;
(function (Sheet3) {
    var Part2;
    (function (Part2) {
        function update() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            if (rotateCamera)
                camera.rotateY(0.01);
            cubeRenderer.drawWireFrame(cube, camera);
            requestAnimationFrame(update);
        }
        function setup() {
            const CANVAS_SIZE = [720, 480];
            // @ts-ignore
            gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
            gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
            camera = new Sheet3.PerspectiveCamera(CANVAS_SIZE, [-100, 100, -100], [0, 0, 0]);
            rotateCamera = false;
            cubeRenderer = new Sheet3.CubeRenderer(gl, camera);
            gl.clear(gl.COLOR_BUFFER_BIT);
            cube = new Cube();
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
        }
        function start() {
            setup();
            update();
        }
        Part2.start = start;
    })(Part2 = Sheet3.Part2 || (Sheet3.Part2 = {}));
})(Sheet3 || (Sheet3 = {}));
// Setup ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
Sheet3.Part2.start();
