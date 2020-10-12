var Project;
(function (Project) {
    function setup() {
        const CANVAS_SIZE = [720, 480];
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        // FPS
        FPS.textElement = document.getElementById("fps-text");
        squares = [];
        squares.push(new Project.Square(0, 0, 20, 100, [1.0, 0.0, 0.0, 1.0]));
        squares.push(new Project.Square(75, 75, 10, 100, [0, 0.0, 1.0, 0.5]));
        Project.Rendering.initialize(gl);
    }
    function update() {
        Project.Rendering.flush();
        squares.forEach(square => { Project.Rendering.drawSquare(square); });
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
