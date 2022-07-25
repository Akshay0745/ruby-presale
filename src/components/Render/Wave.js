import ParticalsWave from 'particle-wave'



  const pointSize = 4

  const pw = new ParticalsWave(document.getElementById('particle-wave'), {
    uniforms: {
      size: { type: 'float', value: pointSize },
      field: { type: 'vec3', value: [0, 0, 0] },
      speed: { type: 'float', value: 7 }
    },
    onResize(w, h, dpi) {
      const position = []
      const color = []
      const width = 400 * (w / h)
      const depth = 50
      const height = 7
      const distance = 9
      for (let x = 0; x < width; x += distance) {
        for (let z = 0; z < depth; z += distance) {
          position.push(-width / 2 + x, -30, -depth / 2 + z)
          color.push(0, 1 - (x / width) * 1, 0.5 + x / width * 0.5, z / depth)
        }
      }
      this.uniforms.field = [width, height, depth]
      this.buffers.position = position
      this.buffers.color = color
      this.uniforms.size = (h / 400) * pointSize * dpi
    }
  })

