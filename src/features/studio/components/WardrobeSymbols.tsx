import { Camera, Coffee, Flower2, Footprints, Gem, GraduationCap, Link, MapPin, Music2, Ribbon, ShoppingBag, Wind } from 'lucide-react'

export function OccasionSymbol({ id, size = 24 }: { id: string; size?: number }) {
  const Icon = ({ tet: Flower2, 'tot-nghiep': GraduationCap, 'ky-yeu': Camera, 'le-hoi': Music2, 'tham-quan': MapPin, 'hen-ho': Coffee })[id] ?? Flower2
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />
}

export function AccessorySymbol({ id, size = 36 }: { id: string; size?: number }) {
  const Icon = ({ khan: Ribbon, quat: Wind, dai: Link, 'trang-suc': Gem, giay: Footprints, tui: ShoppingBag })[id] ?? Gem
  return <Icon size={size} strokeWidth={1.3} aria-hidden="true" />
}
