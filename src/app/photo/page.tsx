import { PhotoAlbum } from '@/components/photo'

export const metadata = {
  title: '攝影集',
  description: '水土曜來了的攝影作品集',
}

export default function PhotoPage() {
  return (
    <div>
      <h1 className="container mx-auto px-4 pt-8 text-3xl font-bold">
        攝影集
      </h1>
      <PhotoAlbum />
    </div>
  )
}
