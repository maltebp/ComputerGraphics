

namespace Sheet3.Part2 {

    declare var gl: any[];
    declare var cubeRenderer: any[];

    declare var cameras: Util.PerspectiveCamera[];
    declare var cubes: Cube[];


    function update(){
        for( var i=0; i<3; i++){
            gl[i].clear(gl[i].COLOR_BUFFER_BIT);
            cubeRenderer[i].drawWireFrame(cubes[i], cameras[i]);
        }
        requestAnimationFrame(update);
    }


    function setup(){
        const CANVAS_SIZE = [300, 480];
        
        gl = [
            // @ts-ignore
           Util.setupGLCanvas("canvas1", CANVAS_SIZE[0], CANVAS_SIZE[1]),
            // @ts-ignore
           Util.setupGLCanvas("canvas2", CANVAS_SIZE[0], CANVAS_SIZE[1]),
            // @ts-ignore
           Util.setupGLCanvas("canvas3", CANVAS_SIZE[0], CANVAS_SIZE[1])
        ];
        
        gl[0].clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl[1].clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        gl[2].clearColor(0.3921, 0.5843, 0.9294, 1.0); 
        
        cameras = [
            new Util.PerspectiveCamera(CANVAS_SIZE, [0, 0, -100], [0,0,0], 45),
            new Util.PerspectiveCamera(CANVAS_SIZE, [-100, 0, -100], [0,0,0], 45),
            new Util.PerspectiveCamera(CANVAS_SIZE, [-90, 75, -100], [0,0,0], 45)
        ]

        cubes = [
            new Cube([0,0,0], 20),
            new Cube([0,0,0], 20),
            new Cube([0,0,0], 20)
        ];
        

        cubeRenderer = [
             new CubeRenderer(gl[0]),
             new CubeRenderer(gl[1]),
             new CubeRenderer(gl[2]),
        ];
        
        // Cube size slider
        new Util.Slider("cube-size", 10, 100, 20, 0.5, (size) => {
            cubes.forEach(cube => cube.setSize(size));
        });                    
    }

    
    export function start(){
        setup();
        update();
    }
}

// Setup ------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------
Sheet3.Part2.start();



