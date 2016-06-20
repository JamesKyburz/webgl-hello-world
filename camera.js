// var createCamera = require('perspective-camera')
// var fov = Math.PI/2
// var width = window.innerWidth
// var height = window.innerHeight
//
// var camera = createCamera({
//  fov: fov,
//  near: 0.01,
//  far: 100,
//  viewport: [0, 0, width, height]
// })
//
// camera.translate([ 0, 10, 0 ])
// camera.lookAt([ 0, 0, 0 ])
// camera.update()

var createOrbitCamera = require('orbit-camera')
var camera = createOrbitCamera()
camera.center = [0, 4, 0]
camera.distance = 32
camera.rotation = [0.10503429174423218, -0.8922743797302246, 0.18369752168655396, 0.3988351821899414]

module.exports = () => camera
