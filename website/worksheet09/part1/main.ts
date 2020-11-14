
namespace Sheet9.Part1 {
    declare var gl: WebGLRenderingContext;

    declare var camera: Util.OrbitalCamera;
    declare var modelRenderer: ModelRenderer;
    declare var groundRenderer: GroundRenderer;

    declare var previousTime: number;
    
    declare var lightPosition: number[];
    declare var lightRotate: boolean;

    declare var model: Model;
    declare var modelAnimationSpeed: number; // Number between 0 and 1
    declare var modelAnimationTime: number;
    
    function setup(){

        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1.0); 
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0 ); // Distance value is unused, as its set below

        previousTime = Date.now();

        // Load Model
        model = null;
        Util.loadObjFile("/models/teapot/teapot.obj", 1.0, false, (obj) => {
            console.log(obj.getDrawingInfo());
            model = new Model(gl, obj, [0,0,0], 25);
        });

        modelAnimationTime = 0;

        modelRenderer = new ModelRenderer(gl);
        modelRenderer.setAmbientColor([0.40, 0.40, 0.40]);
        modelRenderer.setMaterial(1.0, 1.0, 0.25, 50);
        

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


        // Setting initial light position
        lightPosition = [100, 50, 100, 1.0];
        lightRotate = false;

        // Light Rotation Check box
        document.getElementById("pointlight-rotate").onchange =  (e) => {
            lightRotate = !lightRotate;
        };

        // Light height slider
        let lightHeightSlider = <HTMLInputElement> document.getElementById("pointlight-height");
        lightHeightSlider.oninput =  (e) => {
            lightPosition[1] = lightHeightSlider.valueAsNumber;
        };
        lightPosition[1] = lightHeightSlider.valueAsNumber;

         // Loading xamp23.png
        groundRenderer = null;
        {
            let image = <HTMLImageElement> document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.onload = function () {
                // Adding texture
                let texture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture); 
        
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    
                gl.generateMipmap(gl.TEXTURE_2D);
    
            groundRenderer = new GroundRenderer(gl, texture, 300, 300);
                
            };
            image.src = '../xamp23.png';
        }
        


         // Creating red texture
        {
            let texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, texture); 
    
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0]));
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        

    }



    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        FPS.registerFrame();

        // Set Ambient color
        {
            var ambientColor = Util.hexToRgb((<HTMLInputElement> document.getElementById("ambientlight-color")).value);
            modelRenderer.setAmbientColor([ambientColor.r/255, ambientColor.g/255, ambientColor.b/255]);
        }
        
        // Set Point light color
        let pointLightColor = Util.hexToRgb((<HTMLInputElement>document.getElementById("pointlight-color")).value);

        // Rotate point light
        if( lightRotate )
            // @ts-ignore
            lightPosition = mult(rotateY(-60 * timeStep), lightPosition);  

        modelRenderer.setPointLight(
            lightPosition.slice(0,3),
            [pointLightColor.r/255, pointLightColor.g/255, pointLightColor.b/255]
        );

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
            groundRenderer.draw(camera);


        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet9.Part1.start();



