
/**
 *  Simple, partially implemented dynamic float array implemented as an array list
 */
class VertexBuffer extends FloatArrayList {
    

    private _gl; 
    private _buffer;
    private _dirty: boolean;
    private _attributes;
    private _totalAttributesSize: number;

    /**
     * @param {*} size Size to pre-reserve for the array 
     */
    constructor(gl, startSize:number=64) {
        super(startSize)

        if( gl == null )
            throw "GL context cannot be null";

        this._gl = gl;
        this._buffer = gl.createBuffer();
        this._dirty = false;
        this.reserve(startSize);


        this._attributes = [];
        this._totalAttributesSize = 0;
    }


    /**
     * Reserves new memory for the buffer 
     * @param {*} newSize 
     */
    reserve(newSize: number){
        super.reserve(newSize);
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
        this._dirty = true; // TODO: FIX THIS!!! VERY IMPORTANT
        if(this._dirty){      
            this._gl.bufferData(this._gl.ARRAY_BUFFER, this.list, this._gl.STATIC_DRAW);
            this._dirty = false;
        }

        this._attributes.forEach(attrib => {
            var pos = this._gl.getAttribLocation(program, attrib.name);
            if( pos == -1 )
                throw "Couldn't find attribute " + attrib.name;
            this._gl.vertexAttribPointer(pos, attrib.count, this._gl.FLOAT, false, this._totalAttributesSize, attrib.offset);
            this._gl.enableVertexAttribArray(pos);
        });
    }


    addAttribute(name: string, count: number){
        this._attributes.push({
            name: name,
            count: count,
            offset: this._totalAttributesSize
        });
        this._totalAttributesSize += count*4;
    }

}