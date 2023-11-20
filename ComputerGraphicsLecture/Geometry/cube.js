"use strict";
var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var theta = [0, 0, 0];
var thetaLoc;

var points = [];
var colors = [];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  ///////////////////////////////////////////////////////////
  var myCube = cube(0.2);

  myCube.rotate(45, [0, 0, 1]);
  myCube.translate(0.0, 0.0, 0.0);

  colors = myCube.TriangleVertexColors;
  points = myCube.TriangleVertices;

  ///////////////////////////////////////////////////////////

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  //event listeners for buttons

  document.getElementById("xButton").onclick = function () {
    axis = xAxis;
    render();
  };
  document.getElementById("yButton").onclick = function () {
    axis = yAxis;
    render();
  };
  document.getElementById("zButton").onclick = function () {
    axis = zAxis;
    render();
  };

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  theta[axis] += 2.0;

  gl.uniform3fv(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLES, 0, points.length);

  //requestAnimFrame( render );
}
