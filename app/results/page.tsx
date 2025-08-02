"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const similarStyles = [
  {
    id: 1,
    title: "Street Style Chic",
    description: "Similar outfit styled for casual elegance",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
    source: "Pinterest",
    link: "https://pinterest.com/pin/street-style-casual-chic",
    stylingTips: ["Layer with a denim jacket", "Add white sneakers", "Accessorize with gold jewelry"],
    shopLink: "https://www.zara.com/us/en/woman-c0.html",
  },
  {
    id: 2,
    title: "Office Ready",
    description: "Professional styling for the same piece",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
    source: "Instagram",
    link: "https://instagram.com/p/office-professional-style",
    stylingTips: ["Pair with blazer", "Add pointed toe heels", "Minimal jewelry"],
    shopLink: "https://www.hm.com/us/en/ladies.html",
  },
  {
    id: 3,
    title: "Date Night Glam",
    description: "Evening look with similar vibes",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
    source: "Fashion Blog",
    link: "https://www.whowhatwear.com/date-night-outfit-ideas",
    stylingTips: ["Add statement earrings", "Strappy heels", "Bold lip color"],
    shopLink: "https://www.asos.com/us/women/",
  },
]

export default function ResultsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [currentTip, setCurrentTip] = useState(0)
  const [savedItems, setSavedItems] = useState<number[]>([])

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)

    const savedImage = localStorage.getItem("uploadedImage")
    if (savedImage) setUploadedImage(savedImage)

    const saved = localStorage.getItem("savedOutfits")
    if (saved) setSavedItems(JSON.parse(saved))

    // Cycle through avatar messages
    const messages = [
      "OMG bestie! I found some FIRE styling inspo for you! 🔥",
      "These looks are giving main character energy! ✨",
      "Click the links to see where I found these gems! 💎",
      "Ready to slay with these styling tips? 👑",
    ]

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % messages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getStylistImage = () => {
    const images = {
      sophia: "/images/avatar-1.png",
      maya: "/images/avatar-2.png",
      luna: "/images/avatar-3.png",
    }
    return images[stylistId as keyof typeof images] || "/images/avatar-1.png"
  }

  const handleSave = (styleId: number) => {
    const newSaved = savedItems.includes(styleId) ? savedItems.filter((id) => id !== styleId) : [...savedItems, styleId]

    setSavedItems(newSaved)
    localStorage.setItem("savedOutfits", JSON.stringify(newSaved))

    // Also save to myOutfits
    const myOutfits = JSON.parse(localStorage.getItem("myOutfits") || "[]")
    const style = similarStyles.find((s) => s.id === styleId)
    if (style && !myOutfits.find((outfit: any) => outfit.id === styleId)) {
      myOutfits.push({
        ...style,
        savedAt: new Date().toISOString(),
        type: "inspiration",
      })
      localStorage.setItem("myOutfits", JSON.stringify(myOutfits))
    }
  }

  const handleShare = async (style: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this ${style.title} look!`,
          text: `I found this amazing ${style.description} on A-List Stylist!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
        fallbackShare(style)
      }
    } else {
      fallbackShare(style)
    }
  }

  const fallbackShare = (style: any) => {
    const text = `Check out this ${style.title} look! ${style.description} - Found on A-List Stylist`
    navigator.clipboard.writeText(text)
    alert("Link copied to clipboard!")
  }

  const avatarMessages = [
    "OMG bestie! I found some FIRE styling inspo for you! 🔥",
    "These looks are giving main character energy! ✨",
    "Click the links to see where I found these gems! 💎",
    "Ready to slay with these styling tips? 👑",
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/upload" className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">Style Inspiration Found!</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Style <span className="text-rose-400">Inspiration</span> Found!
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              I found some amazing ways to style similar pieces. Check out these looks!
            </p>
          </motion.div>

          {/* Your Upload + Similar Styles */}
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            {/* Your Original Upload */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <Card className="p-6 bg-white border border-gray-200 h-full">
                <h3 className="text-xl font-medium text-zinc-800 mb-4 text-center">Your Upload</h3>
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100">
                  {uploadedImage ? (
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Your uploaded outfit"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=240&h=320&fit=crop"
                        alt="Your uploaded outfit placeholder"
                        width={240}
                        height={320}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Similar Styles */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-6">
                {similarStyles.map((style, index) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200"
                      onMouseEnter={() => setHoveredCard(style.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="relative overflow-hidden">
                        <motion.div
                          animate={{
                            scale: hoveredCard === style.id ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          className="relative h-80 bg-gray-100"
                        >
                          <Image
                            src={style.image || "/placeholder.svg"}
                            alt={style.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: hoveredCard === style.id ? 1 : 0,
                          }}
                          className="absolute inset-0 bg-rose-400/90 flex items-center justify-center"
                        >
                          <div className="text-center text-white p-4">
                            <h4 className="font-medium mb-3">Styling Tips:</h4>
                            <ul className="text-sm space-y-1">
                              {style.stylingTips.map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-medium text-zinc-800 mb-2">{style.title}</h3>
                        <p className="text-zinc-600 mb-4">{style.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-rose-400 font-medium">Found on {style.source}</span>
                          <a
                            href={style.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-rose-400 hover:text-rose-500 text-sm font-medium"
                          >
                            View Source <ExternalLink size={14} className="ml-1" />
                          </a>
                        </div>

                        <div className="space-y-3">
                          <a href={style.shopLink} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full bg-rose-400 hover:bg-rose-500 text-white">Shop This Look</Button>
                          </a>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSave(style.id)}
                              className={`flex-1 border-rose-300 hover:bg-rose-50 bg-transparent ${
                                savedItems.includes(style.id) ? "text-rose-600 bg-rose-50" : "text-rose-400"
                              }`}
                            >
                              <Heart
                                size={16}
                                className="mr-2"
                                fill={savedItems.includes(style.id) ? "currentColor" : "none"}
                              />
                              {savedItems.includes(style.id) ? "Saved" : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShare(style)}
                              className="flex-1 border-rose-300 text-rose-400 hover:bg-rose-50 bg-transparent"
                            >
                              <Share2 size={16} className="mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-6"
          >
            <Button
              onClick={() => (window.location.href = "/upload")}
              className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-4 text-xl font-medium rounded-full mr-4"
            >
              Try Another Look ✨
            </Button>

            <div>
              <Link href="/digital-atelier" className="text-rose-400 hover:text-rose-500 font-medium underline text-lg">
                Create Your Own Style →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-8 z-30"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-rose-400 shadow-lg">
            <Image
              src={getStylistImage() || "/placeholder.svg"}
              alt="Your stylist"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          <motion.div
            key={currentTip}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full left-0 mb-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs"
          >
            <p className="text-zinc-800 font-medium text-sm">{avatarMessages[currentTip]}</p>
            <div className="absolute top-full left-4 transform -translate-y-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
