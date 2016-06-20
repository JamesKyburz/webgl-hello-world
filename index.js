require('./reporterrors')
var shell = require('gl-now')()
var createShader = require('gl-shader')
var glslify = require('glslify')
var path = require('path')
var mat4 = require('gl-mat4')
var camera = require('./camera')()
var normals = require('normals')
var Geometry = require('gl-geometry')
var vec3 = require('gl-vec3')
var createSkydome = require('gl-skydome-sun')
var parseOBJ = require('parse-wavefront-obj')
var fetch = require('isomorphic-fetch')

var fov = Math.PI / 2
var sunDir = vec3.fromValues(0.71, 0.71, 0)

var skydome, geometry, shader

shell.on('gl-init', () => {
  var gl = shell.gl
  shader = createShader(gl,
    glslify(path.join(__dirname, '/hello.vert')),
    glslify(path.join(__dirname, '/hello.frag')))

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  geometry = Geometry(gl)
  gl.clearColor(1, 0, 1, 1)
  skydome = createSkydome(gl)
})

var picker = window.document.body.appendChild(document.createElement('input'))
picker.placeholder = 'model filename'
picker.setAttribute('style', 'position: fixed; right: 0; top: 0; z-index: 1; padding: 5px')
picker.onchange = () => loadModel(picker.value)

function loadModel (modelFile) {
  var model
  loadedModel = false
  fetch(`/models/${modelFile}`)
    .then((res) => res.text())
    .then((res) => {
      if (modelFile.match(/obj/i)) {
        model = parseOBJ(res)
      } else {
        model = JSON.parse(res)
      }
      geometry.attr('aPosition', model.positions)
      geometry.attr('aNormal', normals.faceNormals(model.cells, model.positions))
      geometry.faces(model.cells)
      loadedModel = true
    })
    .catch((err) => {
      throw err
    })
}

var loadedModel

shell.on('gl-render', (t) => {
  var gl = shell.gl
  var canvas = gl.canvas

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.viewport(0, 0, canvas.width, canvas.height)

  if (!loadedModel) return

  shader.bind()

  var model = mat4.create()
  var projection = mat4.create()

  var scratch = mat4.create()
  var view = camera.view(scratch)

  mat4.perspective(projection, fov, canvas.width / canvas.height, 0.1, 200.0)

  skydome.draw({
    view: view,
    projection: projection
  }, {
    sunDirection: sunDir,
    doDithering: true,
    renderSun: true
  })

  geometry.bind(shader)
  shader.uniforms.uModel = model
  shader.uniforms.uView = view
  shader.uniforms.uProjection = projection
  geometry.draw()
})

shell.on('tick', () => {
  if (shell.wasDown('mouse-left')) {
    camera.rotate([shell.mouseX / shell.width - 0.5, shell.mouseY / shell.height - 0.5],
      [shell.prevMouseX / shell.width - 0.5, shell.prevMouseY / shell.height - 0.5])
  }
  if (shell.wasDown('mouse-right')) {
    console.log(camera)
  }
  if (shell.scroll[1]) {
    camera.zoom(shell.scroll[1] * 0.1)
  }
})
