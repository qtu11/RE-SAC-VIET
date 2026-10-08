import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const target = new URL('../public/catalog/BinhDan/', import.meta.url)
await mkdir(target, { recursive: true })
for (const [id, gender] of [['BD01', 'Nam'], ['BD02', 'Nữ'], ['BD03', 'Nam'], ['BD04', 'Nữ']]) {
  const original = fileURLToPath(new URL(`../asset/${gender}/${id}.png`, import.meta.url))
  await copyFile(original, fileURLToPath(new URL(`${id}.png`, target)))
}
console.log('Đã đồng bộ 4 mẫu bình dân từ asset sang public/catalog/BinhDan.')
