import Link from 'next/link'

export default function NotFound() {
  return <main className="route-message"><span className="eyebrow">RE:SẮC STUDIO</span><h1>Trang này chưa có trong tủ đồ.</h1><p>Trở về studio để khám phá Việt phục và tạo bản phối của bạn.</p><Link className="button button-gold" href="/">Về studio</Link></main>
}
