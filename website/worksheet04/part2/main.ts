
namespace Sheet4.Part2 {
    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var sphereRenderer: SphereRenderer;
    declare var camera: Util.OrbitalCamera;
    declare var frameTimer: Util.FrameTimer;


    function setup(){
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        frameTimer = new Util.FrameTimer("fps-text");
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 150, 0, 0 );

        sphereRenderer = new SphereRenderer(gl);

        // Camera controls
        new Util.Slider("camera-distance", 25, 600, 200, 1, (value) => camera.setDistance(value) );
        new Util.Slider("camera-horizontal", -360, 360, 0, 1, (value) => camera.setHorizontalRotation(value) );
        new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );
               
        // Sub division
        new Util.Slider("subdivisions", 0, 8, 0, 1, (numDivisions) => sphereRenderer.setSphere(new Sphere([0,0,0], 50, numDivisions)) );
    }


    function update(){
        frameTimer.registerFrame();
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        sphereRenderer.draw(camera);
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet4.Part2.start();



