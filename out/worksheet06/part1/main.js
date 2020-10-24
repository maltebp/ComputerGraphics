var Sheet6;
(function (Sheet6) {
    var Part1;
    (function (Part1) {
        function createCheckerboard() {
            var data = Array();
            for (var y = 0; y < 64; y++) {
                for (var x = 0; x < 64; x++) {
                    var black = (Math.floor(x / 8) + Math.floor(y / 8)) % 2 == 0;
                    var color = black ? [0, 0, 0, 1] : [255, 255, 255, 1];
                    color.forEach((e) => data.push(e));
                }
            }
            var dataFlattened = new Uint8Array(data);
            // Adding texture
            texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataFlattened);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        function setup() {
            const CANVAS_SIZE = [720, 480];
            // @ts-ignore
            gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
            // gl.enable(gl.CULL_FACE);
            gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
            previousTime = Date.now();
            // FPS
            FPS.textElement = document.getElementById("fps-text");
            camera = new Util.OrbitalCamera(CANVAS_SIZE, [0, 0, 0], 90, 100, 0, 0);
            renderer = new Part1.Renderer(gl);
            createCheckerboard();
            // Camera Zoom
            let cameraDistanceSlider = document.getElementById("camera-distance");
            cameraDistanceSlider.oninput = (e) => {
                camera.setDistance(cameraDistanceSlider.valueAsNumber);
            };
            camera.setDistance(cameraDistanceSlider.valueAsNumber);
            // Camera Horizontal Angle
            let cameraHorizontalSlider = document.getElementById("camera-horizontal");
            cameraHorizontalSlider.oninput = (e) => {
                camera.setHorizontalRotation(cameraHorizontalSlider.valueAsNumber);
            };
            camera.setHorizontalRotation(cameraHorizontalSlider.valueAsNumber);
            // Camera Vertical Angle
            let cameraVerticalSlider = document.getElementById("camera-vertical");
            cameraVerticalSlider.oninput = (e) => {
                camera.setVerticalRotation(cameraVerticalSlider.valueAsNumber);
            };
            camera.setVerticalRotation(cameraVerticalSlider.valueAsNumber);
        }
        function update() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Update time
            var currentTime = Date.now();
            var timeStep = (currentTime - previousTime) / 1000.0;
            previousTime = currentTime;
            renderer.drawQuad(camera, 
            // 40x40 quad laying flat on the xz plane 
            [0, 0, 0], 80, 80, [90, 0, 0]);
            FPS.registerFrame();
            requestAnimationFrame(update);
        }
        function start() {
            setup();
            update();
        }
        Part1.start = start;
    })(Part1 = Sheet6.Part1 || (Sheet6.Part1 = {}));
})(Sheet6 || (Sheet6 = {}));
Sheet6.Part1.start();
