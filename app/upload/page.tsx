"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { analyzeOutfitAndStyle } from "@/actions/ai-analysis"

const styleOptions = [
  { id: "chic", name: "Chic", description: "Sophisticated and stylish" },
  { id: "boho", name: "Boho", description: "Free-spirited, earthy vibes" },
  { id: "formal", name: "Formal", description: "Elegant and polished" },
  { id: "aesthetic", name: "Aesthetic", description: "Visually pleasing, curated" },
  { id: "comfy", name: "Comfy", description: "Relaxed and cozy" },
  { id: "casual", name: "Casual", description: "Effortless and everyday" },
  { id: "vintage", name: "Vintage", description: "Retro and classic" },
  { id: "sporty", name: "Sporty", description: "Athletic and dynamic" },
  { id: "hot", name: "Hot", description: "Bold and confident" },
]

const avatarDialogues = {
  initial: "Hey bestie! Drop that outfit pic and let me work my magic! 📸✨",
  uploaded: "Ooh, I see you! Now, what vibe are we going for? ✨",
  chic: "Chic choice! You're about to serve some serious sophistication! 💅",
  boho: "Giving me free spirit vibes! Absolutely love this for you! 🌸",
  formal: "Ready to slay in elegance! This is going to be stunning! 👑",
  aesthetic: "Curated perfection! Your style is truly art! 🎨",
  comfy: "Cozy and stylish! Comfort is key, bestie! ☁️",
  casual: "Effortlessly cool! Casual never looked so good! 😎",
  vintage: "Timeless beauty! Bringing back the classics with a twist! 🕰️",
  sporty: "Athletic and fierce! Get ready to conquer the day! 👟",
  hot: "Serving main character energy! You're on fire! 🔥",
  analyzing: "Hold up bestie, I'm scanning the fashion universe for similar vibes... 🔍✨",
  found: "OMG! I found some amazing similar looks! Let me show you! 🎉",
  unique: "Wow, your style is so unique! I couldn't find anything similar! 🦄",
}

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [avatarMessage, setAvatarMessage] = useState(avatarDialogues.initial)
  const [showAvatar, setShowAvatar] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null)

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)
  }, [])

  const getStylistImage = () => {
    const images = {
      sophia: "/images/avatar-1.png",
      maya: "/images/avatar-2.png",
      luna: "/images/avatar-3.png",
    }
    return images[stylistId as keyof typeof images] || "/images/avatar-1.png"
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setAvatarMessage(avatarDialogues.uploaded)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStyleHover = (styleId: string) => {
    setHoveredStyle(styleId)
    setAvatarMessage(avatarDialogues[styleId as keyof typeof avatarDialogues] || avatarDialogues.uploaded)
  }

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    setAvatarMessage(avatarDialogues[styleId as keyof typeof avatarDialogues] || avatarDialogues.uploaded)
  }

  const handleAnalyze = async () => {
    if (!uploadedImage || !selectedStyle) return

    setIsAnalyzing(true)
    setAvatarMessage(avatarDialogues.analyzing)

    try {
      const { foundSimilar, message } = await analyzeOutfitAndStyle(uploadedImage, selectedStyle)

      localStorage.setItem("analysisResult", foundSimilar ? "found" : "unique")
      localStorage.setItem("uploadedImage", uploadedImage)
      localStorage.setItem("selectedStylePreference", selectedStyle) // Save selected style

      setAvatarMessage(message)
      setTimeout(() => {
        if (foundSimilar) {
          window.location.href = "/results"
        } else {
          window.location.href = "/unique"
        }
      }, 1000)
    } catch (error) {
      console.error("Analysis error:", error)
      // Fallback if server action fails
      const foundSimilar = Math.random() > 0.3
      localStorage.setItem("analysisResult", foundSimilar ? "found" : "unique")
      localStorage.setItem("uploadedImage", uploadedImage)
      localStorage.setItem("selectedStylePreference", selectedStyle)

      setAvatarMessage(foundSimilar ? avatarDialogues.found : avatarDialogues.unique)
      setTimeout(() => {
        if (foundSimilar) {
          window.location.href = "/results"
        } else {
          window.location.href = "/unique"
        }
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/home" className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">Upload Your Look</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Show Me Your <span className="text-rose-400">Style</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Upload your outfit and let our AI find the perfect styling inspiration for you
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Card className="p-12 bg-white border-2 border-dashed border-gray-300 hover:border-rose-300 transition-colors">
              {uploadedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="relative w-full max-w-md mx-auto mb-6">
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded outfit"
                      width={400}
                      height={500}
                      className="rounded-2xl shadow-lg mx-auto"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-4 border-rose-300 text-rose-400 hover:bg-rose-50"
                  >
                    Change Photo
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={64} className="mx-auto mb-6 text-rose-400" />
                  <h3 className="text-2xl font-medium text-zinc-800 mb-4">Drop your outfit photo here</h3>
                  <p className="text-zinc-600 mb-6">or click to browse from your device</p>
                  <Button className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full">
                    Choose Photo
                  </Button>
                </div>
              )}
            </Card>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </motion.div>

          {/* Style Options - NEW SECTION */}
          {uploadedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-zinc-800 mb-6 text-center">Choose Your Vibe</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {styleOptions.map((style, index) => (
                  <motion.div
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedStyle === style.id ? "ring-4 ring-rose-400 bg-rose-50" : ""
                      }`}
                      onMouseEnter={() => handleStyleHover(style.id)}
                      onClick={() => handleStyleSelect(style.id)}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-zinc-800 mb-2">{style.name}</h3>
                        <p className="text-zinc-600">{style.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analyze Button - Update condition */}
          {uploadedImage && selectedStyle && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <RippleButton
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-6 text-2xl font-medium rounded-full disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Analyzing Your Style...
                  </>
                ) : (
                  "Find My Style Inspiration! ✨"
                )}
              </RippleButton>
            </motion.div>
          )}
        </div>
      </div>

      {/* Avatar */}
      <AnimatePresence>
        {showAvatar && (
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
                key={avatarMessage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-full left-0 mb-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs"
              >
                <p className="text-zinc-800 font-medium text-sm">{avatarMessage}</p>
                <div className="absolute top-full left-4 transform -translate-y-1">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RippleButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

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
    <Button onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`}>
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
