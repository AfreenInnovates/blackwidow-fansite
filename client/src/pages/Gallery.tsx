import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getGalleryImages } from "@/api/content"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/useToast"

interface Image {
  id: string
  url: string
  title: string
  description: string
}

export function Gallery() {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages()
        setImages(data.images)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load images"
        })
      }
    }
    fetchImages()
  }, [toast])

  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-3xl font-bold text-red-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Black Widow Gallery
      </motion.h1>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <Card
                className="group cursor-pointer backdrop-blur-sm bg-black/10 hover:bg-black/20 
                  transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedImage(image)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <motion.img
                      src="https://image.tmdb.org/t/p/original/e8tHXl2Pmk972K00uoPuCXsJXDO.jpg"
                      alt={image.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                        <h3 className="text-white text-lg font-semibold transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {image.title}
                        </h3>
                        <p className="text-gray-200 text-sm line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          {image.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500">
              {selectedImage?.title}
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-lg">
              <motion.img
                src="https://image.tmdb.org/t/p/original/e8tHXl2Pmk972K00uoPuCXsJXDO.jpg"
                alt={selectedImage?.title}
                className="w-full rounded-lg"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              {selectedImage?.description}
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}