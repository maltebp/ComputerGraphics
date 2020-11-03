
namespace Sheet7.Part1 {
    declare var gl: WebGLRenderingContext;

    declare var sphere: Sphere;
    declare var sphereRenderer: SphereRenderer;
    declare var rotateLight: boolean;
    declare var rotateGlobe: boolean;
    declare var camera: Util.OrbitalCamera;

    declare var lightDirection: number[];

    declare var previousTime: number;

    declare var texture;
    declare var textureLoadCount: number;
    
    function setup(){

        const CANVAS_SIZE = [720, 480];
    
        // @ts-ignore
        gl =Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0, 0.0, 0.0, 1.0); 
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 45, 150, 0, 0 );

        lightDirection = [1.0, 0, -1.0, 0];

        previousTime = Date.now();
        
        rotateLight = false;
        rotateGlobe = false;

        // FPS
        FPS.textElement = <HTMLParagraphElement> document.getElementById("fps-text");
    
        // Globe Rotation Check box
        document.getElementById("globe-rotate").onchange =  (e) => {
            rotateGlobe = !rotateGlobe;
        };

        // Light Rotation Check box
        document.getElementById("rotate_light").onchange =  (e) => {
            rotateLight = !rotateLight;
        };        

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


        sphere = new Sphere([0,0,0], 50, 8);
        sphereRenderer = new SphereRenderer(gl);
        sphereRenderer.setSphere(sphere);


        // Loading texture
        texture = null;
        textureLoadCount = 0;

        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var cubemap = [
            '/worksheet07/textures/cm_left.png',     // POSITIVE_X
            '/worksheet07/textures/cm_right.png',    // NEGATIVE_X
            '/worksheet07/textures/cm_top.png',      // POSITIVE_Y
            '/worksheet07/textures/cm_bottom.png',   // NEGATIVE_Y
            '/worksheet07/textures/cm_back.png',     // POSITIVE_Z
            '/worksheet07/textures/cm_front.png'     // NEGATIVE_Z
        ];
        
        for(let i = 0; i < 6; ++i) {
            let  image = <HTMLImageElement> document.createElement('img');
            image.crossOrigin = 'anonymous';
            image.onload = (e) => {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                textureLoadCount++;
            };

            image.src = cubemap[i];
        }

    }



    function update(){
        // Update time
        var currentTime = Date.now();
        var timeStep = (currentTime - previousTime)/1000.0;
        previousTime = currentTime;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        FPS.registerFrame();


        // if( !textureLoaded ){
        //     requestAnimationFrame(update);
        //     return;
        // }

        // @ts-ignore
        if( rotateLight ) lightDirection = mult(rotateY(-60 * timeStep), lightDirection);

        if( rotateGlobe ) sphere.rotateY(-30 * timeStep);

        var lightColor = Util.hexToRgb((<HTMLInputElement>document.getElementById("directional-light-color")).value);
        sphereRenderer.setDirectionalLight(
            lightDirection.slice(0, 3),
            [lightColor.r/255, lightColor.g/255, lightColor.b/255]
        );

        var ambientColor = Util.hexToRgb((<HTMLInputElement> document.getElementById("ambient-color")).value);
        sphereRenderer.setAmbientColor([ambientColor.r/255, ambientColor.g/255, ambientColor.b/255]);

        sphereRenderer.draw(camera);
        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet7.Part1.start();



