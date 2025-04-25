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

const resize = (canvas) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
addEventListener('resize', (e) => {
  resize(canvas);
});

const main = async () => {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  resize(canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const vertexSource = await fetch('./vertex.glsl').then((res) => res.text());
  const fragmentSource = await fetch('./fragment.glsl').then((res) => res.text());

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

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");

  let mouseX, mouseY;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = rect.height - (e.clientY - rect.top) - 1;
  });

  function render(time) {
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(mouseLocation, mouseX, mouseY);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, pos.length/2);     
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

};

window.onload = main;