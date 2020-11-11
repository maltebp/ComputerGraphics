

namespace Util {


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
    export function loadObjFile(fileName: string, scale: number, reverse: boolean, onLoadCallback){
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