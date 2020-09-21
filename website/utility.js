
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



/**
 * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param {*} hex 
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}


/**
 * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param {*} hex 
 */
function _componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
/**
 * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param {*} hex 
 */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
  