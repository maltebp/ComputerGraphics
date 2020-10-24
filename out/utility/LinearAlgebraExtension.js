var Util;
(function (Util) {
    /**
     * Takes any combination of numbers, lists of numbers, lists of lists of numbers etc, and
     * convert them to a single dimensional sequential Float32Array.
     *
     * Note: it fixes the problems  with the "flatten" function provided by the 'MV.js' library.
     */
    function toFloatArray(...data) {
        var numbers = [];
        toFloatArrayRecursive(numbers, data);
        return new Float32Array(numbers);
    }
    Util.toFloatArray = toFloatArray;
    function toFloatArrayRecursive(array, ...elements) {
        elements.forEach((element) => {
            // Hate that this is necessary, but apparently the matrix needs to be
            // transposed
            if (element.matrix === true) {
                // @ts-ignore
                element = transpose(element);
            }
            // Recursively adding arrays
            if (element instanceof Array || element instanceof Float32Array) {
                element.forEach(subElement => {
                    toFloatArrayRecursive(array, subElement);
                });
                return;
            }
            // It should be a number
            if (typeof element !== "number")
                throw "Element " + element + " is not a number, when converting to FloatArray";
            array.push(element);
        });
    }
    /**
     * Creates a  model matrix as a Float32Array from a various parameters
     *
     * @param position  X, y, z positions (translation)
     * @param scale     X, y, z scaling
     * @param rotation  X, y, z rotation
     */
    function createModelMatrix(position, scale, rotation) {
        // @ts-ignore
        let modelMatrix = mult(
        // @ts-ignore
        translate(position[0], position[1], position[2]), 
        // @ts-ignore
        mult(
        // @ts-ignore
        mult(
        // @ts-ignore
        rotateX(rotation[0]), 
        // @ts-ignore
        mult(
        // @ts-ignore
        rotateY(rotation[1]), 
        // @ts-ignore
        rotateZ(rotation[2]))), 
        // @ts-ignore
        scalem(scale[0], scale[1], scale[2])));
        return toFloatArray(modelMatrix);
    }
    Util.createModelMatrix = createModelMatrix;
})(Util || (Util = {}));
