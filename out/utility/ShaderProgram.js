var Util;
(function (Util) {
    class ShaderProgram {
        constructor(gl, vertexShader, fragmentShader) {
            this.gl = gl;
            // @ts-ignore
            this.program = initShaders(gl, vertexShader, fragmentShader);
        }
        bind() {
            this.gl.useProgram(this.program);
        }
        setFloat(name, float) {
            var location = this.getUniformLocation(name);
            var existingUniform = this.gl.getUniform(this.program, location);
            if (typeof existingUniform !== "number")
                throw "Uniform " + name + " is not a float in the shader";
            this.gl.uniform1f(location, float);
        }
        setFloatVector3(name, float3) {
            if (float3.length != 3)
                throw "Uniform '" + name + "' must be a number array of length 3";
            var location = this.getUniformLocation(name);
            var existingUniform = this.gl.getUniform(this.program, location);
            if (!(existingUniform instanceof Float32Array) || existingUniform.length != 3)
                throw "Uniform " + name + " is not a vec3 in the shader";
            this.gl.uniform3fv(location, Util.toFloatArray(float3));
        }
        setFloatVector4(name, float4) {
            if (float4.length != 4)
                throw "Uniform '" + name + "' must be a number array of length 4";
            var location = this.getUniformLocation(name);
            var existingUniform = this.gl.getUniform(this.program, location);
            if (!(existingUniform instanceof Float32Array) || existingUniform.length != 4)
                throw "Uniform " + name + " is not a vec4 in the shader";
            this.gl.uniform4fv(location, Util.toFloatArray(float4));
        }
        setFloatMatrix4(name, float4x4) {
            var flattened = Util.toFloatArray(float4x4);
            if (flattened.length != 16)
                throw "Uniform '" + name + "' must be a 4x4 matrix";
            var location = this.getUniformLocation(name);
            var existingUniform = this.gl.getUniform(this.program, location);
            if (!(existingUniform instanceof Float32Array) || existingUniform.length != 16)
                throw "Uniform " + name + " is not a mat4 in the shader";
            this.gl.uniformMatrix4fv(location, false, flattened);
        }
        /**
         * Retrieves the location of the uniform with the given name in the program.
         * An exception is thrown if the uniform doesn't exist.
         */
        getUniformLocation(name) {
            var location = this.gl.getUniformLocation(this.program, name);
            if (location == null)
                throw "Couldn't find uniform '" + name + "' in shader program";
            return location;
        }
    }
    Util.ShaderProgram = ShaderProgram;
})(Util || (Util = {}));
