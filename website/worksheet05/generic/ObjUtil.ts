

namespace Sheet5.ObjUtil {


    /**
     *  Function which checks if MTL is ready, and if not it sleeps and calls itself.
     *  If it is ready, it calls the given callback with the obj file.
     */
    function waitForMTL(obj, callback){
        if( !obj.isMTLComplete()){
            setTimeout(() => {
                waitForMTL(obj, callback);
            }, 100);
        }else{
            callback(obj);
        }
    }


    /**
     * Loads an .obj file, and calls the passed callback if successful
     */
    export function loadFile(fileName: string, scale: number, reverse: boolean, onLoadCallback){
        var request = new XMLHttpRequest();
    
        request.onreadystatechange = function() {
            if( request.readyState !== 4 ) return;

            if( request.status === 404 )
                throw "Couldn't find obj file '" + fileName + "' (HTTP status 404)";

            // @ts-ignore
            var objDoc = new OBJDoc(fileName); // Create a OBJDoc object
            var loadSuccess = objDoc.parse(request.responseText, scale, reverse);

            if (!loadSuccess)
                throw "Parsing object from '" + fileName + " failed";

            waitForMTL(objDoc, onLoadCallback);
        }
        request.open('GET', fileName, true); // Create a request to get file
        request.send(); // Send the request
    }


}


// // OBJViewer.js (

//     function main() {
//         if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//             console.log('Failed to initialize shaders.');
//             return;
//         }
    
//         // Get the storage locations of attribute and uniform variables
//         var program = gl.program;
//         program.a_Position = gl.getAttribLocation(program, 'a_Position');
//         program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
//         program.a_Color = gl.getAttribLocation(program, 'a_Color');
    
//         // Prepare empty buffer objects for vertex coordinates, colors, and normals
//         var model = initVertexBuffers(gl, program);
    
//         // Start reading the OBJ file
//         readOBJFile('../resources/cube.obj', gl, model, 60, true);
    
//         draw(gl, gl.program, currentAngle, viewProjMatrix, model);
//     }
        
    
//     // Create a buffer object and perform the initial configuration
//     function initVertexBuffers(gl, program) {
//          var o = new Object();
//          o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
//          o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normal, 3, gl.FLOAT);
//          o.colorBuffer = createEmptyArrayBuffer(gl, program.a_Color, 4, gl.FLOAT);
//          o.indexBuffer = gl.createBuffer();
        
//          return o;
//     }
    
    
//     function createEmptyArrayBuffer(gl, a_attribute, num, type) {
//         var buffer = gl.createBuffer(); // Create a buffer object
    
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//         gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
//         gl.enableVertexAttribArray(a_attribute); // Enable the assignment
    
//         return buffer;
//     }
    
//     // Read a file
//     function readOBJFile(fileName, gl, model, scale, reverse) {
//         var request = new XMLHttpRequest();
    
//         request.onreadystatechange = function() {
//             if (request.readyState === 4 && request.status !== 404) {
//                 onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
//             }
//         }
//         request.open('GET', fileName, true); // Create a request to get file
//         request.send(); // Send the request
//     }
    
//     var g_objDoc = null; // The information of OBJ file
//     var g_drawingInfo = null; // The information for drawing 3D model
    
//     // OBJ file has been read
//     function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
//         var objDoc = new OBJDoc(fileName); // Create a OBJDoc object
//         var result = objDoc.parse(fileString, scale, reverse);
//         if (!result) {
//             g_objDoc = null; g_drawingInfo = null;
//             console.log("OBJ file parsing error.");
//             return;
//         }
//         g_objDoc = objDoc;
//     }