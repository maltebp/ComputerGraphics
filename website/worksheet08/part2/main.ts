
namespace Sheet8.Part2 {
    declare var gl: WebGLRenderingContext;

    declare var camera: Util.OrbitalCamera;
    declare var renderer: QuadRenderer;
    declare var texturesLoaded: boolean;

    declare var lightPosition: number[];
    declare var lightRotate: boolean;

    declare var previousTime: number;

    
    function setup(){

        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1.0); 
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 0, 0, 0 ); // Distance value is unused, as its set below

        previousTime = Date.now();
        
       

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


         // Setting initial light position
         lightPosition = [40, 100, 0, 1];
         lightRotate = false;
         // Light Rotation Check box
         document.getElementById("light-rotate").onchange =  (e) => {
             lightRotate = !lightRotate;
         };  

        renderer = new QuadRenderer(gl);
        
        // Ground quad
        renderer.setGroundPlane(new Quad(
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
         var image = <HTMLImageElement> document.createElement('img');
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

             texturesLoaded = true;
         };
         image.src = '../xamp23.png';


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

        if( lightRotate )
            // @ts-ignore
            lightPosition = mult(rotateY(-60 * timeStep), lightPosition);      

        renderer.setLightPosition(lightPosition.slice(0, 4));

        if( texturesLoaded )
            renderer.draw(camera);

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet8.Part2.start();



