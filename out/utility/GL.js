var Util;
(function (Util) {
    // Utility function which creates a canvas, and appends it to the document's body
    function appendGLCanvas(parent, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        if (parent == null)
            document.body.appendChild(canvas);
        else
            document.getElementById(parent).appendChild(canvas);
        // @ts-ignore
        var gl = WebGLUtils.setupWebGL(canvas);
        return gl;
    }
    Util.appendGLCanvas = appendGLCanvas;
    function setupGLCanvas(canvasId, width, height) {
        var canvas = document.getElementById(canvasId);
        canvas.width = width;
        canvas.height = height;
        // @ts-ignore
        var gl = WebGLUtils.setupWebGL(canvas);
        return gl;
    }
    Util.setupGLCanvas = setupGLCanvas;
})(Util || (Util = {}));
