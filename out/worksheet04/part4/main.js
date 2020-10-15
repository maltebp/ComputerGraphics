var Sheet4;
(function (Sheet4) {
    var Part4;
    (function (Part4) {
        function setup() {
            const CANVAS_SIZE = [720, 480];
            // @ts-ignore
            gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
            camera = new Sheet4.PerspectiveCamera(CANVAS_SIZE, [0, 0, -150], [0, 0, 0], 45);
            lightDirection = [0, 0, 1, 0];
            // rotateCamera = false;
            sphereRenderer = new Part4.SphereRenderer(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);
            sphere = new Sheet4.Sphere([0, 0, 0], 50, 2);
            rotateCamera = false;
            rotateLight = false;
            // FPS
            FPS.textElement = document.getElementById("fps-text");
            // Camera Rotation Check box
            document.getElementById("rotate_camera").onchange = (e) => {
                rotateCamera = !rotateCamera;
            };
            // Light Rotation Check box
            document.getElementById("rotate_light").onchange = (e) => {
                rotateLight = !rotateLight;
            };
            // Light Color
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
        function update() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (rotateCamera)
                camera.rotateY(-0.02);
            // @ts-ignore
            if (rotateLight)
                lightDirection = mult(rotateY((0.02 / Math.PI) * 180), lightDirection);
            // @ts-ignore
            var lightColor = hexToRgb(document.getElementById("directional-light-color").value);
            sphereRenderer.setDirectionalLight(lightDirection.slice(0, 3), [lightColor.r / 255, lightColor.g / 255, lightColor.b / 255]);
            // @ts-ignore
            var ambientColor = hexToRgb(document.getElementById("ambient-color").value);
            sphereRenderer.setAmbientColor([ambientColor.r / 255, ambientColor.g / 255, ambientColor.b / 255]);
            sphereRenderer.draw(sphere, camera);
            FPS.registerFrame();
            requestAnimationFrame(update);
        }
        function start() {
            setup();
            update();
        }
        Part4.start = start;
    })(Part4 = Sheet4.Part4 || (Sheet4.Part4 = {}));
})(Sheet4 || (Sheet4 = {}));
Sheet4.Part4.start();
