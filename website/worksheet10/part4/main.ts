

namespace Sheet10.Part4 {

    // Settings
    const CANVAS_SIZE = [720, 480];
    const GROUND_SIZE = [300, 300];
    const MOUSE_SPIN_DELAY = 25; // Milliseconds

    // Globals
    declare var gl: WebGLRenderingContext;

    declare var frameTimer: Util.FrameTimer;

    declare var camera: QuaternionCamera;
    declare var lightCamera: Util.PerspectiveCamera;

    declare var modelRenderer: ModelRenderer;
    declare var groundRenderer: GroundRenderer;
    declare var shadowRenderer: ShadowRenderer;
    
    declare var ambientColor: Util.Color;
    declare var pointLight: Util.PointLight;
    declare var pointLightRenderer: Util.PointLightRenderer;

    declare var model: Model;
    declare var modelAnimationSpeed: number; // Number between 0 and 1
    declare var modelAnimationTime: number;

    // Flags
    declare var rotateLight: boolean;

    declare var mousePressed: boolean;

    declare var mouseLastSpinAmount: number[];

    declare var mouseLastSpinTime: number;

    function setup(){

        // @ts-ignore   
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);

        frameTimer = new Util.FrameTimer("fps-text");
        
        // Cameras
        camera = new QuaternionCamera(CANVAS_SIZE, [0,0,0], [0, 100, 350], 45, 350 );
        lightCamera = new Util.PerspectiveCamera(CANVAS_SIZE, [0,0,0], [0,50,0], 35, 150, 700);

        // Creating point light
        pointLight = new Util.PointLight([175, 100, 175], Util.Color.WHITE);
        rotateLight = false;
        pointLightRenderer = new Util.PointLightRenderer(gl);

        // Ground renderer
        groundRenderer = new GroundRenderer(gl, "../generic/xamp23.png", GROUND_SIZE[0], GROUND_SIZE[1]);

        // Load Model
        model = null;
        Util.loadObjFile("/models/teapot/teapot.obj", 1.0, false, (obj) => {
            model = new Model(gl, obj, [0,0,0], 25);
        });

        modelAnimationTime = 0;

        // Model renderers
        modelRenderer = new ModelRenderer(gl);
        modelRenderer.setMaterial(1.0, 1.0, 0.25, 50);
        modelRenderer.setPointLight(pointLight);

        // The ground size, should match the one in the ground renderer
        shadowRenderer = new ShadowRenderer(gl, GROUND_SIZE[0], GROUND_SIZE[1]);

        // Mouse Events
        mousePressed = false;
        mouseLastSpinTime = 0;
        mouseLastSpinAmount = [0, 0];
        let canvas = <HTMLCanvasElement> document.getElementById("canvas");
        canvas.onmousedown = (e) => {
            mousePressed = true;
            e.preventDefault(); 
        }   
        canvas.onmouseleave = (e) => {
            mousePressed = false;
            e.preventDefault();
        }
        canvas.onmouseup = (e) => {
            mousePressed = false;
            e.preventDefault();
        }
        canvas.onmousemove = (e) => {
            console.log("Mouse: ", e.movementX, e.movementY);


            if( mousePressed ) {
                if( e.altKey )
                    camera.adjustPan(e.movementX, e.movementY);
                else{
                    // Feels more natural to reverse the movement
                    mouseLastSpinAmount = [-e.movementX, -e.movementY];
                    mouseLastSpinTime = Date.now();
                }
            }
        }
        canvas.onwheel = (e) =>{
            camera.adjustDistance(e.deltaY);
            e.preventDefault();
        }

        // Camera reset
        (<HTMLButtonElement>document.getElementById('camera-reset')).onclick = (e) => {
            camera = new QuaternionCamera(CANVAS_SIZE, [0,0,0], [0, 100, 350], 45, 350 );
        }

        // Model animation speed
        new Util.Slider("model-animationspeed", 0, 1, 0.25, 0.01, (value) => modelAnimationSpeed = value );       

        // Point light Rotation Check box
        new Util.Checkbox("pointlight-rotate", false, (checked) =>  rotateLight = checked ); 

        // Point Light height slider
        new Util.Slider("pointlight-height", 100, 250, 100, 1, (value) => pointLight.setY(value));

        // Point light color picker
        new Util.ColorPicker("pointlight-color", new Util.Color(1.0, 1.0, 1.0), (color) => { pointLight.setColor(color) });

        // Ambient color picker
        new Util.ColorPicker("ambientlight-color", new Util.Color(0.10, 0.10, 0.10), (color) => {
            ambientColor = color;
            modelRenderer.setAmbientColor(color);
        });        
    }


    function update(){
        // Update time
        var timeStep = frameTimer.registerFrame() / 1000.0;

        gl.clearColor(ambientColor.getRed(), ambientColor.getGreen(), ambientColor.getBlue(), ambientColor.getAlpha()); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // Spin camera
        if( mouseLastSpinAmount[0] !== 0 || mouseLastSpinAmount[1] !== 0 ){
            camera.adjustRotation(mouseLastSpinAmount[0], mouseLastSpinAmount[1]);
        }
        if( mousePressed ){
            if( Date.now()-mouseLastSpinTime > MOUSE_SPIN_DELAY ) mouseLastSpinAmount = [0,0];
        }


        // Rotate point light
        if( rotateLight )
            pointLight.rotateY([0,0,0], -60*timeStep);

        lightCamera.setPosition(pointLight.getPosition());

        // Render scene
        if( model != null && groundRenderer != null ) {

            { // Animate model floating
                var animationLength = 1.0; // Number of seconds the animation takes if speed is 1.0
                modelAnimationTime += timeStep/animationLength * modelAnimationSpeed;
                
                while( modelAnimationTime > 1.0 )
                    modelAnimationTime -= 1.0;
    
                let adjustedTime = (modelAnimationTime*2 - 1) * Math.PI;
                
                model.setPositionY( Math.sin(adjustedTime)*20 + 25);
            }
            
            // Draw shadow
            shadowRenderer.startDraw(lightCamera, 0);
            shadowRenderer.drawModel(model);
            shadowRenderer.endDraw();
            
            shadowRenderer.bindShadowMap(0);

            // Draw model
            modelRenderer.draw(camera, model);

            // Draw ground
            groundRenderer.draw(
                camera,
                lightCamera,
                pointLight,
                ambientColor,
                0,
                1
            );
                
            // Draw point light
            pointLightRenderer.draw(camera, pointLight, 10);
        }

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet10.Part4.start();



