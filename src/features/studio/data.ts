import { catalogArtwork } from './catalog-artwork.ts'

export type Artwork = { source: string; rect: readonly [number, number, number, number]; size?: readonly [number, number] }
export type GarmentHistory = {
  period: string; region: string; details: string[];
  sources: { title: string; url: string }[]; illustrationNote: string
}
export type Garment = {
  id: string; name: string; category: string; subtitle: string; artwork: Artwork;
  note: string; gender: 'Nam' | 'Nữ'; royal?: boolean; folk?: boolean; history?: GarmentHistory; modelArtwork?: Artwork
}
export type Outfit = { garmentId: string; colorId: string; occasionId: string; accessoryIds: string[]; style: string }
export type SavedOutfit = Outfit & { id: string; name: string; createdAt: string; preview?: string }

export const desktopArt = (rect: Artwork['rect']): Artwork => ({ source: '/visuals/reference-desktop.png', rect })
export const mobileArt = (rect: Artwork['rect']): Artwork => ({ source: '/visuals/reference-mobile.png', rect, size: [1448, 1086] })

export const palettes = [
  { id: 'nau-vai', name: 'Nâu vải – Trắng ngà', meaning: 'Mộc mạc, gần gũi', colors: ['#775840', '#ddd2b9'], swatch: '#775840', artwork: { source: '/catalog/BinhDan/BD01.png', size: [1024, 1536], rect: [0, 0, 1024, 1536] } as Artwork },
  { id: 'cham-voi', name: 'Chàm – Trắng vôi', meaning: 'Trầm dịu, giản dị', colors: ['#394b70', '#eee3ce'], swatch: '#394b70', artwork: { source: '/catalog/BinhDan/BD03.png', size: [1024, 1536], rect: [0, 0, 1024, 1536] } as Artwork },
  { id: 'huyen-do', name: 'Đen – Đỏ son', meaning: 'Cá tính, nổi bật', colors: ['#17191b', '#a82e36'], swatch: '#b92836', artwork: desktopArt([859, 735, 85, 112]) },
  { id: 'huyen', name: 'Đen mực', meaning: 'Trầm tĩnh, tinh tế', colors: ['#17191b', '#b69562'], swatch: '#17191b', artwork: desktopArt([859, 735, 85, 112]) },
  { id: 'kim', name: 'Vàng lúa', meaning: 'Ấm áp, rạng rỡ', colors: ['#e9c48d', '#a67c3c'], swatch: '#e9c48d', artwork: desktopArt([955, 735, 85, 112]) },
  { id: 'ngoc', name: 'Xanh ngọc', meaning: 'Nhẹ nhàng, thanh nhã', colors: ['#458978', '#f2ede0'], swatch: '#418473', artwork: desktopArt([1057, 735, 85, 112]) },
  { id: 'lam-vang', name: 'Lam chàm – Vàng', meaning: 'Sắc lam, nét vàng', colors: ['#263d68', '#e9c48d'], swatch: '#263d68', artwork: desktopArt([955, 735, 85, 112]) },
  { id: 'tim-bach', name: 'Tím Huế – Trắng', meaning: 'Lãng mạn, hiện đại', colors: ['#754884', '#ede9ed'], swatch: '#754884', artwork: desktopArt([1152, 735, 85, 112]) },
  { id: 'hong', name: 'Hồng sen', meaning: 'Trong trẻo, dịu dàng', colors: ['#d586ad', '#f4e7e9'], swatch: '#d586ad', artwork: desktopArt([1152, 735, 85, 112]) },
  { id: 'ngoc-trang', name: 'Trắng ngà', meaning: 'Tinh khôi, thanh nhã', colors: ['#f0ede9', '#a7c0b3'], swatch: '#f0ede9', artwork: desktopArt([1057, 735, 85, 112]) },
  { id: 'chu-kim', name: 'Đỏ son – Vàng', meaning: 'Sắc đỏ, nét vàng', colors: ['#b52836', '#e9c48d'], swatch: '#b52836', artwork: desktopArt([859, 735, 85, 112]) },
]
export const paletteLooks = ['nau-vai', 'cham-voi', 'huyen', 'ngoc-trang']

export const nguyenSources = [
  { title: 'Áo dài Việt Nam qua các thời kỳ lịch sử', url: 'https://svhttdl.hue.gov.vn/tin-trong-nuoc/ao-dai-viet-nam-qua-cac-thoi-ky-lich-su-mot-trien-lam-khong-the-bo-qua.html' },
  { title: 'Tri thức may, mặc áo dài Huế', url: 'https://svhttdl.hue.gov.vn/tin-trong-tinh/le-don-nhan-danh-hieu-di-san-van-hoa-phi-vat-the-quoc-gia-tri-thuc-may-mac-ao-dai-hue.html' },
]
const commonerNote = 'Minh họa mới tham khảo tư liệu về phom áo. Sắc nâu, đen, chàm, bề mặt vải và phụ kiện là lựa chọn tạo hình; không phải quy định chung cho mọi người dân thời Nguyễn.'
const nguThanHistory = [
  'Năm thân áo, gồm một thân con nằm phía trong; cổ đứng, vạt cài sang bên phải người mặc.',
  'Năm cúc vải; tay chẽn gọn ở cổ tay. Phân biệt với tay thụng rộng dùng trong dịp trang trọng.',
  'Phom rộng vừa người, mặc cùng quần; bản minh họa dùng áo trơn và khăn vải giản dị.',
]
const commonerArt = (id: string): Artwork => ({ source: `/catalog/BinhDan/${id}.png`, size: [1024, 1536], rect: [0, 0, 1024, 1536] })
export const commonerGarments: Garment[] = [
  { id: 'BD01', name: 'Ngũ thân nâu · Nam', category: 'Áo ngũ thân', subtitle: 'Bình dân · Thời Nguyễn · Nam', gender: 'Nam', folk: true, artwork: commonerArt('BD01'), note: 'Áo ngũ thân tay chẽn sắc nâu, cổ đứng và năm cúc vải. Phối quần sáng màu, khăn vấn và guốc gỗ theo hướng đời thường.', history: { period: 'Thế kỷ XIX · Triều Nguyễn', region: 'Huế / Trung Bộ · Phom ngũ thân', details: nguThanHistory, sources: nguyenSources, illustrationNote: commonerNote } },
  { id: 'BD02', name: 'Ngũ thân đen · Nữ', category: 'Áo ngũ thân', subtitle: 'Bình dân · Thời Nguyễn · Nữ', gender: 'Nữ', folk: true, artwork: commonerArt('BD02'), note: 'Áo ngũ thân tay chẽn màu đen, cài kín cổ và năm cúc vải. Bản phối giản dị với quần nâu, khăn vải và nón lá cầm tay.', history: { period: 'Thế kỷ XIX · Triều Nguyễn', region: 'Huế / Trung Bộ · Phom ngũ thân', details: nguThanHistory, sources: nguyenSources, illustrationNote: commonerNote } },
  { id: 'BD03', name: 'Ngũ thân chàm · Nam', category: 'Áo ngũ thân', subtitle: 'Bình dân · Thời Nguyễn · Nam', gender: 'Nam', folk: true, artwork: commonerArt('BD03'), note: 'Phom ngũ thân tay chẽn với sắc chàm trầm, năm cúc vải, quần trắng ngà và khăn vấn. Tay cầm một bọc vải nhỏ.', history: { period: 'Thế kỷ XIX · Triều Nguyễn', region: 'Huế / Trung Bộ · Phom ngũ thân', details: nguThanHistory, sources: nguyenSources, illustrationNote: commonerNote } },
  { id: 'BD04', name: 'Tứ thân nâu · Nữ', category: 'Áo tứ thân', subtitle: 'Bình dân · Bắc Bộ · Thời Nguyễn', gender: 'Nữ', folk: true, artwork: commonerArt('BD04'), note: 'Áo tứ thân mở phía trước, hai vạt buộc ở eo, mặc ngoài yếm và váy sẫm. Khăn mỏ quạ giản dị gợi nếp mặc của phụ nữ Bắc Bộ.', history: { period: 'Thế kỷ XIX đến đầu XX', region: 'Bắc Bộ · Trang phục dân gian', details: ['Bốn thân áo: hai thân trước để mở, hai thân sau nối ở giữa; không có hàng cúc của ngũ thân.', 'Mặc ngoài yếm, kết hợp váy và dải buộc eo; hai vạt trước có thể buộc lại khi sinh hoạt.', 'Đây là dáng mặc dân gian Bắc Bộ tồn tại trong thời Nguyễn, không phải lễ phục cung đình.'], sources: [nguyenSources[0]], illustrationNote: commonerNote } },
]

export const featuredGarments: Garment[] = [
  { id: 'ngu-than-nam', name: 'Áo ngũ thân', category: 'Áo ngũ thân', subtitle: 'Triều Nguyễn · Thế kỷ XIX', gender: 'Nam', artwork: desktopArt([56, 676, 172, 171]), note: 'Bản minh họa lấy cảm hứng từ áo ngũ thân. Màu sắc và hoa văn được cách điệu cho trải nghiệm sáng tạo.' },
  { id: 'nhat-binh-lam', name: 'Áo nhật bình', category: 'Áo nhật bình', subtitle: 'Triều Nguyễn · Thế kỷ XIX', gender: 'Nữ', artwork: desktopArt([242, 676, 174, 171]), note: 'Cảm hứng từ Việt phục cung đình với sắc lam và các chi tiết trang trí vàng. Đây là hình minh họa concept.' },
  { id: 'tu-than', name: 'Áo tứ thân', category: 'Áo tứ thân', subtitle: 'Cảm hứng dân gian Bắc Bộ', gender: 'Nữ', artwork: desktopArt([432, 676, 174, 171]), note: 'Cảm hứng trang phục dân gian Bắc Bộ, phối sắc xanh, hồng và nón truyền thống.' },
  { id: 'ao-dai', name: 'Áo dài', category: 'Áo dài', subtitle: 'Hiện đại · Cách tân', gender: 'Nữ', artwork: desktopArt([624, 676, 173, 171]), note: 'Một bản phối đương đại với sắc trắng, hồng và chi tiết hoa nhẹ nhàng.' },
]

export const campaignGarment: Garment = {
  id: 'hac-phong', name: 'Ngũ thân xuống phố', category: 'Áo ngũ thân', subtitle: 'Triều Nguyễn · Cảm hứng đương đại', gender: 'Nữ',
  artwork: desktopArt([1184, 136, 223, 232]),
  note: 'Concept đương đại lấy cảm hứng từ áo ngũ thân thời Nguyễn. Bảng màu, phụ kiện và giày hiện đại là những chi tiết remix; bản phối không phải một mẫu phục dựng lịch sử.'
}

const royalNote = 'Ảnh concept theo catalog của studio. Trang phục cung đình gắn với người mặc và nghi lễ cụ thể; hãy xem tư liệu gốc khi dùng cho mục đích phục dựng.'
const femaleNames = ['Phượng bào Hoàng hậu', 'Thanh Loan Phượng Vũ', 'Nhật Bình Hoàng hậu', 'Nhật Bình Hoàng thái hậu', 'Nhật Bình Công chúa – Đoàn Loan', 'Lý Chiêu Hoàng', 'Nhật Bình Cung tần Nhị giai', 'Nhật Bình Cung tần Tam giai', 'Nhật Bình Cung tần Tứ giai']
const maleNames = ['Long bào Đại triều', 'Hoàng bào Thường triều', 'Long cổn tế Giao', 'Long cổn tế Miếu', 'Sa kép Tịch điền', 'Sa kép Hoàng thái tử']
export const royalGarments: Garment[] = [
  ...femaleNames.map((name, i): Garment => {
    const id = `P${String(i + 1).padStart(2, '0')}`
    const note = id === 'P02' ? 'Ảnh P02 được cung cấp mang tên Thanh Loan Phượng Vũ; ảnh này khác mục Đại triều phục Hoàng thái hậu trong tài liệu catalog. Bản xem trước dùng đúng ảnh hiện có.' : id === 'P06' ? 'Ảnh P06 được cung cấp là concept Lý Chiêu Hoàng, khác mục Nhật Bình Cung tần Nhất giai trong tài liệu catalog. Đây là minh họa cảm hứng thời Lý, không gắn nhãn triều Nguyễn.' : royalNote
    return { id, name, category: i < 2 || id === 'P06' ? 'Cung đình' : 'Áo nhật bình', subtitle: id === 'P06' ? 'Cảm hứng thời Lý · Concept' : 'Cung đình · Minh họa concept', gender: 'Nữ', royal: true, artwork: catalogArtwork(id, 'Nữ'), modelArtwork: catalogArtwork(id, 'Nữ'), note }
  }),
  ...maleNames.map((name, i): Garment => { const id = `M${String(i + 1).padStart(2, '0')}`; return { id, name, category: 'Cung đình', subtitle: 'Cung đình · Minh họa concept', gender: 'Nam', royal: true, artwork: catalogArtwork(id, 'Nam'), modelArtwork: catalogArtwork(id, 'Nam'), note: royalNote } }),
]
export const garments = [...commonerGarments, campaignGarment, ...featuredGarments, ...royalGarments]
export const garmentById = (id: string) => garments.find(g => g.id === id) ?? campaignGarment
export function searchGarments(query: string): Garment[] {
  const normalize = (value: string) => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
  const term = normalize(query.trim())
  return garments.filter(g => normalize(`${g.id} ${g.name} ${g.subtitle} ${g.category} ${g.gender} ${g.history?.region ?? ''}`).includes(term))
}

export function filterGarments(query = '', category = 'Tất cả', gender = 'Tất cả'): Garment[] {
  return searchGarments(query).filter(g => (gender === 'Tất cả' || g.gender === gender) && (category === 'Tất cả' || (category === 'Bình dân' ? g.folk : category === 'Cung đình' ? g.royal : g.category === category)))
}

export const looks = [
  { id: 'hac-phong', name: 'Ngũ thân xuống phố', colorId: 'huyen-do', image: campaignGarment.artwork, description: 'Một nếp áo quen, một bản phối mang sắc đỏ son.' },
  { id: 'bach-nguyet', name: 'Một ngày sắc trắng', colorId: 'ngoc-trang', image: desktopArt([1057, 735, 85, 112]), description: 'Một nét dịu dàng, một khoảng bình yên trong sắc ngọc và trắng.' },
  { id: 'lam-vang', name: 'Lam chiều Huế', colorId: 'lam-vang', image: desktopArt([955, 735, 85, 112]), description: 'Sắc lam sâu lắng gặp ánh vàng ấm áp, viết tiếp một nét thanh lịch.' },
  { id: 'tim-bach', name: 'Tím bên hiên nhà', colorId: 'tim-bach', image: desktopArt([1152, 735, 85, 112]), description: 'Một chút mộng mơ trong sắc tím, một dấu ấn của riêng bạn.' },
]

export function outfitName(outfit: Outfit): string {
  const garment = garmentById(outfit.garmentId)
  if (garment.id !== 'hac-phong') return garment.name
  return looks.find(l => l.colorId === outfit.colorId)?.name ?? `${garment.name} · ${palettes.find(p => p.id === outfit.colorId)?.name ?? palettes[0].name}`
}

export const accessories = [
  { id: 'khan', name: 'Mũ / khăn', detail: 'Một nét chấm phá trên mái tóc', artwork: desktopArt([1269, 697, 61, 49]) },
  { id: 'quat', name: 'Quạt', detail: 'Quạt xếp với sắc vàng thanh lịch', artwork: desktopArt([1345, 697, 61, 49]) },
  { id: 'dai', name: 'Đai lưng', detail: 'Điểm nhấn cho phom trang phục', artwork: desktopArt([1419, 697, 61, 49]) },
  { id: 'trang-suc', name: 'Trang sức', detail: 'Chi tiết vàng lấy cảm hứng cổ điển', artwork: desktopArt([1269, 784, 61, 60]) },
  { id: 'giay', name: 'Giày dép', detail: 'Một bước chân mang tinh thần hiện đại', artwork: desktopArt([1345, 784, 61, 60]) },
  { id: 'tui', name: 'Túi xách', detail: 'Nhỏ gọn, hoàn thiện bản phối', artwork: desktopArt([1419, 784, 61, 60]) },
]

export const occasions = [
  { id: 'tet', name: 'Tết Nguyên Đán', shortName: 'Tết', description: 'Sắc đỏ rộn ràng, cùng bạn đón một khởi đầu mới.', artwork: desktopArt([347, 929, 195, 49]) },
  { id: 'tot-nghiep', name: 'Lễ tốt nghiệp', shortName: 'Tốt nghiệp', description: 'Thanh lịch và chỉn chu cho ngày đánh dấu một hành trình.', artwork: desktopArt([560, 929, 138, 49]) },
  { id: 'ky-yeu', name: 'Kỷ yếu / Chụp ảnh', shortName: 'Kỷ yếu', description: 'Lưu lại tuổi trẻ trong một bản phối mang dấu ấn riêng.', artwork: desktopArt([714, 929, 161, 49]) },
  { id: 'le-hoi', name: 'Lễ hội văn hóa', shortName: 'Lễ hội', description: 'Hòa mình vào không khí lễ hội và sắc màu truyền thống.', artwork: desktopArt([893, 929, 162, 49]) },
  { id: 'tham-quan', name: 'Tham quan / Check-in', shortName: 'Tham quan', description: 'Một cuộc hẹn với những không gian giàu câu chuyện.', artwork: desktopArt([1074, 929, 165, 49]) },
  { id: 'hen-ho', name: 'Hẹn hò / Dạo phố', shortName: 'Dạo phố', description: 'Thoải mái, tự nhiên, đủ đặc biệt cho một ngày bình thường.', artwork: desktopArt([1257, 929, 165, 49]) },
]

export const styles = [
  { id: 'Cổ điển', description: 'Ưu tiên tinh thần truyền thống, màu sắc hài hòa và phụ kiện tiết chế.' },
  { id: 'Hiện đại', description: 'Phom Việt phục gặp những chi tiết gần gũi trong cuộc sống hôm nay.' },
  { id: 'Gen Z', description: 'Sắc màu có cá tính, phụ kiện sáng tạo và một dấu ấn riêng.' },
]
export const categories = ['Bình dân', 'Tất cả', 'Áo ngũ thân', 'Áo tứ thân', 'Áo dài', 'Áo nhật bình', 'Cung đình']
export const steps = [
  { id: 'garment', label: 'Chọn trang phục', short: 'Trang phục' },
  { id: 'occasion', label: 'Chọn sự kiện', short: 'Sự kiện' },
  { id: 'color', label: 'Chọn màu sắc', short: 'Màu sắc' },
  { id: 'accessory', label: 'Chọn phụ kiện', short: 'Phụ kiện' },
  { id: 'style', label: 'Chọn phong cách', short: 'Phong cách' },
] as const
export type StepId = typeof steps[number]['id']
export const defaultOutfit: Outfit = { garmentId: 'BD01', colorId: 'nau-vai', occasionId: 'hen-ho', accessoryIds: ['khan', 'giay'], style: 'Cổ điển' }

export function parseOutfit(value: unknown): Outfit | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (!garments.some(g => g.id === v.garmentId) || !palettes.some(p => p.id === v.colorId) || !occasions.some(o => o.id === v.occasionId) || !styles.some(s => s.id === v.style) || !Array.isArray(v.accessoryIds)) return null
  return { garmentId: v.garmentId as string, colorId: v.colorId as string, occasionId: v.occasionId as string, style: v.style as string, accessoryIds: [...new Set(v.accessoryIds.filter((id): id is string => typeof id === 'string' && accessories.some(a => a.id === id)))] }
}

export function outfitKey(outfit: Outfit): string {
  return JSON.stringify([outfit.garmentId, outfit.colorId, outfit.occasionId, outfit.style, [...outfit.accessoryIds].sort()])
}

export function getInitialOutfit(): Outfit {
  try {
    const shared = new URLSearchParams(location.search).get('look')
    if (shared) return parseOutfit(JSON.parse(shared)) ?? defaultOutfit
    return parseOutfit(JSON.parse(localStorage.getItem('resac-outfit') ?? 'null')) ?? defaultOutfit
  } catch { return defaultOutfit }
}
