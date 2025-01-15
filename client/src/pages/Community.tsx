import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/useToast"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Float } from "@react-three/drei"

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  timestamp: number;
}

interface FanArt {
  id: string;
  author: string;
  image: string;
  title: string;
  likes: number;
  timestamp: number;
}

// 3D Components
function FloatingHearts() {
  return (
    <group>
      {[...Array(20)].map((_, i) => (
        <Float
          key={i}
          speed={1} 
          rotationIntensity={1} 
          floatIntensity={2}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}
        >
          <mesh>
            <torusGeometry args={[0.2, 0.1, 16, 32]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function Community() {
  const [activeTab, setActiveTab] = useState("forum")
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [artTitle, setArtTitle] = useState("")
  const [artAuthorName, setArtAuthorName] = useState("")
  const [fanArt, setFanArt] = useState<FanArt[]>([])
  const { toast } = useToast()

  // Load posts and fan art from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('community-posts')
    const savedFanArt = localStorage.getItem('community-fanart')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
    if (savedFanArt) {
      setFanArt(JSON.parse(savedFanArt))
    }
  }, [])

  // Save posts and fan art to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('community-posts', JSON.stringify(posts))
    localStorage.setItem('community-fanart', JSON.stringify(fanArt))
  }, [posts, fanArt])

  const handleSubmitPost = () => {
    if (!newPost.trim() || !authorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name and message",
        variant: "destructive"
      })
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      author: artAuthorName,
      avatar: `/avatars/${Math.floor(Math.random() * 5) + 1}.jpg`,
      content: newPost,
      likes: 0,
      timestamp: Date.now()
    }

    setPosts(prev => [post, ...prev])
    setNewPost("")
    toast({
      title: "Success",
      description: "Your message has been posted!",
      className: "bg-green-500"
    })
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Store the image temporarily
        localStorage.setItem('temp-fanart-image', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleArtSubmit = () => {
    const imageData = localStorage.getItem('temp-fanart-image')
    if (!imageData || !artTitle || !artAuthorName) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select an image",
        variant: "destructive"
      })
      return
    }

    const newArt: FanArt = {
      id: Date.now(),
      author: artAuthorName,
      image: "https://image.tmdb.org/t/p/original/e8tHXl2Pmk972K00uoPuCXsJXDO.jpg",
      title: artTitle,
      likes: 0,
      timestamp: Date.now()
    }

    setFanArt(prev => [newArt, ...prev])
    // Clear all form fields
    setArtTitle("")
    setArtAuthorName("")
    localStorage.removeItem('temp-fanart-image')
    
    // Clear the file input by resetting its value
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    
    toast({
      title: "Success",
      description: "Your fan art has been shared!",
      className: "bg-green-500"
    })
  }

  const handleArtLike = (artId: number) => {
    setFanArt(prev => prev.map(art => 
      art.id === artId ? { ...art, likes: art.likes + 1 } : art
    ))
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="relative h-[200px] rounded-lg overflow-hidden mb-8">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingHearts />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      <Tabs defaultValue="forum" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum">Messages for Natasha</TabsTrigger>
          <TabsTrigger value="fanart">Fan Art Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-4">
          <Card className="backdrop-blur-sm bg-black/10">
            <CardContent className="p-4 space-y-4">
              <Input
                placeholder="Your Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mb-4"
              />
              <Textarea
                placeholder="Share your message for Black Widow..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSubmitPost} 
                className="bg-red-500 hover:bg-red-600 transition-all duration-300
                  hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
              >
                Post Message
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm bg-black/10 hover:bg-black/20 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{post.author}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="mb-4 text-gray-200">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleLike(post.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        ❤️ {post.likes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="fanart" className="space-y-6">
          <Card className="backdrop-blur-sm bg-black/10">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={artAuthorName}
                  onChange={(e) => setArtAuthorName(e.target.value)}
                  className="mb-4"
                />
                <Input
                  type="text"
                  placeholder="Art Title"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="mb-4"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-4"
                />
                <Button 
                  onClick={handleArtSubmit}
                  className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300
                    hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Share Your Art
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fanArt.map((art) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-black/10 hover:bg-black/20 transition-all duration-300">
                  <div className="relative aspect-square">
                    <img
                      src="https://image.tmdb.org/t/p/original/e8tHXl2Pmk972K00uoPuCXsJXDO.jpg"
                      alt={art.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{art.title}</h3>
                        <p className="text-sm text-gray-400">by {art.author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleArtLike(art.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        ❤️ {art.likes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}