

class IndexBuffer{

    private gl; 
    private buffer;
    private dirty: boolean;

    protected list: Uint16Array = null;
    protected numElements: number = 0;


    

    /**
     * @param {*} size Size to pre-reserve for the array 
     */
    constructor(gl, startSize:number=64) {
        if( gl == null )
            throw "GL context cannot be null";

        this.gl = gl;
        this.buffer = gl.createBuffer();
        
        this.list = new Uint16Array(startSize);
        this.dirty = false;
        this.reserve(startSize);
    }


    bind(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        console.log(this.asUInt16());
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.asUInt16(), this.gl.STATIC_DRAW);

        if(this.dirty){
        }
    }


    /**
     * Apparently, indices has to be 16-bits in ES2.0, so
     * this is just a small hack to convert the Float32Array
     * into an array of Uint16.
     */
    private asUInt16(){
        var uInt16List = new Uint16Array(this.length());
        for( var i=0; i<this.length(); i++){
            uInt16List[i] = this.list[i];
        }
        return uInt16List;
    }
    


    push(...elements: (number|number[]|Uint16Array)[]) {
        elements.forEach((element) => {
            console.log(element);

            // Recursively adding arrays
            if( element instanceof Array || element instanceof Uint16Array ){
                console.log(element);
                element.forEach((subElement: number) => {
                    this.push(subElement)
                });
                return;
            }



            var currentLength = this.list.length;
            if( currentLength == this.numElements ){
                this.reserve(currentLength*2);
            }

            this.list[this.numElements] = element;
            this.numElements++;
        });
    }


    /**
     * Reserves new memory for the buffer 
     * @param {*} newSize 
     */
    reserve(newSize: number){
        this.dirty = true;
        // Increase the memory size of the array
        var currentSize = this.list == null ? 0 : this.list.length;
        var newData = new Uint16Array(newSize);
        if( this.list != null)
            for( var i=0; i<currentSize && i<newSize; i++) {
                newData[i] = this.list[i];
            }
        this.list = newData;
    }

    /**
     *  Removes all elements from the list by settings all values to 0, but
     *  the memory is not "freed" (the internal list remains the same size).
     *  To compress the size, you can use the "compress function"
     */
    clear(){
        for(var i=0; i<this.numElements; i++)
            this.list[i] = 0;
        this.numElements = 0;
    }


    forEach(callback: (element: number) => void) {
        for(var i=0; i<this.numElements; i++)
            callback(this.list[i]);
    }


    /**
     * Fits the size of internal list to match the number of elements 
     */
    compress(){
        this.reserve(this.numElements);
    }


    /**
     * Returns the number of elements (floats) in the list
     */
    length() {
        return this.numElements;
    }

}