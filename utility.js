
// Utility function which creates a canvas, and appends it to the document's body
function appendGLCanvas(parent, width, height){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    if( parent == null)
        document.body.appendChild(canvas);
    else
        document.getElementById(parent).appendChild(canvas);

    var gl = WebGLUtils.setupWebGL(canvas);

    return gl;
}


function setupGLCanvas(canvasId, width, height){
    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    var gl = WebGLUtils.setupWebGL(canvas);
    return gl;
}

