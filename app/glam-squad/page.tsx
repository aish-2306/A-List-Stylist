"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Lead Fashion Designer",
    bio: "Former Vogue stylist with 10+ years experience",
    image: "/placeholder.svg?height=200&width=200&text=Sarah",
    quote: "Style is a way to say who you are without having to speak",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "AI Fashion Specialist",
    bio: "Tech meets fashion in the most innovative ways",
    image: "/placeholder.svg?height=200&width=200&text=Marcus",
    quote: "The future of fashion is personal and intelligent",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Color & Texture Expert",
    bio: "Master of palettes and fabric combinations",
    image: "/placeholder.svg?height=200&width=200&text=Elena",
    quote: "Every color tells a story, every texture has a voice",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Trend Forecaster",
    bio: "Predicting tomorrow's fashion today",
    image: "/placeholder.svg?height=200&width=200&text=David",
    quote: "Fashion is about dreaming and making dreams come true",
  },
]

const marqueeQuotes = [
  "Style is eternal • Fashion fades • Confidence is key • Be your own muse • Dress for yourself • Fashion is art • Style is personal • Trends come and go • Your style is forever",
]

export default function GlamSquadPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-stone-100 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-100/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/home" className="flex items-center text-stone-900 hover:text-emerald-900 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-emerald-900">Our Glam Squad</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
              Our <span className="text-amber-600">Glam Squad</span>
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Meet the creative minds behind your perfect style. Our team of fashion experts, AI specialists, and trend
              forecasters work together to bring you the future of personal styling.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Pop-up photo effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: hoveredMember === member.id ? 1 : 0,
                        scale: hoveredMember === member.id ? 1 : 0.8,
                        y: hoveredMember === member.id ? -10 : 20,
                      }}
                      className="absolute -top-4 -right-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
                    >
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-stone-600 text-sm">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quotes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-emerald-900 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-stone-100 mb-8">Words from Our Squad</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {teamMembers.slice(0, 2).map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="bg-stone-100 p-6 rounded-xl"
                >
                  <p className="text-stone-900 italic mb-4">"{member.quote}"</p>
                  <p className="text-amber-600 font-semibold">- {member.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-600 py-3 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="flex space-x-8 whitespace-nowrap"
        >
          {[...marqueeQuotes, ...marqueeQuotes, ...marqueeQuotes].map((quote, index) => (
            <span key={index} className="text-stone-100 text-lg font-medium">
              {quote}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-16 right-8 z-30"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-900">
            <Image
              src="/placeholder.svg?height=100&width=100&text=Stylist"
              alt="Your stylist"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-16 -left-48 bg-white p-3 rounded-2xl shadow-lg max-w-xs"
          >
            <p className="text-stone-900 font-medium">These are the legends who make the magic happen! 🌟</p>
            <div className="absolute bottom-0 right-4 transform translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
