
const CANVAS_SIZE = [720, 480];
const GROUND_SIZE = [300, 300];

namespace Sheet9.Part2 {
    declare var gl: WebGLRenderingContext;

    declare var activeCamera: Util.Camera;
    declare var camera: Util.OrbitalCamera;
    declare var lightCamera: Util.PerspectiveCamera;

    declare var modelRenderer: ModelRenderer;
    declare var groundRenderer: GroundRenderer;
    declare var shadowRenderer: ShadowRenderer;

    declare var previousTime: number;
    
    declare var pointLight: PointLight;
    declare var lightRotate: boolean;
    declare var pointLightRenderer: PointLightRenderer;

    declare var model: Model;
    declare var modelAnimationSpeed: number; // Number between 0 and 1
    declare var modelAnimationTime: number;
    
    declare var groundTexture: WebGLTexture;

    declare var screenRenderer: ScreenRenderer;
    declare var viewShadowMapTexture: boolean;

    
    function setup(){

        // @ts-ignore   
        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0 ); // Distance value is unused, as its set below
        lightCamera = new Util.PerspectiveCamera(CANVAS_SIZE, [0,0,0], [0,50,0], 35, 150, 700);
        activeCamera = camera;

        // Creating point light
        pointLight = new PointLight([175, 100, 175], [1,1,1]);
        lightRotate = false;
        pointLightRenderer = new PointLightRenderer(gl);

        previousTime = Date.now();

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
        screenRenderer = new ScreenRenderer(gl);
        

        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");   

        // Camera Zoom
        let cameraDistanceSlider = <HTMLInputElement> document.getElementById("camera-distance");
        cameraDistanceSlider.oninput =  (e) => {
             camera.setDistance(cameraDistanceSlider.valueAsNumber);
        };
         camera.setDistance(cameraDistanceSlider.valueAsNumber);

        // Camera Horizontal Angle
        let cameraHorizontalSlider = <HTMLInputElement> document.getElementById("camera-horizontal");
        cameraHorizontalSlider.oninput =  (e) => {
            camera.setHorizontalRotation(cameraHorizontalSlider.valueAsNumber);
        };
        camera.setHorizontalRotation(cameraHorizontalSlider.valueAsNumber);

        // Camera Vertical Angle
        let cameraVerticalSlider = <HTMLInputElement> document.getElementById("camera-vertical");
        cameraVerticalSlider.oninput =  (e) => {
            camera.setVerticalRotation(cameraVerticalSlider.valueAsNumber);
        };
        camera.setVerticalRotation(cameraVerticalSlider.valueAsNumber);   

        // Camera Vertical Angle
        
        let modelAnimationSpeedSlider = <HTMLInputElement> document.getElementById("model-animationspeed");
        modelAnimationSpeedSlider.oninput =  (e) => {
            modelAnimationSpeed = modelAnimationSpeedSlider.valueAsNumber;
        };
        modelAnimationSpeed = modelAnimationSpeedSlider.valueAsNumber;


        

        // Light Rotation Check box
        document.getElementById("pointlight-rotate").onchange =  (e) => {
            lightRotate = !lightRotate;
        };

        // Light height slider
        let lightHeightSlider = <HTMLInputElement> document.getElementById("pointlight-height");
        lightHeightSlider.oninput =  (e) => {
            pointLight.setY(lightHeightSlider.valueAsNumber);
        };
        pointLight.setY(lightHeightSlider.valueAsNumber);

        // Light Camera Check box
        let useLightCameraCheckbox = <HTMLInputElement>document.getElementById("pointlight-camera");
        useLightCameraCheckbox.onchange =  (e) => {
            activeCamera = useLightCameraCheckbox.checked ? lightCamera : camera;
        };

        
        // Shadow map texture view
        viewShadowMapTexture = false;
        let shadowMapViewTexture = <HTMLInputElement>document.getElementById("shadowmap-viewtexture");
        shadowMapViewTexture.onchange =  (e) => {
            viewShadowMapTexture = shadowMapViewTexture.checked;
        };

        //Loading xamp23.png
        groundRenderer = null;
        {
            let image = <HTMLImageElement> document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.onload = function () {
                // Adding texture
                groundTexture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, groundTexture); 
        
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
                gl.generateMipmap(gl.TEXTURE_2D);
    
                groundRenderer = new GroundRenderer(gl, GROUND_SIZE[0], GROUND_SIZE[1]);
                
            };
            image.src = '../xamp23.png';
        }
   
    }


    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        // Set Ambient color
        let ambientColor = Util.hexToRgb((<HTMLInputElement> document.getElementById("ambientlight-color")).value);
        modelRenderer.setAmbientColor([ambientColor.r/255, ambientColor.g/255, ambientColor.b/255]);
        

        gl.clearColor(ambientColor.r/255, ambientColor.g/255, ambientColor.b/255, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        FPS.registerFrame();

        
        // Set Point light color
        let pointLightColor = Util.hexToRgb((<HTMLInputElement>document.getElementById("pointlight-color")).value);
        pointLight.setColor([pointLightColor.r/255, pointLightColor.g/255, pointLightColor.b/255]);

        // Rotate point light
        if( lightRotate )
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
            
            // TODO: Moves these
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, groundTexture); 

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, groundTexture); 

            // Draw shadow
            shadowRenderer.startDraw(lightCamera, 0);
            shadowRenderer.drawModel(model);
            shadowRenderer.endDraw();
            
            shadowRenderer.bindShadowMap(0);

            if( viewShadowMapTexture ) {
                // Draw shadow map as image to screen
                screenRenderer.draw(CANVAS_SIZE[0], CANVAS_SIZE[1], 400, 400 );
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

            pointLightRenderer.draw(activeCamera, pointLight, 20);
            
        }

    
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet9.Part2.start();



