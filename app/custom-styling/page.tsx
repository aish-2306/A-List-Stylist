"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Ruler, Shirt } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const bodyTypes = [
  { id: "pear", name: "Pear", description: "Hips wider than shoulders" },
  { id: "apple", name: "Apple", description: "Fuller midsection" },
  { id: "hourglass", name: "Hourglass", description: "Balanced shoulders and hips" },
  { id: "rectangle", name: "Rectangle", description: "Similar measurements all around" },
  { id: "inverted-triangle", name: "Inverted Triangle", description: "Shoulders wider than hips" },
]

const outfitTypes = [
  { id: "dress", name: "Dress", icon: "👗" },
  { id: "shirt", name: "Shirt/Blouse", icon: "👔" },
  { id: "pants", name: "Pants/Trousers", icon: "👖" },
  { id: "skirt", name: "Skirt", icon: "🩱" },
  { id: "jacket", name: "Jacket/Blazer", icon: "🧥" },
  { id: "jumpsuit", name: "Jumpsuit", icon: "🩱" },
]

export default function CustomStylingPage() {
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    bodyType: "",
    outfitType: "",
  })
  const [avatarMessage, setAvatarMessage] = useState(
    "Alright bestie, let's get to know you better! Tell me about yourself! 💕",
  )

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Update avatar message based on progress
    const messages = {
      1: "Perfect! Now let's talk measurements - don't worry, this stays between us! 📏",
      2: "Amazing! Now tell me what body type describes you best! You're beautiful no matter what! 💖",
      3: "Last step bestie! What type of outfit are we styling today? ✨",
    }

    if (field === "weight" && value) {
      setAvatarMessage(messages[2])
      setTimeout(() => setCurrentStep(2), 500)
    } else if (field === "bodyType" && value) {
      setAvatarMessage(messages[3])
      setTimeout(() => setCurrentStep(3), 500)
    }
  }

  const handleSubmit = () => {
    localStorage.setItem("customFormData", JSON.stringify(formData))
    window.location.href = "/custom-results"
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.height && formData.weight && formData.bust && formData.waist && formData.hips
      case 2:
        return formData.bodyType
      case 3:
        return formData.outfitType
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/unique" className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">Custom Styling</h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Let's Get <span className="text-rose-400">Personal</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Tell me about yourself so I can create the perfect styling recommendations just for you
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= step ? "bg-rose-400 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step === 1 && <Ruler size={20} />}
                    {step === 2 && <User size={20} />}
                    {step === 3 && <Shirt size={20} />}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > step ? "bg-rose-400" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Measurements */}
          {currentStep >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <Card className="p-8 bg-white border border-gray-200">
                <h2 className="text-2xl font-medium text-zinc-800 mb-6 text-center">Step 1: Your Measurements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="height" className="text-zinc-700">
                        Height (e.g., 5'6")
                      </Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="5'6&quot;"
                        className="border-gray-300 focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-zinc-700">
                        Weight (lbs) - Optional
                      </Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="130"
                        className="border-gray-300 focus:border-rose-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bust" className="text-zinc-700">
                        Bust (inches)
                      </Label>
                      <Input
                        id="bust"
                        value={formData.bust}
                        onChange={(e) => handleInputChange("bust", e.target.value)}
                        placeholder="34"
                        className="border-gray-300 focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waist" className="text-zinc-700">
                        Waist (inches)
                      </Label>
                      <Input
                        id="waist"
                        value={formData.waist}
                        onChange={(e) => handleInputChange("waist", e.target.value)}
                        placeholder="28"
                        className="border-gray-300 focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hips" className="text-zinc-700">
                        Hips (inches)
                      </Label>
                      <Input
                        id="hips"
                        value={formData.hips}
                        onChange={(e) => handleInputChange("hips", e.target.value)}
                        placeholder="36"
                        className="border-gray-300 focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Body Type */}
          {currentStep >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <Card className="p-8 bg-white border border-gray-200">
                <h2 className="text-2xl font-medium text-zinc-800 mb-6 text-center">Step 2: Your Body Type</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bodyTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange("bodyType", type.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        formData.bodyType === type.id
                          ? "border-rose-400 bg-rose-50"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      <h3 className="font-medium text-zinc-800 mb-2">{type.name}</h3>
                      <p className="text-sm text-zinc-600">{type.description}</p>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Outfit Type */}
          {currentStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <Card className="p-8 bg-white border border-gray-200">
                <h2 className="text-2xl font-medium text-zinc-800 mb-6 text-center">Step 3: What Are We Styling?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {outfitTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange("outfitType", type.id)}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        formData.outfitType === type.id
                          ? "border-rose-400 bg-rose-50"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      <div className="text-3xl mb-3">{type.icon}</div>
                      <h3 className="font-medium text-zinc-800">{type.name}</h3>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Submit Button */}
          {isStepComplete(3) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <Button
                onClick={handleSubmit}
                className="bg-rose-400 hover:bg-rose-500 text-white px-12 py-6 text-2xl font-medium rounded-full"
              >
                Create My Custom Style! ✨
              </Button>
            </motion.div>
          )}
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
    </div>
  )
}
