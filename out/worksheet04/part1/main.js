var Sheet4;
(function (Sheet4) {
    var Part1;
    (function (Part1) {
        function setup() {
            const CANVAS_SIZE = [720, 480];
            // @ts-ignore
            gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
            gl.enable(gl.DEPTH_TEST);
            gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
            previousTime = Date.now();
            rotateCamera = false;
            // FPS
            FPS.textElement = document.getElementById("fps-text");
            camera = new Util.OrbitalCamera(CANVAS_SIZE, [0, 0, 0], 45, 150, 0, 0);
            // Camera Rotation Check box
            document.getElementById("rotate_camera").onchange = (e) => {
                rotateCamera = !rotateCamera;
            };
            // Camera height (lookat eye y component)
            let cameraSlider = document.getElementById("camera-height");
            cameraSlider.oninput = (e) => {
                camera.setVerticalRotation(cameraSlider.valueAsNumber);
            };
            camera.setVerticalRotation(cameraSlider.valueAsNumber);
            // Sub division
            let subdivisionsSlider = document.getElementById("subdivisions");
            subdivisionsSlider.oninput = (e) => {
                sphereRenderer.setSphere(new Sheet4.Sphere([0, 0, 0], 50, subdivisionsSlider.valueAsNumber));
            };
            // rotateCamera = false;
            sphereRenderer = new Part1.SphereRenderer(gl);
            sphereRenderer.setSphere(new Sheet4.Sphere([0, 0, 0], 50, subdivisionsSlider.valueAsNumber));
        }
        function update() {
            // Update time
            var currentTime = Date.now();
            var timeStep = (currentTime - previousTime) / 1000.0;
            previousTime = currentTime;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (rotateCamera)
                camera.adjustHorizontalRotation(-60 * timeStep);
            sphereRenderer.draw(camera);
            FPS.registerFrame();
            requestAnimationFrame(update);
        }
        function start() {
            setup();
            update();
        }
        Part1.start = start;
    })(Part1 = Sheet4.Part1 || (Sheet4.Part1 = {}));
})(Sheet4 || (Sheet4 = {}));
Sheet4.Part1.start();
