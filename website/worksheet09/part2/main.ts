

namespace Sheet9.Part2 {

    // Settings
    const CANVAS_SIZE = [720, 480];
    const GROUND_SIZE = [300, 300];

    // Globals
    declare var gl: WebGLRenderingContext;

    declare var activeCamera: Util.Camera;
    declare var camera: Util.OrbitalCamera;
    declare var lightCamera: Util.PerspectiveCamera;

    declare var modelRenderer: ModelRenderer;
    declare var groundRenderer: GroundRenderer;
    declare var shadowRenderer: ShadowRenderer;

    declare var previousTime: number;
    
    declare var ambientColor: Util.Color;
    declare var pointLight: Util.PointLight;
    declare var pointLightRenderer: Util.PointLightRenderer;

    declare var model: Model;
    declare var modelAnimationSpeed: number; // Number between 0 and 1
    declare var modelAnimationTime: number;

    declare var imageRenderer: Util.ImageRenderer;

    // Flags
    declare var rotateLight: boolean;
    declare var viewShadowMapTexture: boolean;

    
    function setup(){

        // @ts-ignore   
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0 ); // Distance value is unused, as its set below
        lightCamera = new Util.PerspectiveCamera(CANVAS_SIZE, [0,0,0], [0,50,0], 35, 150, 700);
        activeCamera = camera;

        // Creating point light
        pointLight = new Util.PointLight([175, 100, 175], Util.Color.WHITE);
        rotateLight = false;
        pointLightRenderer = new Util.PointLightRenderer(gl);

        previousTime = Date.now();

        groundRenderer = new GroundRenderer(gl, "../generic/xamp23.png", GROUND_SIZE[0], GROUND_SIZE[1]);

        // Load Model
        model = null;
        Util.loadObjFile("/models/teapot/teapot.obj", 1.0, false, (obj) => {
            model = new Model(gl, obj, [0,0,0], 25);
        });

        modelAnimationTime = 0;

        modelRenderer = new ModelRenderer(gl);
        modelRenderer.setAmbientColor([0.40, 0.40, 0.40]);
        modelRenderer.setMaterial(1.0, 1.0, 0.25, 50);

        // The ground size, should match the one in the ground renderer
        shadowRenderer = new ShadowRenderer(gl, GROUND_SIZE[0], GROUND_SIZE[1]);

        // Screen renderer to render shadow map as an image to screen
        imageRenderer = new Util.ImageRenderer(gl);
        
        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");   

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

        // Light Camera Check box
        new Util.Checkbox("pointlight-camera", false, (checked) =>  activeCamera = checked ? lightCamera : camera ); 

        // Shadow map texture view
        new Util.Checkbox("shadowmap-viewtexture", false, (checked) => viewShadowMapTexture = checked);
        
        // Ambient color picker
        new Util.ColorPicker("ambientlight-color", new Util.Color(0.10, 0.10, 0.10), (color) => {
            ambientColor = color;
            modelRenderer.setAmbientColor(color.asList());
        });

        
    }


    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clearColor(ambientColor.getRed(), ambientColor.getGreen(), ambientColor.getBlue(), ambientColor.getAlpha()); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        FPS.registerFrame();

        
        // // Set Point light color
        // let pointLightColor = Util.hexToRgb((<HTMLInputElement>document.getElementById("pointlight-color")).value);
        // pointLight.setColor([pointLightColor.r/255, pointLightColor.g/255, pointLightColor.b/255]);

        // Rotate point light
        if( rotateLight )
            pointLight.rotateY([0,0,0], -60*timeStep);

        modelRenderer.setPointLight(
            pointLight.getPosition(),
            [pointLightColor.r/255, pointLightColor.g/255, pointLightColor.b/255]
        );

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

            if( viewShadowMapTexture ) {
                // Draw shadow map as image to screen
                imageRenderer.draw(0, CANVAS_SIZE[0], CANVAS_SIZE[1], 400, 400 );
            }else {
                // Draw model
                modelRenderer.draw(activeCamera, model);

                // Draw ground
                groundRenderer.draw(
                    activeCamera,
                    lightCamera,
                    [pointLightColor.r/255, pointLightColor.g/255, pointLightColor.b/255],
                    [ambientColor.r/255, ambientColor.g/255, ambientColor.b/255],
                    0,
                    1
                );
            }

            pointLightRenderer.draw(activeCamera, pointLight, 10);
        }

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet9.Part2.start();



