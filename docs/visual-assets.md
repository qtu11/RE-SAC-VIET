# Visual assets

The original references establish the studio's chibi illustration style. The current interface follows the user's later Vietnamese wardrobe direction: warm paper, vermilion, green, lotus marks and a Huế house setting. Catalog cards use the same full-body Canvas renderer, palette and measured crop as the live character stage. `catalog-artwork.ts` contains separate coordinates for all 15 supplied sheets and all four existing views; M03's crop excludes its neighboring figures and caption.

Generated assets use the built-in **imagegen** tool with the supplied references. They are illustration concepts, not historical reconstruction evidence.

## Original hero (retained asset)

Saved file: `D:/RESắc STUDIO/public/visuals/hero.png`.

Final prompt:

> Use case: stylized-concept. Asset type: clean responsive website hero artwork, landscape 2.3:1 composition. Input image 1 is a visual reference for the exact chibi heroine and the palace scene; input image 2 is a supporting style reference. Create a clean, cinematic illustration of the SAME adorable feminine chibi character in the main desktop reference: large warm brown eyes, delicate face, elaborate black braided bun with antique gold hair ornaments and red tassels, black and red Vietnamese-inspired ngũ thân remix coat with intricate golden botanical embroidery, white inner fabric, confident glance back over her shoulder. Keep the premium finely detailed 3D doll illustration style, identity, outfit palette, mood, and imperial Hue palace architecture of the reference. Place the heroine at about 62 percent of the image width, head near the top, upper body and flowing robes down to bottom edge. Leave the left 42 percent as softly blurred dark atmospheric palace, suitable for website HTML typography overlay. On the far right show blurred palace, warm sunlight and a few deep red autumn leaves. Color palette charcoal black, antique warm gold, rich crimson, muted slate blue sky. Beautiful sunlight on face, richly detailed textiles, subtle depth of field. This is only the artwork, not a website screenshot: absolutely NO text, letters, logos, seals, interface, buttons, panels, phones, navigation, cards, frames, icon overlays or watermark. Preserve the heroine's distinctive look from the provided references. Output one clean continuous wide landscape hero artwork.

## Outfit character

Saved file: `D:/RESắc STUDIO/public/visuals/hac-phong-avatar.png`.

Final prompt:

> Use case: stylized-concept. Asset type: transparent full-body character illustration for the interactive RE:SẮC STUDIO outfit builder. Image 1 is the visual identity reference for the heroine; image 2 is the reference for the full-body pose and outfit in its center phone. Create one single adorable premium finely detailed 3D chibi heroine matching exactly the girl in these references, standing in a graceful three-quarter pose, holding a folded-out black and gold hand fan at waist level. Large expressive warm brown eyes, delicate face, elaborate dark braided updo with antique gold floral ornaments and long red tassels. Black and crimson Vietnamese-inspired ngũ thân contemporary remix, intricate golden botanical embroidery, a white layered inner skirt, flowing black/red sash, chunky black boots with small gold accents. Show her complete figure from top of hair to bottom of both boots, with generous transparent padding on every side. Match the reference's head-to-body proportions and beautiful detailed doll style. Warm subtle soft lighting; high-detail cloth and gold ornaments. Background must be genuinely transparent alpha; no floor, no shadow rectangle, no scenery, no other characters, no words, letters, symbols, logos, captions, phones, buttons, thumbnail galleries, UI, borders, or watermark.

The resulting character image is used as its own complete illustration in the builder; the original output is kept unchanged.

## Supplied reference assets

- `public/visuals/reference-desktop.png`: desktop card, accessory and event illustrations.
- `public/visuals/reference-mobile.png`: original mobile visual reference.
- `public/catalog/Nam/M01.png` through `M06.png`: supplied male garment catalog.
- `public/catalog/Nữ/P01.png` through `P09.png`: supplied female garment catalog.

Fonts are self-hosted in `public/fonts`. Run `node scripts/localize-fonts.mjs` to refresh the original Google Fonts downloads.

## Current Vietnamese homepage

Saved file: `D:/RESắc STUDIO/public/visuals/vietnam-heritage.png` (1536×1024).

Prompt content: a natural editorial photograph of a young Vietnamese woman in a plain red ngũ thân and a Vietnamese man in a peacock blue ngũ thân, beside a traditional Huế house and garden. Warm daylight, real cloth folds, a relaxed everyday encounter, balanced composition for a cream heritage wardrobe website. Vietnamese setting and simple cloth headwear; no fantasy palace, Chinese lanterns, imperial jewelry, seals, lettering, interface or watermark. This image depicts a contemporary creative interpretation, not documentary evidence of nineteenth-century dress.

## Four newly created commoner illustrations

These were generated with the built-in imagegen tool. `hac-phong-avatar.png` was the reference for the doll rendering and face style only. Each output is one full-body 1024×1536 PNG with real alpha. The images are copied unchanged; alpha is verified in `tests/commoners.test.mjs`. Approximately 65% of each image is transparent. No flood-fill segmentation is applied to these already transparent assets.

| ID | Saved original file | Website file |
|---|---|---|
| BD01 | `D:/RESắc STUDIO/asset/Nam/BD01.png` | `D:/RESắc STUDIO/public/catalog/BinhDan/BD01.png` |
| BD02 | `D:/RESắc STUDIO/asset/Nữ/BD02.png` | `D:/RESắc STUDIO/public/catalog/BinhDan/BD02.png` |
| BD03 | `D:/RESắc STUDIO/asset/Nam/BD03.png` | `D:/RESắc STUDIO/public/catalog/BinhDan/BD03.png` |
| BD04 | `D:/RESắc STUDIO/asset/Nữ/BD04.png` | `D:/RESắc STUDIO/public/catalog/BinhDan/BD04.png` |

Shared prompt content:

> Use case: stylized-concept. Create one premium full-body chibi character, front-facing with a slight three-quarter pose, warm brown eyes, rounded doll anatomy and natural stitched cloth folds. Use the reference only for rendering quality and facial style. Replace its costume entirely with historically informed ordinary Vietnamese clothing from the nineteenth-century Nguyễn period. Plain, modest cloth, relaxed body proportions, simple footwear and headwear. Transparent alpha background, portrait 1024×1536, complete head and both feet with padding. No other characters, scenery, floor rectangle, text, labels or interface. Avoid Hanfu, Qipao, crossed Chinese lapels, elaborate frog closures, imperial crowns, dragons, phoenix embroidery, gold hair ornaments, trailing gowns, platform boots and fitted modern raglan áo dài.

Individual costume instructions:

- **BD01:** male brown ngũ thân tay chẽn, standing collar, right-side overlap, five fabric buttons, roomy mid-calf tunic, narrow wrist sleeves; light loose trousers, brown wrapped khăn vấn, low wooden clogs, empty hands.
- **BD02:** female near-black ngũ thân tay chẽn, standing collar and five fabric closures; brown loose trousers, plain cloth headwrap over a bun, nón lá held by hand, wooden clogs, no jewelry.
- **BD03:** male indigo ngũ thân tay chẽn, standing collar, right-side closures, cream trousers, cloth khăn vấn, small tied cloth bundle, simple footwear. A second imagegen edit added the fifth fabric button near the collar while preserving the figure and alpha.
- **BD04:** female brown tứ thân with two open front panels tied at the waist, modest pale yếm underneath and dark ankle-length skirt, wooden clogs. A second imagegen edit replaced the bulky headwrap with a close black khăn mỏ quạ and a small pointed fold at the forehead, preserving the rest and transparency.

Final generation identifiers: BD01 `exec-aff415af-95d7-4f27-b863-857293a6062a`; BD02 `exec-e9b5b669-8dcc-4ccc-8dd2-ab6429752b0c`; BD03 `exec-35ec0f51-5187-4221-8492-7425d72e6e41`; BD04 `exec-259d2113-d54d-4acf-8d91-4f7308ae907d`. The final corrected outputs are the saved files above.

### Historical basis and scope

The Huế cultural authority's [exhibition introduction](https://svhttdl.hue.gov.vn/tin-trong-nuoc/ao-dai-viet-nam-qua-cac-thoi-ky-lich-su-mot-trien-lam-khong-the-bo-qua.html) supports the ngũ thân / tứ thân construction distinction. Its [Huế áo dài heritage announcement](https://svhttdl.hue.gov.vn/tin-trong-tinh/le-don-nhan-danh-hieu-di-san-van-hoa-phi-vat-the-quoc-gia-tri-thuc-may-mac-ao-dai-hue.html) provides the Nguyễn-period context. The app links these sources beside each commoner garment.

Phom áo is the reference-backed element. Brown, black and indigo tones, surface texture, exact headwrap folds, props and wooden footwear are illustrative choices, not evidence that every ordinary person wore the same outfit. BD04 is labeled Northern folk dress existing during the Nguyễn period; it is not labeled a Huế court uniform. The artworks are not conservation-grade reconstructions, sewing patterns or 3D assets. They expose only their one real image view in the app.

`asset` is the editable source for these four files. `scripts/sync-commoners.mjs` copies them into `public` before development/build; `npm run catalog:sync` runs that step alone.
