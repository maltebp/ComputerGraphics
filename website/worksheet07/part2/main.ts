
namespace Sheet7.Part2 {

    const CANVAS_SIZE = [720, 480];

    declare var gl: WebGLRenderingContext;
    declare var frameTimer: Util.FrameTimer;
    declare var camera: Util.OrbitalCamera;

    declare var sphere: Sphere;
    declare var renderer: SphereRenderer;
    declare var rotateGlobe: boolean;

    declare var texture;
    declare var textureLoadCount: number;
    
    function setup(){

        gl = Util.setupGLCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        frameTimer = new Util.FrameTimer("fps-text");
        
        camera = new Util.OrbitalCamera(CANVAS_SIZE, [0,0,0], 90, 150, 0, 0);

        sphere = new Sphere([0,0,0], 50, 8);
        renderer = new SphereRenderer(gl);
        renderer.setSphere(sphere);

         // Camera controls
         new Util.Slider("camera-distance", 60, 1000, 200, 1, (value) => camera.setDistance(value) );
         new Util.Slider("camera-horizontal", -360, 360, 0, 0.5, (value) => camera.setHorizontalRotation(value) );
         new Util.Slider("camera-vertical", -89, 89, 20, 0.5, (value) => camera.setVerticalRotation(value) );     

        // Globe Rotation Check box
        rotateGlobe = false;
        new Util.Checkbox("globe-rotate", false, (rotate) => rotateGlobe = rotate);

        // Loading texture
        texture = null;
        textureLoadCount = 0;

        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var cubemap = [
            '../textures/cm_left.png',     // POSITIVE_X
            '../textures/cm_right.png',    // NEGATIVE_X
            '../textures/cm_top.png',      // POSITIVE_Y
            '../textures/cm_bottom.png',   // NEGATIVE_Y
            '../textures/cm_back.png',     // POSITIVE_Z
            '../textures/cm_front.png'     // NEGATIVE_Z
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
        let timeStep = frameTimer.registerFrame();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if( rotateGlobe ) sphere.rotateY(-30 * timeStep);

        if( textureLoadCount >= 6 ){
            renderer.draw(camera);
        }

        requestAnimationFrame(update);
    }


    export function start(){
        setup();
        update();
    }
}

Sheet7.Part2.start();



