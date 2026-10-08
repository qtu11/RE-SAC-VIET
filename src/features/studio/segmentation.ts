// Image-space processing for the live catalog viewer. Source PNGs stay intact.
// One crop can contain disconnected captions or the edge of an adjacent view.
// After masking the backdrop, retain the largest connected character region.
export function isolateCatalogCharacter(pixels: Uint8ClampedArray, width: number, height: number, headEnd = .43) {
  const length = width * height
  const visited = new Uint8Array(length)
  const queue = new Int32Array(length)
  let head = 0, tail = 0
  const visitBackground = (i: number) => {
    if (visited[i]) return
    visited[i] = 1
    const j = i * 4
    const low = Math.min(pixels[j], pixels[j + 1], pixels[j + 2])
    const high = Math.max(pixels[j], pixels[j + 1], pixels[j + 2])
    if (low < 234 && !(low > 214 && high - low < 18)) return
    queue[tail++] = i
  }
  for (let x = 0; x < width; x++) { visitBackground(x); visitBackground((height - 1) * width + x) }
  for (let y = 0; y < height; y++) { visitBackground(y * width); visitBackground(y * width + width - 1) }
  while (head < tail) {
    const i = queue[head++], x = i % width
    pixels[i * 4 + 3] = 0
    if (x > 0) visitBackground(i - 1)
    if (x < width - 1) visitBackground(i + 1)
    if (i >= width) visitBackground(i - width)
    if (i < width * (height - 1)) visitBackground(i + width)
  }
  // Hair ornaments can enclose white backdrop, preventing the edge flood from
  // reaching it. Remove substantial neutral regions around the head; tiny eye
  // highlights and pale garment lining below the neckline stay intact.
  visited.fill(0)
  const headLength = Math.floor(height * headEnd) * width
  const neutral = (i: number) => {
    const j = i * 4
    const low = Math.min(pixels[j], pixels[j + 1], pixels[j + 2])
    const high = Math.max(pixels[j], pixels[j + 1], pixels[j + 2])
    return i < headLength && pixels[j + 3] > 0 && low > 234 && high - low < 18
  }
  for (let start = 0; start < headLength; start++) {
    if (visited[start] || !neutral(start)) continue
    head = 0; tail = 0
    const add = (i: number) => {
      if (visited[i] || !neutral(i)) return
      visited[i] = 1; queue[tail++] = i
    }
    add(start)
    while (head < tail) {
      const i = queue[head++], x = i % width
      if (x > 0) add(i - 1)
      if (x < width - 1) add(i + 1)
      if (i >= width) add(i - width)
      if (i + width < headLength) add(i + width)
    }
    if (tail >= Math.max(24, length * .0015)) for (let i = 0; i < tail; i++) pixels[queue[i] * 4 + 3] = 0
  }
  visited.fill(0)
  const labels = new Int32Array(length)
  let component = 0, largest = 0, largestSize = 0
  for (let start = 0; start < length; start++) {
    if (visited[start] || pixels[start * 4 + 3] === 0) continue
    component++; head = 0; tail = 0
    const add = (i: number) => {
      if (visited[i] || pixels[i * 4 + 3] === 0) return
      visited[i] = 1; labels[i] = component; queue[tail++] = i
    }
    add(start)
    while (head < tail) {
      const i = queue[head++], x = i % width
      // Include diagonal edges, which occur along delicate ornaments.
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nextX = x + dx, nextY = Math.floor(i / width) + dy
        if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) add(nextY * width + nextX)
      }
    }
    if (tail > largestSize) { largestSize = tail; largest = component }
  }
  for (let i = 0; i < length; i++) if (labels[i] !== largest) pixels[i * 4 + 3] = 0
}
