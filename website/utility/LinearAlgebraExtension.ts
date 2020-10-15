


namespace Util {

    /**
     * Takes any combination of numbers, lists of numbers, lists of lists of numbers etc, and
     * convert them to a single dimensional sequential Float32Array.
     * 
     * Note: it fixes the problems  with the "flatten" function provided by the 'MV.js' library.
     */
    export function toFloatArray(... data) : Float32Array {
        var numbers: number[] = [];
        toFloatArrayRecursive(numbers, data);
        return new Float32Array(numbers);
    }

    function toFloatArrayRecursive(array: number[], ... elements) {
        elements.forEach((element) => {

            // Hate that this is necessary, but apparently the matrix needs to be
            // transposed
            if ( element.matrix === true ) {
                // @ts-ignore
                element = transpose( element );
            }

            // Recursively adding arrays
            if( element instanceof Array || element instanceof Float32Array ){
                element.forEach(subElement => {
                    toFloatArrayRecursive(array, subElement);
                });
                return;
            }

            // It should be a number
            if( typeof element !== "number" )
                throw "Element " + element + " is not a number, when converting to FloatArray";

            array.push(element);
        });
    }

}




