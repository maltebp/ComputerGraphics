var Sheet4;
(function (Sheet4) {
    var Part1;
    (function (Part1) {
        function update() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (rotateCamera)
                camera.rotateY(0.01);
            sphereRenderer.draw(sphere, camera);
            FPS.registerFrame();
            requestAnimationFrame(update);
        }
        function setup() {
            const CANVAS_SIZE = [720, 480];
            // @ts-ignore
            gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
            gl.enable(gl.DEPTH_TEST);
            gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
            camera = new Sheet4.PerspectiveCamera(CANVAS_SIZE, [-150, 0, -150], [0, 0, 0], 45);
            // rotateCamera = false;
            sphereRenderer = new Part1.SphereRenderer(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);
            sphere = new Sheet4.Sphere([0, 0, 0], 50, 2);
            rotateCamera = false;
            // FPS
            FPS.textElement = document.getElementById("fps-text");
            // Rotation Check box
            document.getElementById("rotate").onchange = (e) => {
                rotateCamera = !rotateCamera;
            };
            // Camera height (lookat eye y component)
            let cameraSlider = document.getElementById("camera-height");
            cameraSlider.oninput = (e) => {
                camera.setY(cameraSlider.valueAsNumber);
            };
            camera.setY(cameraSlider.valueAsNumber);
            // Cube size slider
            let subdivisionsSlider = document.getElementById("subdivisions");
            subdivisionsSlider.oninput = (e) => {
                sphere.setSubdivisions(subdivisionsSlider.valueAsNumber);
            };
            sphere.setSubdivisions(subdivisionsSlider.valueAsNumber);
        }
        function start() {
            setup();
            update();
        }
        Part1.start = start;
    })(Part1 = Sheet4.Part1 || (Sheet4.Part1 = {}));
})(Sheet4 || (Sheet4 = {}));
Sheet4.Part1.start();
