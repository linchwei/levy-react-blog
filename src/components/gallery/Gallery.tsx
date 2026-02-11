import { useState, useMemo } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { galleryItems, categories } from './galleryData'
import { ImageIcon } from 'lucide-react'

export function Gallery() {
  const [index, setIndex] = useState(-1)
  const [filter, setFilter] = useState('全部')

  const filteredItems = useMemo(() => {
    return filter === '全部'
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter)
  }, [filter])

  const slides = useMemo(() => {
    return filteredItems.map((item) => ({
      src: item.src,
      title: item.title,
      description: item.description,
    }))
  }, [filteredItems])

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === cat
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      {filteredItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredItems.map((item, i) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setIndex(i)}
            >
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2 py-1 bg-purple-500/80 text-white text-xs rounded mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                {/* Image Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">暂无该分类的作品</p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </div>
  )
}
