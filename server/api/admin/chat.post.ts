import { defineEventHandler, readBody } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'
import getAllResults from './all-results.get' 

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userQuestion = body.message

  try {
    // 1. GET THE FULL DATA
    const fullSchoolData = await getAllResults(event)

    // --- FIX 1: HANDLE EMPTY DATA ---
    // If there are no students/results, don't bother the AI.
    if (!fullSchoolData || Object.keys(fullSchoolData).length === 0) {
      return { reply: "I checked the database, but there are no academic records uploaded yet. Please add some scores first!" }
    }

    // 2. CHECK API KEY
    if (!process.env.GEMINI_API_KEY) {
      return { reply: "System Error: AI API Key is missing. Please check the server logs." }
    }

    // 3. Prepare Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

    const prompt = `
      You are the Principal's AI Assistant for 'The Covenant Academy'.
      
      Here is the COMPLETE academic record for every student (JSON):
      ${JSON.stringify(fullSchoolData)}

      USER QUESTION: "${userQuestion}"

      INSTRUCTIONS:
      - Answer based strictly on the data above.
      - Be concise and professional.
    `

    // 4. Generate Answer
    const result = await model.generateContent(prompt)
    const response = result.response
    return { reply: response.text() }

  } catch (error: any) {
    // --- FIX 2: REAL ERROR LOGGING ---
    console.error("❌ AI Processing Error:", error)
    
    // Check for common quota/key errors
    if (error.message?.includes('API key')) {
        return { reply: "Configuration Error: Invalid AI API Key." }
    }
    
    return { reply: "I encountered an error. Please check the server console for details." }
  }
})