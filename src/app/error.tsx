'use client'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="route-message"><span className="eyebrow">RE:SẮC STUDIO</span><h1>Studio cần mở lại một chút.</h1><p>Có lỗi khi mở trang. Bạn có thể thử tải lại để tiếp tục.</p><button className="button button-gold" onClick={reset}>Thử lại</button></main>
}
