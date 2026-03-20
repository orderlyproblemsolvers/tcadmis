import { defineEventHandler, readBody, createError } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default defineEventHandler(async (event) => {
  const sessionUser = await requireUserSession(event)
  if (sessionUser.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const userQuestion = body.message
  const context = body.context || {} // The filters we sent from the frontend
  
  const conn = useDb()

  try {
    // 1. EXTRACT FILTERS
    const sessionVal = context.session || '2025/2026'
    const termVal = context.term || '1st Term'
    const classVal = context.class_level || 'All'

    // 2. FETCH ONLY RELEVANT DATA 
    // Instead of getting the whole DB, we only get records for the current term/session
    let query = `
      SELECT 
        s.first_name, s.last_name, s.class_level,
        ar.subject, 
        (COALESCE(ar.ca1_score, 0) + COALESCE(ar.ca2_score, 0) + COALESCE(ar.assignment_score, 0) + 
         COALESCE(ar.class_exercise_score, 0) + COALESCE(ar.affective_score, 0) + 
         COALESCE(ar.psychomotor_score, 0) + COALESCE(ar.exam_score, 0)) as total
      FROM academic_records ar
      JOIN students s ON ar.student_id = s.id
      WHERE ar.session = ? AND ar.term = ?
    `
    let queryParams: any[] = [sessionVal, termVal]

    if (classVal !== 'All') {
      query += ` AND ar.class_level = ?`
      queryParams.push(classVal)
    }

    const rawResult: any = await conn.execute(query, queryParams)
    
    // Safely extract rows
    const records = Array.isArray(rawResult) ? rawResult : (rawResult.rows || [])

    if (records.length === 0) {
      return { reply: `I checked the database, but there are no academic records uploaded for ${termVal} of the ${sessionVal} session yet.` }
    }

    // Group by student to make it easier for the AI to read
    const groupedData: any = {}
    records.forEach((row: any) => {
      const studentName = `${row.first_name} ${row.last_name} (${row.class_level})`
      if (!groupedData[studentName]) groupedData[studentName] = {}
      groupedData[studentName][row.subject] = row.total
    })

    // 3. CHECK API KEY
    if (!process.env.GEMINI_API_KEY) {
      return { reply: "System Error: AI API Key is missing. Please check the server logs." }
    }

    // 4. PREPARE GEMINI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Note: Updated to a stable model. 'gemini-3-flash-preview' is not a standard stable version.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are the Principal's AI Assistant for 'The Covenant Academy'. Answer based strictly on the provided JSON data. Be concise, professional, and do not hallucinate grades."
    })

    const prompt = `
      The admin is currently looking at the dashboard for:
      Session: ${sessionVal}
      Term: ${termVal}
      Class: ${classVal}
      
      Here is the academic data for this specific selection (JSON):
      ${JSON.stringify(groupedData)}

      USER QUESTION: "${userQuestion}"
    `

    // 5. GENERATE ANSWER
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    return { reply: response.text() }

  } catch (error: any) {
    console.error("❌ AI Processing Error:", error)
    
    if (error.message?.includes('API key')) {
        return { reply: "Configuration Error: Invalid AI API Key." }
    }
    
    return { reply: "I encountered an error analyzing the data. Please check the server console for details." }
  }
})