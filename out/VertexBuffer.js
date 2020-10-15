/**
 *  Simple, partially implemented dynamic float array implemented as an array list
 */
class VertexBuffer extends FloatArrayList {
    /**
     * @param {*} size Size to pre-reserve for the array
     */
    constructor(gl, startSize = 64) {
        super(startSize);
        if (gl == null)
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
    reserve(newSize) {
        super.reserve(newSize);
        this._dirty = true;
    }
    push(...elements) {
        super.push(...elements);
        this._dirty = true;
    }
    clear() {
        super.clear();
        this._dirty = true;
    }
    bind() {
        var shader = this._gl.getParameter(this._gl.CURRENT_PROGRAM);
        if (shader == null)
            throw "No shader program bound when binding vertex buffer";
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffer);
        if (this._dirty) {
            this._gl.bufferData(this._gl.ARRAY_BUFFER, this.list, this._gl.STATIC_DRAW);
            this._dirty = false;
        }
        // Not sure if this should be done everytime we bind...
        this._attributes.forEach(attrib => {
            var pos = this._gl.getAttribLocation(shader, attrib.name);
            if (pos == -1)
                throw "Couldn't find attribute " + attrib.name;
            this._gl.vertexAttribPointer(pos, attrib.count, this._gl.FLOAT, false, this._totalAttributesSize, attrib.offset);
            this._gl.enableVertexAttribArray(pos);
        });
    }
    addAttribute(name, count) {
        this._attributes.push({
            name: name,
            count: count,
            offset: this._totalAttributesSize
        });
        this._totalAttributesSize += count * 4;
    }
    /**
     * Returns the number of vertices in the number, when each vertex contains
     * the number of elements defined by the sum of the count in the attributes.
     */
    getNumVertices() {
        return this.numElements / (this._totalAttributesSize / 4);
    }
}
