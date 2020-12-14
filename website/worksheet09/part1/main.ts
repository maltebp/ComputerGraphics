
namespace Sheet9.Part1 {

    // Settings
    const CANVAS_SIZE = [720, 480];
    const GROUND_SIZE = [300, 300];

    // Globals
    declare var gl: WebGLRenderingContext;
    declare var frameTimer: Util.FrameTimer;

    declare var camera: Util.OrbitalCamera;
    declare var modelRenderer: ModelRenderer;
    declare var groundRenderer: GroundRenderer;

    declare var model: Model;
    declare var modelAnimationSpeed: number;
    declare var modelAnimationTime: number;

    declare var pointLight: Util.PointLight;
    declare var pointLightRenderer: Util.PointLightRenderer;
    declare var rotateLight: boolean;

    declare var ambientColor: Util.Color;

    
    function setup(){
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);

        frameTimer = new Util.FrameTimer("fps-text");

        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0 ); // Distance value is unused, as its set below

        // Creating point light
        pointLight = new Util.PointLight([175, 100, 175], Util.Color.WHITE);
        rotateLight = false;
        pointLightRenderer = new Util.PointLightRenderer(gl, "../../");

        groundRenderer = new GroundRenderer(gl, "../generic/xamp23.png", GROUND_SIZE[0], GROUND_SIZE[1]);

        // Load Model
        model = null;
        Util.loadObjFile("../../models/teapot/teapot.obj", 1.0, false, (obj) => {
            model = new Model(gl, obj, [0,0,0], 25);
        });

        modelAnimationTime = 0;

        modelRenderer = new ModelRenderer(gl);
        modelRenderer.setMaterial(1.0, 1.0, 0.25, 50);
        modelRenderer.setPointLight(pointLight);

        // Camera distance
        new Util.Slider("camera-distance", 25, 600, 350, 1, (value) => camera.setDistance(value) );

        // Camera Horizontal Angle
        new Util.Slider("camera-horizontal", -360, 360, 0, 1, (value) => camera.setHorizontalRotation(value) );

        // Camera Vertical Angle
        new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );

        // Model animation speed
        new Util.Slider("model-animationspeed", 0, 1, 0.25, 0.01, (value) => modelAnimationSpeed = value );       

        // Point light Rotation Check box
        new Util.Checkbox("pointlight-rotate", false, (checked) =>  rotateLight = checked ); 

        // Point Light height slider
        new Util.Slider("pointlight-height", 100, 250, 100, 1, (value) => pointLight.setY(value));

        // POint light color picker
        new Util.ColorPicker("pointlight-color", new Util.Color(1.0, 1.0, 1.0), (color) => { pointLight.setColor(color) });

        // Ambient color picker
        new Util.ColorPicker("ambientlight-color", new Util.Color(0.10, 0.10, 0.10), (color) => {
            ambientColor = color;
            modelRenderer.setAmbientColor(color);
        });
    }



    function update(){
        let timeStep = frameTimer.registerFrame();

        gl.clearColor(ambientColor.getRed(), ambientColor.getGreen(), ambientColor.getBlue(), ambientColor.getAlpha()); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Rotate point light
        if( rotateLight )
            pointLight.rotateY([0,0,0], -60*timeStep);

        // Draw model
        if( model != null ) {   
            { // Animate model floating
                var animationLength = 1.0; // Number of seconds the animation takes if speed is 1.0
                modelAnimationTime += timeStep/animationLength * modelAnimationSpeed;
                
                while( modelAnimationTime > 1.0 )
                    modelAnimationTime -= 1.0;
    
                let adjustedTime = (modelAnimationTime*2 - 1) * Math.PI;
                
                model.setPositionY( Math.sin(adjustedTime)*20 + 25);
            }
        
            modelRenderer.draw(camera, model);
        }

        // Draw ground
        if( groundRenderer != null )
            groundRenderer.draw(camera, pointLight, ambientColor);

        // Render point light        
        pointLightRenderer.draw(camera, pointLight, 10);

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet9.Part1.start();



