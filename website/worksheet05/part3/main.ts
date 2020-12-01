
namespace Sheet5.Part3 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var camera: Util.OrbitalCamera;
    declare var renderer: ModelRenderer;
    declare var model: Model;
    declare var frameTimer: Util.FrameTimer;

    function setup(){
    
        // @ts-ignore
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0, 2.5, 0], 45, 8, 0, 0);

        renderer = new ModelRenderer(gl);

        // Load Model
        model = null;
        Util.loadObjFile("/models/Tree.obj", 1.0, false, (obj) => {
            console.log(obj.getDrawingInfo());
            model = new Model(gl, obj, [0,0,0], 1.0);
        });

        
        frameTimer = new Util.FrameTimer("fps-text");

        // Camera controls
        new Util.Slider("camera-distance", 4, 20, 8, 0.25, (value) => camera.setDistance(value) );
        new Util.Slider("camera-horizontal", -360, 360, 0, 1, (value) => camera.setHorizontalRotation(value) );
        new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );
    }


    function update(){
        // Update time
        frameTimer.registerFrame();        

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render model
        if( model != null )
            renderer.draw(camera, model);

        requestAnimationFrame(update);
    }

    export function start(){
        setup();
        update();
    }
}

Sheet5.Part3.start();



