
namespace Sheet8.Part1 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var frameTimer: Util.FrameTimer;
    declare var camera: Util.OrbitalCamera;
    declare var renderer: QuadRenderer;

    declare var texturesLoaded: boolean;    


    function setup(){
    
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.clearColor(0.2, 0.2, 0.2, 1);
        gl.enable(gl.DEPTH_TEST);

        frameTimer = new Util.FrameTimer("fps-text");
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0);

         // Camera controls
         new Util.Slider("camera-distance", 25, 600, 350, 1, (value) => camera.setDistance(value) );
         new Util.Slider("camera-horizontal", -360, 360, 0, 0.5, (value) => camera.setHorizontalRotation(value) );
         new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) ); 

        renderer = new QuadRenderer(gl);
        
        // Ground quad
        renderer.addQuad(new Quad(
            [0,0,0], // Position
            [
                // Corners
                [-150, 0, -150],
                [ 150, 0, -150],
                [ 150, 0,  150],
                [-150, 0,  150]
            ], 0 // Texture index
        ));

        // Parallel quad
        renderer.addQuad(new Quad(
            [75, 5, -75 ], // Position
            [
                // Corners
                [-25, 0, -25],
                [ 25, 0, -25],
                [ 25, 0,  25],
                [-25, 0,  25]
            ], 1 // Texture index
        ));

        // Perpendicular quad
        renderer.addQuad(new Quad(
            [-75, 0, 0 ], // Position
            [
                 // Corners
                 [0,   0, -25],
                 [0,  50, -25],
                 [0,  50,  25],
                 [0,   0,  25]
            ], 1 // Texture index
        )); 

        // Loading xamp23.png
        texturesLoaded = false;
        Util.Texture.createFromImage(gl, '../xamp23.png')
            .setChannels(4)
            .setFilter(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR)
            .setWrap(gl.REPEAT, gl.REPEAT)
            .build((tex) => {
                tex.bind(0);
                texturesLoaded = true;
            });

        // Creating red texture
        Util.Texture.createFromData(gl,new Uint8Array([255, 0, 0]), 1, 1)
            .setChannels(3)
            .setFilter(gl.NEAREST, gl.NEAREST)
            .setWrap(gl.REPEAT, gl.REPEAT)
            .build((tex) => tex.bind(1));
    }



    function update(){
        frameTimer.registerFrame();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if( texturesLoaded )
            renderer.draw(camera);

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet8.Part1.start();



