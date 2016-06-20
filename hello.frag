precision highp float;
 
uniform vec2 iResolution;
uniform float iGlobalTime;
 
#pragma glslify: cornell = require('glsl-cornell-box') 
#pragma glslify: camera = require('glsl-turntable-camera') 
 
void main() {
  vec3 ro, rd;
  float anim = sin(iGlobalTime);
  float rot = anim*0.1;
  float angle = anim*0.25;
  float dist = -2.0;
  camera(rot, angle, dist, iResolution.xy, ro, rd);
 
  gl_FragColor.rgb = cornell(ro, rd);
  gl_FragColor.a = 1.0; 
}