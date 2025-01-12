import { useEffect, useState } from "react"
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
      <h1 className="text-3xl font-bold text-red-500">Black Widow Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card
            key={image.id}
            className="group cursor-pointer backdrop-blur-sm bg-black/10 hover:bg-black/20 transition-all"
            onClick={() => setSelectedImage(image)}
          >
            <CardContent className="p-4">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-2 text-lg font-semibold">{image.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={selectedImage?.url}
              alt={selectedImage?.title}
              className="w-full rounded-lg"
            />
            <p className="text-gray-400">{selectedImage?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}