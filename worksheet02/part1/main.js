



function createLayer(){
    var layer = new Layer(gl, canvasSize);
    layerMenu.pushLayer(layer);
    layers.push(layer);
}


function update(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    layers.forEach( layer => {
        layer.update();
    });

    requestAnimationFrame(update);
}



// Setup ------------------------------------------------------------------------

const canvasSize = [1080, 720];

var canvas = document.getElementById("canvas");
var gl = setupGLCanvas("canvas", canvasSize[0], canvasSize[1]);

gl.clearColor(0.3921, 0.5843, 0.9294, 1.0); 
gl.enable(gl.DEPTH_TEST);


var layerMenu = new LayerMenu(document.getElementById("layer_menu"));
var layers = [];

createLayer();
createLayer();

canvas.onmousedown = e => {
    layerMenu.getSelectedLayer().addPoint([e.offsetX, canvasSize[1]-e.offsetY], 40, [1.0, 1.0, 1.0, 1.0]);
};


document.onkeypress = e => {
    console.log(e.code);
    if( e.code == 'KeyD' ){
        var layer = layerMenu.getSelectedLayer();
        layer.clear();
    }
}

update();

