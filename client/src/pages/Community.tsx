import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const forumPosts = [
  {
    id: 1,
    author: "BlackWidowFan",
    avatar: "/avatars/1.jpg",
    content: "Just rewatched the Budapest scene for the 100th time! 🕷️",
    likes: 42,
    replies: 15
  },
  {
    id: 2,
    author: "MarvelExpert",
    avatar: "/avatars/2.jpg",
    content: "What's your favorite Black Widow fight scene?",
    likes: 38,
    replies: 24
  }
]

const fanArt = [
  {
    id: 1,
    author: "ArtistSupreme",
    image: "/fan-art/1.jpg",
    title: "Black Widow in Action",
    likes: 156
  },
  {
    id: 2,
    author: "CreativeSpirit",
    image: "/fan-art/2.jpg",
    title: "Natasha's Legacy",
    likes: 203
  }
]

export function Community() {
  const [activeTab, setActiveTab] = useState("forum")
  const [newPost, setNewPost] = useState("")

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-red-500">Community Hub</h1>

      <Tabs defaultValue="forum" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
          <TabsTrigger value="fanart">Fan Art Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-4">
          <Card className="backdrop-blur-sm bg-black/10">
            <CardContent className="p-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
              />
              <Button className="bg-red-500 hover:bg-red-600">Post</Button>
            </CardContent>
          </Card>

          {forumPosts.map((post) => (
            <Card key={post.id} className="backdrop-blur-sm bg-black/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{post.author}</span>
                </div>
                <p className="mb-4">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{post.likes} likes</span>
                  <span>{post.replies} replies</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fanart" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fanArt.map((art) => (
              <Card key={art.id} className="backdrop-blur-sm bg-black/10">
                <CardHeader>
                  <CardTitle className="text-lg">{art.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">by {art.author}</span>
                    <span className="text-sm text-gray-400">{art.likes} likes</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}