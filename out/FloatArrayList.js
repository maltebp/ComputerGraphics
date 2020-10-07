/**
 *  Simple, partially implemented dynamic float array implemented as an array list
 */
class FloatArrayList {
    /**
     * @param {*} size Size to pre-reserve for the array
     */
    constructor(size = 1) {
        this.list = null;
        this.numElements = 0;
        this.list = new Float32Array(size);
    }
    push(...elements) {
        elements.forEach((element) => {
            // Recursively adding arrays
            if (element instanceof Array || element instanceof Float32Array) {
                element.forEach((subElement) => {
                    this.push(subElement);
                });
                return;
            }
            var currentLength = this.list.length;
            if (currentLength == this.numElements) {
                this.reserve(currentLength * 2);
            }
            this.list[this.numElements] = element;
            this.numElements++;
        });
    }
    /**
     * Reserves new memory for the buffer
     * @param {*} newSize
     */
    reserve(newSize) {
        // Increase the memory size of the array
        var currentSize = this.list == null ? 0 : this.list.length;
        var newData = new Float32Array(newSize);
        if (this.list != null)
            for (var i = 0; i < currentSize && i < newSize; i++) {
                newData[i] = this.list[i];
            }
        this.list = newData;
    }
    /**
     *  Removes all elements from the list by settings all values to 0, but
     *  the memory is not "freed" (the internal list remains the same size).
     *  To compress the size, you can use the "compress function"
     */
    clear() {
        for (var i = 0; i < this.numElements; i++)
            this.list[i] = 0;
        this.numElements = 0;
    }
    forEach(callback) {
        for (var i = 0; i < this.numElements; i++)
            callback(this.list[i]);
    }
    /**
     * Fits the size of internal list to match the number of elements
     */
    compress() {
        this.reserve(this.numElements);
    }
    /**
     * Returns the number of elements (floats) in the list
     */
    length() {
        return this.numElements;
    }
    getData() {
        return this.list;
    }
}
