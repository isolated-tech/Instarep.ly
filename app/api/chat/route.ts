import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, profile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build system prompt based on profile settings
    let systemPrompt = "You are a helpful AI assistant for Instarep.ly, an AI keyboard that helps creators reply to messages."

    // Add tone instruction
    if (profile?.tone) {
      const toneInstructions = {
        professional: "Respond in a professional and business-appropriate manner.",
        friendly: "Respond in a warm, friendly, and approachable manner.",
        casual: "Respond in a casual and relaxed manner.",
        formal: "Respond in a formal and respectful manner.",
      }
      systemPrompt += ` ${toneInstructions[profile.tone as keyof typeof toneInstructions] || toneInstructions.friendly}`
    }

    // CRITICAL: Add emoji instruction based on profile setting
    if (profile?.includeEmojis === false) {
      systemPrompt += " IMPORTANT: Do NOT use any emojis in your response. Keep all responses text-only without any emoji characters."
    } else {
      systemPrompt += " Feel free to use emojis to make your responses more engaging and expressive."
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Mock response for testing when no API key is configured
      const mockResponse = profile?.includeEmojis
        ? `Great question! 😊 I'd be happy to help you with that. Let me provide a comprehensive response that addresses your query. ✨ This is a demo response showing how the emoji toggle works! 🎉`
        : `Great question! I would be happy to help you with that. Let me provide a comprehensive response that addresses your query. This is a demo response showing how the emoji toggle works when emojis are disabled.`

      return NextResponse.json({
        response: mockResponse,
        isDemo: true,
        profileSettings: {
          includeEmojis: profile?.includeEmojis ?? true,
          tone: profile?.tone || "friendly",
        },
      })
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
    }

    const data = await openaiResponse.json()
    const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    return NextResponse.json({
      response: aiResponse,
      isDemo: false,
      profileSettings: {
        includeEmojis: profile?.includeEmojis ?? true,
        tone: profile?.tone || "friendly",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
