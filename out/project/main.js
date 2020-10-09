var Project;
(function (Project) {
    function setup() {
        const CANVAS_SIZE = [720, 480];
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // rotateCamera = false;
        gl.clear(gl.COLOR_BUFFER_BIT);
        // FPS
        FPS.textElement = document.getElementById("fps-text");
        squares = [];
        squares.push(new Project.Square(75, 75, 10, 100, [0.0, 0.75, 0.5, 1.0]));
        squares.push(new Project.Square(0, 0, 0.0, 100, [1.0, 0.5, 0.5, 1.0]));
        Project.Rendering.initialize(gl);
    }
    function update() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        Project.Rendering.drawSquares(squares);
        FPS.registerFrame();
        requestAnimationFrame(update);
    }
    function start() {
        setup();
        update();
    }
    Project.start = start;
})(Project || (Project = {}));
Project.start();
