
namespace Project {

    declare var gl;

    declare var squares: Square[];

   

    function setup(){
        const CANVAS_SIZE = [720, 480];
        
        // @ts-ignore
        gl = setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);

        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");

        squares = [];
        squares.push(new Square(0, 0,   20, 100, [1.0, 0.0, 0.0, 1.0]));
        squares.push(new Square(75, 75, 10, 100, [0, 0.0, 1.0, 0.5]));

        Rendering.initialize(gl);
    }


    function update(){
        Rendering.flush();
        squares.forEach( square => {Rendering.drawSquare(square)});
        FPS.registerFrame();
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}


Project.start();


