

var gl = appendGLCanvas("container", 512, 512);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

gl.enable(gl.DEPTH_TEST);


var layer = new Layer(gl, [512, 512]);

layer.addPoint([100, 100], 40, [1.0, 1,0, 1.0, 1.0]);

layer.update();


// pointRenderer.drawPoint([0,0], 0, 40, [0.5, 0.5, 0.0, 1.0]);
// pointRenderer.drawPoint([0.1,0.1], 0, 40, [0, 0, 0.0, 1.0]);
// pointRenderer.flush();


