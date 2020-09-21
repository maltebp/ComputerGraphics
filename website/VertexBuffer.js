




/**
 *  Simple, partially implemented dynamic float array implemented as an array list
 */
class VertexBuffer {

    /**
     * @param {*} size Size to pre-reserve for the array 
     */
    constructor(gl, startSize=64) {
        if( gl == null )
            throw "GL context cannot be null";

        this._gl = gl;
        this._buffer = gl.createBuffer();
        this._numElements = 0;
        this._dirty = false;
        this.reserve(startSize);


        this._attributes = [];
        this._totalAttributesSize = 0;
    }


    push(...elements) {
        elements.forEach(element => {
            if( element instanceof Array ){
                element.forEach(subElement => this.push(subElement));
                return;
            }
            var currentLength = this._data.length;
            if( currentLength == this._numElements ){
                this.reserve(currentLength*2);
            }

            this._data[this._numElements] = element;
            this._numElements++;
        });
    }


    /**
     * Reserves new memory for the buffer 
     * @param {*} newSize 
     */
    reserve(newSize){
        
        // Increase the memory size of the array
        
        var currentSize = this._data == null ? 0 : this._data.length;
        var newData = new Float32Array(newSize);
        if( this._data != null)
            for( var i=0; i<currentSize && i<newSize; i++) {
                newData[i] = this._data[i];
            }
        this._data = newData;
        this._dirty = true;
    }


    /**
     * Binds the buffer
     * @param {*} program   The shader program to bind the attributes to
     */
    bind(program){
        if( program == null )
            throw "Shader program cannot be null";

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
        if(this._dirty){      
            this._gl.bufferData(this._gl.ARRAY_BUFFER, this._data, this._gl.STATIC_DRAW);
        }

        this._attributes.forEach(attrib => {
            var pos = this._gl.getAttribLocation(program, attrib.name);
            if( pos == -1 )
                throw "Couldn't find attribute " + attrib.name;
            this._gl.vertexAttribPointer(pos, attrib.count, this._gl.FLOAT, false, this._totalAttributesSize, attrib.offset);
            this._gl.enableVertexAttribArray(pos);
        });
    }


    /**
     *  Removes all elements from the list by settings all values to 0, but
     *  the memory is not "freed" (the internal list remains the same size).
     *  To compress the size, you can use the "compress function"
     */
    clear(){
        for(var i=0; i<this._numElements; i++)
            this._data[i] = 0;
        this._numElements = 0;
    }

    forEach(callback) {
        for(var i=0; i<this._numElements; i++)
            callback(this._data[i]);
    }


    /**
     * Fits the size of internal list to match the number of elements 
     */
    compress(){
        this.reserve(this._numElements);
    }


    /**
     * Returns the number of elements (floats) in the list
     */
    length() {
        return this._numElements;
    }

    addAttribute(name, count){
        this._attributes.push({
            name: name,
            count: count,
            offset: this._totalAttributesSize
        });
        this._totalAttributesSize += count*4;
    }

}