"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UniquePage() {
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)

    const savedImage = localStorage.getItem("uploadedImage")
    if (savedImage) setUploadedImage(savedImage)
  }, [])

  const getStylistImage = () => {
    const images = {
      sophia: "/images/avatar-1.png",
      maya: "/images/avatar-2.png",
      luna: "/images/avatar-3.png",
    }
    return images[stylistId as keyof typeof images] || "/images/avatar-1.png"
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/upload" className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">Unique Style Detected!</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Sparkles size={80} className="mx-auto text-rose-400 mb-6" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              <span className="text-rose-400">OOPS,</span> GUESS YOU GOT A<br />
              <span className="text-rose-400">UNIQUE TASTE,</span> GIRL!
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Your style is so original, I couldn't find anything similar! Let's create something custom just for you.
            </p>
          </motion.div>

          {/* Your Unique Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card className="p-8 bg-white border border-gray-200">
              <h3 className="text-2xl font-medium text-zinc-800 mb-6 text-center">Your One-of-a-Kind Style</h3>
              {uploadedImage && (
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Your unique outfit"
                    width={400}
                    height={500}
                    className="rounded-2xl shadow-lg mx-auto"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-rose-400 rounded-full flex items-center justify-center"
                  >
                    <Sparkles size={24} className="text-white" />
                  </motion.div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-medium text-zinc-800 mb-6">
              Let's Create Something <span className="text-rose-400">Amazing</span> Together!
            </h2>
            <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
              Since your style is so unique, let's work together to create the perfect styling recommendations. I'll
              need some details about you to make it perfect!
            </p>

            <RippleButton
              onClick={() => (window.location.href = "/custom-styling")}
              className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-6 text-2xl font-medium rounded-full"
            >
              Let's Create Magic! ✨
            </RippleButton>
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-full left-0 mb-4 bg-white p-4 rounded-2xl shadow-xl max-w-xs"
          >
            <p className="text-zinc-800 font-medium text-sm">
              Bestie, your style is SO unique! I'm literally obsessed! Let's make something custom for you! 💅✨
            </p>
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
