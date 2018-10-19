console.log("hello, world!")
const program = require('./yolo/model.js').program
const block = program.blocks[0]

function fetchData(varName) {
  return fetch(`./yolo/paras/${varName}`).then(res => res.arrayBuffer)
}

const scope = {}

const loadPromise = [];
Object.keys(block.vars).forEach(k => {
  const v = block.vars[k]
  if (v.persistable && k !== 'feed' && k !== 'fetch') {
    loadPromise.push(fetchData(k).then(buf => {
      scope[k] = {
        data: new Float32Array(buf),
        dim: v.dim
      }
    }))
  } else {
    scope[k] = {
      data: undefined,
      dim: v.dim
    }
  }
})

const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl')
const extTextureFloat = gl.getExtension('OES_texture_float')
const extTextureHalfFloat = gl.getExtension('OES_texture_half_float')


const ops = {
  'feed': require('./ops/feed.js'),
  'fetch': require('./ops/fetch.js'),
}

function createTexture(vinfo) {
  const dim = [1, 1, 1, 1]
  for (i = 4 - vinfo.dim.length; i < 4; i++) {
    dim[i] = vinfo.dim[i-vinfo.dim.length]
    if (dim[i] < 0) dim[i] = 1
  }
  const width = dim[3] * (dim[1] + 3) / 4
  const height = dim[2] * dim[0]
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  if (vinfo.data !== undefined) {
    const data = new Float32Array(width * height * 4 * 4)
    let sindex = 0
    for (let n = 0; n < dim[0]; n++) {
      for (let c = 0; c < dim[1]; c++) {
        for (let h = 0; h < dim[2]; h++) {
          for (let w = 0; w < dim[3]; w++) {
            let dindex = (n * dim[2] + h) * width * 4 * 4 + Math.floor(c / 4) * dim[3] * 4 * 4 + (c % 4) * dim[3] * 4
            data[dindex] = vinfo.data[sindex++]
          }
        }
      }
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, vinfo.data)
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, undefined)
  }
  return texture
}

const computeList = []
const unimplemented = {}

function initOp() {
  block.ops.forEach(op => {
    if (ops[op.type] !== undefined) {
      computeList.push(ops[op.type].create(op, scope, gl))
    } else {
      if (unimplemented[op.type] === undefined) {
        console.log(`${op.type} is not implemented`)
      }
      unimplemented[op.type] = true
    }
  })
  computeList.forEach(op => op.inferShape())
}

function initMemory() {
  // inferShape()
  Object.keys(scope).forEach(k => {
    if (k == 'feed' || k == 'fetch') return
    const v = scope[k]
    scope[k].texture = createTexture(v)
  })
}

function getInput() {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, image)
      console.log(scope['feed'])
      scope['feed'].dim = [1, 3, image.height, image.width]
      scope['feed'].data = undefined
      scope['feed'].texture = texture
      console.log(scope['feed'])
      resolve()
    }
    image.src = require('./banana.jpeg')
  })
}

Promise.all(loadPromise).then(_ => {
  console.log('all loaded!')
  initOp()
  initMemory()
  return getInput()
}).then(() => {
  console.log('=======================================================')
  computeList.forEach(op => op.compute())
})
