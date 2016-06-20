var shell = require('gl-now')()
var createShader = require('gl-shader')
var glslify = require('glslify')
var path = require('path')
var vec2 = require('gl-vec2')
var shader, buffer

shell.on('gl-init', () => {
  var gl = shell.gl
  shader = createShader(gl,
                        glslify(path.join(__dirname, '/hello.vert')),
                        glslify(path.join(__dirname, '/hello.frag')))
  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, 0, 0,
    0, -1, 0,
    1, 1, 0
  ]), gl.STATIC_DRAW)
})

var time = 0.0

shell.on('gl-render', (t) => {
  var gl = shell.gl
  shader.bind()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  shader.uniforms.iResolution = vec2.fromValues(512 * 2, 512 * 2)
  time -= 0.1
  shader.uniforms.iGlobalTime = time
  shader.attributes.position.pointer()
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})
