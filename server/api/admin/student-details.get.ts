// server/api/admin/student-details.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const conn = useDb()

  if (!id) {
    throw createError({ statusCode: 400, message: 'Student ID is required' })
  }

  try {
    // 1. Fetch Student Profile
    // We expect exactly one record for a valid ID.
    const studentQuery = 'SELECT * FROM students WHERE id = ?'
    const studentRes: any = await conn.execute(studentQuery, [id])
    const rows = Array.isArray(studentRes) ? studentRes : studentRes.rows || []

    if (rows.length === 0) {
      throw createError({ statusCode: 404, message: 'Student not found' })
    }

    const student = rows[0]

    // 2. Fetch Academic History
    // Group records by Session/Term/Class to create a summary view.
    // We use a separate try-catch here to ensure profile loads even if history fails.
    let history = []
    try {
      const historyQuery = `
        SELECT 
          session, 
          term, 
          class_level,
          MAX(created_at) as date_generated
        FROM academic_records 
        WHERE student_id = ? 
        GROUP BY session, term, class_level
        ORDER BY session DESC, term DESC
      `
      
      const historyRes: any = await conn.execute(historyQuery, [id])
      history = Array.isArray(historyRes) ? historyRes : historyRes.rows || []
      
    } catch (historyErr) {
      // Fail silently for history to allow profile rendering
      // This usually happens if the academic_records table is empty or missing
    }

    return { 
      student,
      history
    }

  } catch (error: any) {
    // 3. Global Error Handler
    // Re-throw known HTTP errors (like 404), wrap unknown DB errors as 500.
    if (error.statusCode) throw error
    
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Internal Server Error' 
    })
  }
})