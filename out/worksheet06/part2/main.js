var Sheet6;
(function (Sheet6) {
    var Part2;
    (function (Part2) {
        function createCheckerboard() {
            var data = Array();
            var squareSize = 8;
            var imageSize = 64;
            for (var y = 0; y < imageSize; y++) {
                for (var x = 0; x < imageSize; x++) {
                    var black = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 == 0;
                    var color = black ? [0, 0, 0, 1] : [255, 255, 255, 1];
                    color.forEach((e) => data.push(e));
                }
            }
            var dataFlattened = new Uint8Array(data);
            // Adding texture
            texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imageSize, imageSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataFlattened);
            gl.generateMipmap(gl.TEXTURE_2D);
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
            renderer = new Part2.Renderer(gl);
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
            let wrapModeRepeat = document.getElementById("wrap-mode-repeat");
            wrapModeRepeat.onchange = (e) => {
                if (!wrapModeRepeat.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            };
            let wrapModeClamp = document.getElementById("wrap-mode-clamp");
            wrapModeClamp.onchange = (e) => {
                if (!wrapModeClamp.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            };
            let minFiltModeNearest = document.getElementById("minfilter-mode-nearest");
            minFiltModeNearest.onchange = (e) => {
                if (!minFiltModeNearest.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            };
            let minFiltModeLinear = document.getElementById("minfilter-mode-linear");
            minFiltModeLinear.onchange = (e) => {
                if (!minFiltModeLinear.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            };
            let minFiltModeMipmapNL = document.getElementById("minfilter-mode-mipmap-n-l");
            minFiltModeMipmapNL.onchange = (e) => {
                if (!minFiltModeMipmapNL.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            };
            let minFiltModeMipmapLL = document.getElementById("minfilter-mode-mipmap-l-l");
            minFiltModeMipmapLL.onchange = (e) => {
                if (!minFiltModeMipmapLL.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            };
            let minFiltModeMipmapNN = document.getElementById("minfilter-mode-mipmap-n-n");
            minFiltModeMipmapNN.onchange = (e) => {
                if (!minFiltModeMipmapNN.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            };
            let minFiltModeMipmapLN = document.getElementById("minfilter-mode-mipmap-l-n");
            minFiltModeMipmapLN.onchange = (e) => {
                if (!minFiltModeMipmapLN.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            };
            let magFiltModeNearest = document.getElementById("magfilter-mode-nearest");
            magFiltModeNearest.onchange = (e) => {
                if (!magFiltModeNearest.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            };
            let magFiltModeLinear = document.getElementById("magfilter-mode-linear");
            magFiltModeLinear.onchange = (e) => {
                if (!magFiltModeLinear.checked)
                    return;
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            };
        }
        function update() {
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Update time
            var currentTime = Date.now();
            var timeStep = (currentTime - previousTime) / 1000.0;
            previousTime = currentTime;
            renderer.drawQuad(camera, 
            // 40x40 quad laying flat on the xz plane 
            [0, 0, 0], 100, 500, [90, 0, 0]);
            FPS.registerFrame();
            requestAnimationFrame(update);
        }
        function start() {
            setup();
            update();
        }
        Part2.start = start;
    })(Part2 = Sheet6.Part2 || (Sheet6.Part2 = {}));
})(Sheet6 || (Sheet6 = {}));
Sheet6.Part2.start();
