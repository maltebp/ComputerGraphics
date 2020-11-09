namespace Util {


    // Utility function which creates a canvas, and appends it to the document's body
    export function appendGLCanvas(parent, width, height){
        var canvas = <HTMLCanvasElement> document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        if( parent == null)
            document.body.appendChild(canvas);
        else
            document.getElementById(parent).appendChild(canvas);

        // @ts-ignore
        var gl = WebGLUtils.setupWebGL(canvas, { alpha: false });

        return gl;
    }


    export function setupGLCanvas(canvasId, width, height){
        var canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        canvas.width = width;
        canvas.height = height;

        // @ts-ignore
        var gl = WebGLUtils.setupWebGL(canvas, { alpha: false });

        return gl;
    }


}