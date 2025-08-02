"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const stylists = [
  {
    id: "sophia",
    name: "Sophia",
    bio: "Luxury fashion maven with timeless elegance",
    image: "/images/avatar-1.png",
  },
  {
    id: "maya",
    name: "Maya",
    bio: "Creative artist bringing color to your wardrobe",
    image: "/images/avatar-2.png",
  },
  {
    id: "luna",
    name: "Luna",
    bio: "Futuristic trendsetter with edgy vibes",
    image: "/images/avatar-3.png",
  },
]

// Floral elements for decoration
const FloralElement = ({ delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
    transition={{ duration: 1, delay }}
    className={`absolute text-rose-300 ${className}`}
  >
    🌸
  </motion.div>
)

export default function ChooseStylist() {
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  const handleStylistSelect = (stylistId: string) => {
    setSelectedStylist(stylistId)
    localStorage.setItem("selectedStylist", stylistId)
  }

  const handleStartStyling = () => {
    if (selectedStylist) {
      setShowAuth(true)
    }
  }

  if (showAuth) {
    return <AuthPage stylistId={selectedStylist!} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 font-['Inter'] relative overflow-hidden">
      {/* Floral Background Elements */}
      <FloralElement delay={0.2} className="top-10 left-10 text-4xl" />
      <FloralElement delay={0.4} className="top-20 right-20 text-3xl" />
      <FloralElement delay={0.6} className="bottom-20 left-20 text-5xl" />
      <FloralElement delay={0.8} className="bottom-10 right-10 text-3xl" />
      <FloralElement delay={1.0} className="top-1/2 left-10 text-2xl" />
      <FloralElement delay={1.2} className="top-1/3 right-10 text-4xl" />

      {/* Floating petals */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200 text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        >
          🌺
        </motion.div>
      ))}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Choose Your <span className="text-rose-400">Stylist</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Select your personal style guide to begin your VIP fashion journey
            </p>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {stylists.map((stylist, index) => (
            <motion.div
              key={stylist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.4 }}
            >
              <Card
                className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm ${
                  selectedStylist === stylist.id
                    ? "border-2 border-rose-300 shadow-lg ring-4 ring-rose-100"
                    : "border border-gray-200 hover:border-rose-200"
                }`}
                onClick={() => handleStylistSelect(stylist.id)}
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden"
                  >
                    <Image src={stylist.image || "/placeholder.svg"} alt={stylist.name} fill className="object-cover" />
                    {selectedStylist === stylist.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-rose-400/20 flex items-center justify-center"
                      >
                        <div className="text-4xl">✨</div>
                      </motion.div>
                    )}
                  </motion.div>
                  <h3 className="text-2xl font-medium text-zinc-800 mb-3">{stylist.name}</h3>
                  <p className="text-zinc-600">{stylist.bio}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <RippleButton
            onClick={handleStartStyling}
            disabled={!selectedStylist}
            className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-4 text-xl font-medium rounded-full disabled:opacity-50"
          >
            Start Styling! ✨
          </RippleButton>
        </motion.div>
      </div>
    </div>
  )
}

function AuthPage({ stylistId }: { stylistId: string }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const stylist = stylists.find((s) => s.id === stylistId)

  const handleAuth = async () => {
    setError(null)
    setLoading(true)
    let authResponse

    if (isSignUp) {
      authResponse = await supabase.auth.signUp({
        email,
        password,
      })
    } else {
      authResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      })
    }

    setLoading(false)

    if (authResponse.error) {
      setError(authResponse.error.message)
    } else if (authResponse.data.user) {
      setIsAuthenticated(true)
      setTimeout(() => {
        window.location.href = "/home"
      }, 2000)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-300 to-rose-500 flex items-center justify-center font-['Inter']">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <div className="w-80 h-80 mx-auto mb-8 rounded-3xl overflow-hidden">
              <Image
                src={stylist?.image || "/images/avatar-1.png"}
                alt={stylist?.name || "Stylist"}
                width={320}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-24 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-white p-6 rounded-3xl shadow-xl relative max-w-xs">
                <p className="text-zinc-800 font-medium text-lg">Welcome, Diva! 👑✨</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 font-['Inter'] relative overflow-hidden">
      {/* Floral Background */}
      <FloralElement delay={0.2} className="top-10 left-10 text-4xl" />
      <FloralElement delay={0.4} className="top-20 right-20 text-3xl" />
      <FloralElement delay={0.6} className="bottom-20 left-20 text-5xl" />

      <div className="flex min-h-screen">
        {/* Left Side - Avatar */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="w-80 h-80 rounded-3xl overflow-hidden">
              <Image
                src={stylist?.image || "/images/avatar-1.png"}
                alt={stylist?.name || "Stylist"}
                width={320}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-16 -right-8"
            >
              <div className="bg-white p-4 rounded-3xl shadow-xl relative max-w-xs">
                <p className="text-zinc-800 font-medium">
                  C'mon Girl, get the private room key to hop on to the fashion world! 🗝️✨
                </p>
                <div className="absolute bottom-0 left-8 transform translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border border-rose-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-zinc-800 mb-2">
                  {isSignUp ? "Join the VIP Club" : "Welcome Back, Diva"}
                </h2>
                <p className="text-zinc-600">
                  {isSignUp ? "Create your fashion account" : "Sign in to your style sanctuary"}
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAuth()
                }}
              >
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                      placeholder="Your fabulous name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                    placeholder="Your secret key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <RippleButton
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 text-lg font-medium rounded-xl"
                >
                  {loading
                    ? isSignUp
                      ? "Signing Up..."
                      : "Signing In..."
                    : isSignUp
                      ? "Join the Fashion World! ✨"
                      : "Enter VIP Lounge! 👑"}
                </RippleButton>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-rose-400 hover:text-rose-500 font-medium"
                >
                  {isSignUp ? "Already have an account? Sign In" : "New here? Join the VIP Club"}
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function RippleButton({
  children,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
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

    if (onClick) onClick()
  }

  return (
    <Button type={type} onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`}>
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
