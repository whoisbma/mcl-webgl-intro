const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const main = () => {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const vertexSource = `
    attribute vec4 aPosition;
    void main() {
      gl_Position = aPosition;
    }
  `;

  const fragmentSource = `
    void main() {
      gl_FragColor = vec4(gl_FragCoord.x/600.0, gl_FragCoord.y/600.0, 1.0, 1.0);
    }
  `;
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
    return;
  }

  const pos = [
    -1.0, 1.0, 
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ];
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

  const vertexPosAttrLocation = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(vertexPosAttrLocation);
  gl.vertexAttribPointer(vertexPosAttrLocation, 2, gl.FLOAT, false, 0, 0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, pos.length/2);
};

window.onload = main;