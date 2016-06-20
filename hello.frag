precision mediump float;
varying vec3 vNormal;

void main() {
  vec3 color = vec3(0.7);
  vec3 ambient = 0.7 * color;
  float phong = dot(vNormal, vec3(0.71, 0.71, 0) );
  vec3 diffuse = phong * color;
  //gl_FragColor = vec4(ambient + diffuse, 1.0);
  gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
}
