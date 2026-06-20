import * as twgl from "twgl.js";
import { mat4 } from "gl-matrix";

const vs = `
  attribute vec4 position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * position;
  }
`;

const fs = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

function initCube() {
  const canvas = document.getElementById("cube-canvas");
  if (!canvas) {
    console.error("Canvas element #cube-canvas not found");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  const arrays = {
    position: [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1,
    ],
    indices: new Uint16Array([
      0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7,
    ]),
  };

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const modelMatrix = mat4.create();
  const viewProjectionMatrix = mat4.create();
  const finalMatrix = mat4.create();

  function render(time) {
    const seconds = time * 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.9843, 0.9882, 0.9882, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const fov = (45 * Math.PI) / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

    mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);

    mat4.identity(modelMatrix);
    mat4.rotateX(modelMatrix, modelMatrix, seconds * 0.5);
    mat4.rotateY(modelMatrix, modelMatrix, seconds * 0.8);

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(finalMatrix, viewProjectionMatrix, modelMatrix);

    const uniforms = {
      u_matrix: finalMatrix,
      u_color: [0.05, 0.33, 0.66, 1.0],
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    gl.drawElements(gl.LINES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function start() {
  const canvas = document.getElementById("cube-canvas");
  if (canvas) {
    initCube();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("cube-canvas")) initCube();
    });
  }
}

start();
