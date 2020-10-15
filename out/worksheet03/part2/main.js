var Sheet3;
(function (Sheet3) {
    var Part2;
    (function (Part2) {
        function update() {
            for (var i = 0; i < 3; i++) {
                gl[i].clear(gl[i].COLOR_BUFFER_BIT);
                cubeRenderer[i].drawWireFrame(cubes[i], cameras[i]);
            }
            requestAnimationFrame(update);
        }
        function setup() {
            const CANVAS_SIZE = [300, 480];
            gl = [
                // @ts-ignore
                Util.setupGLCanvas("canvas1", CANVAS_SIZE[0], CANVAS_SIZE[1]),
                // @ts-ignore
                Util.setupGLCanvas("canvas2", CANVAS_SIZE[0], CANVAS_SIZE[1]),
                // @ts-ignore
                Util.setupGLCanvas("canvas3", CANVAS_SIZE[0], CANVAS_SIZE[1])
            ];
            gl[0].clearColor(0.3921, 0.5843, 0.9294, 1.0);
            gl[1].clearColor(0.3921, 0.5843, 0.9294, 1.0);
            gl[2].clearColor(0.3921, 0.5843, 0.9294, 1.0);
            cameras = [
                new Sheet3.PerspectiveCamera(CANVAS_SIZE, [0, 0, -100], [0, 0, 0], 45),
                new Sheet3.PerspectiveCamera(CANVAS_SIZE, [-100, 0, -100], [0, 0, 0], 45),
                new Sheet3.PerspectiveCamera(CANVAS_SIZE, [-90, 75, -100], [0, 0, 0], 45)
            ];
            cubes = [
                new Cube([0, 0, 0], 20),
                new Cube([0, 0, 0], 20),
                new Cube([0, 0, 0], 20)
            ];
            cubeRenderer = [
                new Sheet3.CubeRenderer(gl[0]),
                new Sheet3.CubeRenderer(gl[1]),
                new Sheet3.CubeRenderer(gl[2]),
            ];
            // Cube size slider
            let sizeSlider = document.getElementById("cube-size");
            sizeSlider.oninput = (e) => {
                for (var i = 0; i < 3; i++)
                    cubes[i].setSize(sizeSlider.valueAsNumber);
            };
            for (var i = 0; i < 3; i++)
                cubes[i].setSize(sizeSlider.valueAsNumber);
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
