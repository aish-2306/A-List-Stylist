"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Share2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const customRecommendations = [
  {
    id: 1,
    title: "Perfect Fit Blazer",
    description: "Tailored to enhance your silhouette",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=350&h=500&fit=crop",
    tips: ["Accentuates your waist", "Perfect shoulder fit", "Elongates your frame"],
    price: "$89",
    shopLink: "https://www.zara.com/us/en/woman-blazers-c269183.html",
  },
  {
    id: 2,
    title: "Flattering High-Waist Pants",
    description: "Designed for your body type",
    image: "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=350&h=500&fit=crop",
    tips: ["Highlights your best features", "Comfortable fit", "Versatile styling"],
    price: "$65",
    shopLink: "https://www.hm.com/us/en/ladies/trousers.html",
  },
  {
    id: 3,
    title: "Statement Accessories",
    description: "Complete your unique look",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=350&h=500&fit=crop",
    tips: ["Adds personality", "Complements your style", "Finishing touches"],
    price: "$45",
    shopLink: "https://www.asos.com/us/women/accessories/",
  },
]

export default function CustomResultsPage() {
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [formData, setFormData] = useState<any>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentTip, setCurrentTip] = useState(0)
  const [savedItems, setSavedItems] = useState<number[]>([])

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)

    const savedFormData = localStorage.getItem("customFormData")
    if (savedFormData) setFormData(JSON.parse(savedFormData))

    const saved = localStorage.getItem("savedOutfits")
    if (saved) setSavedItems(JSON.parse(saved))

    // Cycle through avatar messages
    const messages = [
      "OMG bestie! These custom looks are PERFECT for you! 🔥",
      "I designed these specifically for your body type! ✨",
      "You're gonna look absolutely stunning in these! 👑",
      "Ready to add these to your wardrobe? Let's shop! 🛍️",
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

  const handleSave = (recId: number) => {
    const newSaved = savedItems.includes(recId) ? savedItems.filter((id) => id !== recId) : [...savedItems, recId]

    setSavedItems(newSaved)
    localStorage.setItem("savedOutfits", JSON.stringify(newSaved))

    // Also save to myOutfits
    const myOutfits = JSON.parse(localStorage.getItem("myOutfits") || "[]")
    const rec = customRecommendations.find((r) => r.id === recId)
    if (rec && !myOutfits.find((outfit: any) => outfit.id === recId)) {
      myOutfits.push({
        ...rec,
        savedAt: new Date().toISOString(),
        type: "custom",
      })
      localStorage.setItem("myOutfits", JSON.stringify(myOutfits))
    }
  }

  const handleShare = async (rec: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this ${rec.title}!`,
          text: `I got this custom recommendation from A-List Stylist: ${rec.description}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
        fallbackShare(rec)
      }
    } else {
      fallbackShare(rec)
    }
  }

  const fallbackShare = (rec: any) => {
    const text = `Check out this ${rec.title}! ${rec.description} - Custom styled by A-List Stylist`
    navigator.clipboard.writeText(text)
    alert("Link copied to clipboard!")
  }

  const avatarMessages = [
    "OMG bestie! These custom looks are PERFECT for you! 🔥",
    "I designed these specifically for your body type! ✨",
    "You're gonna look absolutely stunning in these! 👑",
    "Ready to add these to your wardrobe? Let's shop! 🛍️",
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link
            href="/custom-styling"
            className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">Your Custom Style</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Your <span className="text-rose-400">Custom</span> Style
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Based on your measurements and preferences, here are your personalized recommendations
            </p>
          </motion.div>

          {/* Personal Details Summary */}
          {formData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
              <Card className="p-6 bg-white border border-gray-200">
                <h3 className="text-xl font-medium text-zinc-800 mb-4 text-center">Your Profile</h3>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-zinc-600">Height</p>
                    <p className="font-medium text-zinc-800">{formData.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Body Type</p>
                    <p className="font-medium text-zinc-800 capitalize">{formData.bodyType?.replace("-", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Styling</p>
                    <p className="font-medium text-zinc-800 capitalize">{formData.outfitType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">Measurements</p>
                    <p className="font-medium text-zinc-800">
                      {formData.bust}-{formData.waist}-{formData.hips}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Custom Recommendations */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {customRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-200"
                  onMouseEnter={() => setHoveredCard(rec.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative overflow-hidden">
                    <motion.div
                      animate={{
                        scale: hoveredCard === rec.id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative h-80 bg-gray-100"
                    >
                      <Image
                        src={rec.image || "/placeholder.svg"}
                        alt={rec.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredCard === rec.id ? 1 : 0,
                      }}
                      className="absolute inset-0 bg-rose-400/90 flex items-center justify-center"
                    >
                      <div className="text-center text-white p-4">
                        <h4 className="font-medium mb-3">Why This Works:</h4>
                        <ul className="text-sm space-y-1">
                          {rec.tips.map((tip, i) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium text-zinc-800">{rec.title}</h3>
                      <span className="text-lg font-bold text-rose-400">{rec.price}</span>
                    </div>
                    <p className="text-zinc-600 mb-6">{rec.description}</p>

                    <div className="space-y-3">
                      <a href={rec.shopLink} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-rose-400 hover:bg-rose-500 text-white">
                          <ShoppingBag size={16} className="mr-2" />
                          Shop Now
                        </Button>
                      </a>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(rec.id)}
                          className={`flex-1 border-rose-300 hover:bg-rose-50 bg-transparent ${
                            savedItems.includes(rec.id) ? "text-rose-600 bg-rose-50" : "text-rose-400"
                          }`}
                        >
                          <Heart
                            size={16}
                            className="mr-2"
                            fill={savedItems.includes(rec.id) ? "currentColor" : "none"}
                          />
                          {savedItems.includes(rec.id) ? "Saved" : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShare(rec)}
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

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-6"
          >
            <RippleButton
              onClick={() => (window.location.href = "/upload")}
              className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-4 text-xl font-medium rounded-full mr-4"
            >
              Style Another Look ✨
            </RippleButton>

            <div>
              <Link href="/digital-atelier" className="text-rose-400 hover:text-rose-500 font-medium underline text-lg">
                Experiment in Digital Atelier →
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

function RippleButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)

    onClick()
  }

  return (
    <Button onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </Button>
  )
}
