




/**
 *  Simple, partially implemented dynamic float array implemented as an array list
 */
class FloatArrayList {

    /**
     * @param {*} size Size to pre-reserve for the array 
     */
    constructor(size=1) {
        this._list = new Float32Array(size);
        this._numElements = 0;
    }


    push(...elements) {
        elements.forEach(element => {
            if( element instanceof Array ){
                element.forEach(subElement => this.push(subElement));
                return;
            }
            var currentLength = this._list.length;
            if( currentLength == this._numElements ){
                // Increase the memory size of the array
                var newList = new Float32Array(currentLength*2);
                for( var i=0; i<currentLength; i++) {
                    newList[i] = this._list[i];
                }
                this._list = newList;
            }

            this._list[this._numElements] = element;
            this._numElements++;
        });
    }


    /**
     *  Removes all elements from the list by settings all values to 0, but
     *  the memory is not "freed" (the internal list remains the same size).
     *  To compress the size, you can use the "compress function"
     */
    clear(){
        for(var i=0; i<this._numElements; i++)
            this._list[i] = 0;
        this._numElements = 0;
    }

    forEach(callback) {
        for(var i=0; i<this._numElements; i++)
            callback(this._list[i]);
    }

    
    onResize(callback){
        this._onResizeCallback = callback;
    }


    /**
     * Fits the size of internal list to match the number of elements 
     */
    compress(){
        var newList = new Float32Array(this._numElements);
        for( var i=0; i<this._numElements; i++) {
            newList[i] = this._list[i];
        }
        this._list = newList;
    }


    length() {
        return this._numElements;
    }

}