import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const url = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Ephesis&display=swap'
const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
if (!response.ok) throw new Error(`Font stylesheet request failed: ${response.status}`)
let css = await response.text()
const fontUrls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(match => match[1]))]
await mkdir(path.join(root, 'public/fonts'), { recursive: true })
for (const [index, fontUrl] of fontUrls.entries()) {
  const fontResponse = await fetch(fontUrl)
  if (!fontResponse.ok) throw new Error(`Font file request failed: ${fontResponse.status}`)
  const extension = new URL(fontUrl).pathname.split('.').at(-1)
  const filename = `resac-${String(index + 1).padStart(2, '0')}.${extension}`
  await writeFile(path.join(root, 'public/fonts', filename), Buffer.from(await fontResponse.arrayBuffer()))
  css = css.replaceAll(fontUrl, `/fonts/${filename}`)
}
await writeFile(path.join(root, 'src/app/fonts.css'), css)
const styles = await readFile(path.join(root, 'src/app/globals.css'), 'utf8')
await writeFile(path.join(root, 'src/app/globals.css'), styles.replace(/^@import[^\n]+/, "@import './fonts.css';"))
console.log(`Self-hosted ${fontUrls.length} font files.`)
