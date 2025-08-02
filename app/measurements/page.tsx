"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Ruler, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MeasurementsPage() {
  const [stylistId, setStylistId] = useState<string>("sophia")
  const [avatarMessage, setAvatarMessage] = useState(
    "Let's get your measurements! This helps me find the perfect fit for you. Don't worry, it's all confidential! 📏",
  )
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    inseam: "",
    shoeSize: "",
  })
  const [unitSystem, setUnitSystem] = useState("imperial") // 'imperial' or 'metric'

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0])
  const textScale = useTransform(scrollY, [0, 100], [1, 0.8])

  useEffect(() => {
    const savedStylist = localStorage.getItem("selectedStylist")
    if (savedStylist) setStylistId(savedStylist)

    const savedMeasurements = localStorage.getItem("userMeasurements")
    if (savedMeasurements) {
      setMeasurements(JSON.parse(savedMeasurements))
      setAvatarMessage("Welcome back! Your measurements are loaded. Ready to find some amazing outfits? ✨")
    }

    const savedUnitSystem = localStorage.getItem("unitSystem")
    if (savedUnitSystem) {
      setUnitSystem(savedUnitSystem)
    }
  }, [])

  const getStylistImage = () => {
    const images = {
      sophia: "/images/avatar-1.png",
      maya: "/images/avatar-2.png",
      luna: "/images/avatar-3.png",
    }
    return images[stylistId as keyof typeof images] || "/images/avatar-1.png"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setMeasurements((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveMeasurements = () => {
    localStorage.setItem("userMeasurements", JSON.stringify(measurements))
    localStorage.setItem("unitSystem", unitSystem)
    setAvatarMessage("Got it! Your measurements are saved. Now let's find some looks that fit you perfectly! 💖")
    setTimeout(() => {
      window.location.href = "/custom-styling"
    }, 2000)
  }

  const convertValue = (value: string, fromUnit: string, toUnit: string, type: "length" | "weight") => {
    if (!value) return ""
    const num = Number.parseFloat(value)
    if (isNaN(num)) return value

    if (fromUnit === toUnit) return value

    if (type === "length") {
      if (fromUnit === "imperial" && toUnit === "metric") {
        // Assuming imperial length is inches for simplicity, convert to cm
        return (num * 2.54).toFixed(1)
      } else if (fromUnit === "metric" && toUnit === "imperial") {
        // Assuming metric length is cm, convert to inches
        return (num / 2.54).toFixed(1)
      }
    } else if (type === "weight") {
      if (fromUnit === "imperial" && toUnit === "metric") {
        // Assuming imperial weight is lbs, convert to kg
        return (num * 0.453592).toFixed(1)
      } else if (fromUnit === "metric" && toUnit === "imperial") {
        // Assuming metric weight is kg, convert to lbs
        return (num / 0.453592).toFixed(1)
      }
    }
    return value
  }

  const handleUnitChange = (newUnit: string) => {
    const oldUnit = unitSystem
    setUnitSystem(newUnit)

    setMeasurements((prev) => ({
      height: convertValue(prev.height, oldUnit, newUnit, "length"),
      weight: convertValue(prev.weight, oldUnit, newUnit, "weight"),
      bust: convertValue(prev.bust, oldUnit, newUnit, "length"),
      waist: convertValue(prev.waist, oldUnit, newUnit, "length"),
      hips: convertValue(prev.hips, oldUnit, newUnit, "length"),
      inseam: convertValue(prev.inseam, oldUnit, newUnit, "length"),
      shoeSize: prev.shoeSize, // Shoe size conversion is more complex, keep as is for now
    }))
    localStorage.setItem("unitSystem", newUnit)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 font-['Inter'] relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-100/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/home" className="flex items-center text-zinc-800 hover:text-rose-400 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-light text-zinc-800">
            Your <span className="text-rose-400">Measurements</span>
          </h1>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            style={{ opacity: headerOpacity, scale: textScale }}
            className="text-center mb-16 sticky top-24 z-10 bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 pt-4 pb-8 rounded-b-xl"
          >
            <h1 className="text-5xl md:text-7xl font-light text-zinc-800 mb-6">
              Your <span className="text-rose-400">Measurements</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Help us find your perfect fit by providing your body measurements.
            </p>
          </motion.div>

          <Card className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-semibold text-zinc-800 flex items-center">
                <Ruler className="w-6 h-6 mr-2 text-rose-500" />
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="mb-6">
                <Label htmlFor="unit-system" className="mb-2 block">
                  Measurement System
                </Label>
                <Select onValueChange={handleUnitChange} value={unitSystem}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select unit system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imperial">Imperial (ft/in, lbs)</SelectItem>
                    <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="height" className="mb-2 block">
                    Height ({unitSystem === "imperial" ? "ft/in" : "cm"})
                  </Label>
                  <Input
                    id="height"
                    placeholder={unitSystem === "imperial" ? `e.g. 5'6"` : "e.g. 168"}
                    value={measurements.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="mb-2 block">
                    Weight ({unitSystem === "imperial" ? "lbs" : "kg"})
                  </Label>
                  <Input
                    id="weight"
                    placeholder={unitSystem === "imperial" ? "e.g. 140" : "e.g. 63.5"}
                    value={measurements.weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bust" className="mb-2 block">
                    Bust ({unitSystem === "imperial" ? "inches" : "cm"})
                  </Label>
                  <Input
                    id="bust"
                    placeholder={unitSystem === "imperial" ? "e.g. 34" : "e.g. 86"}
                    value={measurements.bust}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="waist" className="mb-2 block">
                    Waist ({unitSystem === "imperial" ? "inches" : "cm"})
                  </Label>
                  <Input
                    id="waist"
                    placeholder={unitSystem === "imperial" ? "e.g. 28" : "e.g. 71"}
                    value={measurements.waist}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="hips" className="mb-2 block">
                    Hips ({unitSystem === "imperial" ? "inches" : "cm"})
                  </Label>
                  <Input
                    id="hips"
                    placeholder={unitSystem === "imperial" ? "e.g. 38" : "e.g. 96"}
                    value={measurements.hips}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="inseam" className="mb-2 block">
                    Inseam ({unitSystem === "imperial" ? "inches" : "cm"})
                  </Label>
                  <Input
                    id="inseam"
                    placeholder={unitSystem === "imperial" ? "e.g. 30" : "e.g. 76"}
                    value={measurements.inseam}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="shoeSize" className="mb-2 block">
                    Shoe Size (US)
                  </Label>
                  <Input
                    id="shoeSize"
                    placeholder="e.g. 7.5"
                    value={measurements.shoeSize}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleSaveMeasurements}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 text-lg font-medium rounded-xl"
                >
                  <Save size={16} className="mr-2" />
                  Save Measurements
                </Button>
                <Link href="/custom-styling" passHref>
                  <Button
                    variant="outline"
                    className="w-full py-3 text-lg bg-transparent border-rose-300 text-rose-400 hover:bg-rose-50 rounded-xl"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Continue to Styling
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
