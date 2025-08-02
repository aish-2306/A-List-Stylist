"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface AnalyzeOutfitResult {
  foundSimilar: boolean
  message: string
}

export async function analyzeOutfitAndStyle(imageData: string, selectedStyle: string): Promise<AnalyzeOutfitResult> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Log the API key to check if it's available in the environment
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "****** (present)" : "Not set")

  try {
    // Explicitly check if the API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please ensure it's set in your environment variables.")
    }

    const prompt = `Analyze an outfit image (represented by its base64 data, though not directly processed here) and determine if it aligns with a "${selectedStyle}" style.
    
    Consider the following:
    - If the style is very common or versatile (e.g., "casual", "chic"), it's more likely to find similar styles.
    - If the style is niche or highly specific (e.g., "vintage", "boho", "edgy"), it's more likely to be considered unique.
    - Always provide a clear "found similar" or "unique" outcome.

    Based on a hypothetical analysis of an image and the user's desire for a "${selectedStyle}" style, should similar styles be found or is this outfit unique? Respond with "found_similar" or "unique_style".`

    const { text } = await generateText({
      model: openai("gpt-4o", { apiKey: process.env.OPENAI_API_KEY }), // Pass the API key here
      prompt: prompt,
    })

    const result = text.toLowerCase().includes("unique_style") ? "unique" : "found"

    if (result === "found") {
      return {
        foundSimilar: true,
        message: "OMG! I found some amazing similar looks! Let me show you! 🎉",
      }
    } else {
      return {
        foundSimilar: false,
        message: "Wow, your style is so unique! I couldn't find anything similar! 🦄",
      }
    }
  } catch (error: any) {
    console.error("AI analysis simulation failed:", error.message)
    // Fallback to random if AI SDK call fails or API key is missing
    const foundSimilar = Math.random() > 0.3
    return {
      foundSimilar,
      message: foundSimilar
        ? "Oops, AI had a moment! But I found some amazing similar looks! 🎉"
        : "Oops, AI had a moment! Your style is still super unique! 🦄",
    }
  }
}
