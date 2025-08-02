"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Menu, X, Heart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [myOutfits, setMyOutfits] = useState<any[]>([])
  const [showOutfits, setShowOutfits] = useState(false)

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)

    const savedOutfits = localStorage.getItem("myOutfits")
    if (savedOutfits) setMyOutfits(JSON.parse(savedOutfits))

    const timer = setTimeout(() => setShowAvatar(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStylistImage = () => {
    const images = {
      sophia: "/images/avatar-1.png",
      maya: "/images/avatar-2.png",
      luna: "/images/avatar-3.png",
    }
    return images[stylistId as keyof typeof images] || "/images/avatar-1.png"
  }

  const handleDeleteOutfit = (outfitId: number) => {
    const updatedOutfits = myOutfits.filter((outfit) => outfit.id !== outfitId)
    setMyOutfits(updatedOutfits)
    localStorage.setItem("myOutfits", JSON.stringify(updatedOutfits))
  }

  const handleViewOutfit = (outfit: any) => {
    localStorage.setItem("loadOutfit", JSON.stringify(outfit))
    // Removed navigation to /digital-atelier as it's being removed
    // window.location.href = "/digital-atelier"
    // You might want to redirect to /results or remove this functionality if no alternative view exists
    window.location.href = "/results" // Redirect to results page as an alternative
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-light text-zinc-800">
            A-List <span className="text-rose-400">Stylist</span>
          </Link>

          <div className="flex items-center space-x-4">
            {myOutfits.length > 0 && (
              <Button
                onClick={() => setShowOutfits(!showOutfits)}
                variant="outline"
                className="border-rose-300 text-rose-400 hover:bg-rose-50"
              >
                <Heart size={16} className="mr-2" />
                My Outfits ({myOutfits.length})
              </Button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-800 hover:text-rose-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-rose-400 flex items-center justify-center"
          >
            <div className="text-center space-y-12">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <Link
                  href="/upload"
                  className="block text-5xl font-light text-white hover:text-rose-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Styling!
                </Link>
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Link
                  href="/"
                  className="block text-5xl font-light text-white hover:text-rose-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Change Stylist
                </Link>
              </motion.div>
              {/* Removed Digital Atelier Link */}
              {/* <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Link
                  href="/digital-atelier"
                  className="block text-5xl font-light text-white hover:text-rose-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Digital Atelier
                </Link>
              </motion.div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Outfits Sidebar */}
      <AnimatePresence>
        {showOutfits && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-zinc-800">My Outfits</h2>
                <button onClick={() => setShowOutfits(false)} className="p-2 text-zinc-600 hover:text-zinc-800">
                  <X size={20} />
                </button>
              </div>

              {myOutfits.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-zinc-600">No saved outfits yet!</p>
                  <p className="text-sm text-zinc-400 mt-2">Start styling to save your favorite looks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOutfits.map((outfit) => (
                    <Card key={outfit.id} className="p-4 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        {outfit.image && (
                          <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={outfit.image || "/placeholder.svg"}
                              alt={outfit.title || outfit.name}
                              width={64}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-zinc-800 truncate">{outfit.title || outfit.name}</h3>
                          <p className="text-sm text-zinc-600 mt-1">
                            {outfit.description ||
                              `Saved ${new Date(outfit.savedAt || outfit.createdAt).toLocaleDateString()}`}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded">
                              {outfit.type === "custom" ? "Custom" : "Inspiration"}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOutfit(outfit)}
                                className="text-xs px-2 py-1 h-auto border-rose-200 text-rose-400 hover:bg-rose-50"
                              >
                                View
                              </Button>
                              <button
                                onClick={() => handleDeleteOutfit(outfit.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-light text-zinc-800 mb-8"
          >
            Your style, <span className="text-rose-400">unbound.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-zinc-600 mb-12 max-w-2xl mx-auto"
          >
            Upload your outfit and discover personalized styling inspiration powered by AI
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <RippleButton
              onClick={() => (window.location.href = "/upload")}
              className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-6 text-2xl font-medium rounded-full"
            >
              Start Styling! ✨
            </RippleButton>
          </motion.div>
        </div>
      </section>

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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-full left-0 mb-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs"
              >
                <p className="text-zinc-800 font-medium text-sm">
                  Hey bestie! Ready to find your perfect style? Upload your outfit and let me work my magic! ✨
                </p>
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
