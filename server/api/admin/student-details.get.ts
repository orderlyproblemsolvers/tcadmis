// server/api/admin/student-details.get.ts
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const conn = useDb()

  console.log(`[API] Fetching details for Student ID: ${id}`)

  if (!id) {
    throw createError({ statusCode: 400, message: 'Student ID is required' })
  }

  try {
    // 1. FETCH STUDENT (Basic Info)
    let student = null
    try {
      const result: any = await conn.execute('SELECT * FROM students WHERE id = ?', [id])
      const rows = Array.isArray(result) ? result : result.rows || []
      
      if (rows.length > 0) {
        student = rows[0]
      }
    } catch (dbErr: any) {
      console.error('[API] Student Fetch Error:', dbErr.message)
      throw createError({ statusCode: 500, message: `DB Error: ${dbErr.message}` })
    }

    if (!student) {
      throw createError({ statusCode: 404, message: 'Student not found' })
    }

    // 2. FETCH ACADEMIC HISTORY (Grouped by Session & Term)
    // We group by session and term so we don't get 10 rows for 10 subjects.
    // We treat session and term as strings (VARCHAR) which is perfectly fine.
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
      
    } catch (historyErr: any) {
      console.warn('[API] Warning: Could not fetch history (Table might be missing or empty):', historyErr.message)
    }

    return { 
      student,
      history
    }

  } catch (error: any) {
    console.error('[API] Critical Error:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Internal Server Error' 
    })
  }
})