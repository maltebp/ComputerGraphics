




var gl = appendGLCanvas("container", 512, 512);

var pointRenderer = new PointRenderer(gl);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);


pointRenderer.drawPoint([0,0], 0, 20, [1.0, 1.0, 1.0, 1.0]);
pointRenderer.flush();


