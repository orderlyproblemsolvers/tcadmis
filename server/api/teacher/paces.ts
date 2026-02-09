// server/api/teacher/paces.ts
export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const session = await requireUserSession(event)
  const conn = useDb()

  // --- GET: Fetch records for the grid ---
  if (method === 'GET') {
    const { student_id } = getQuery(event)

    if (!student_id) {
      throw createError({ statusCode: 400, message: 'Student ID is required' })
    }

    try {
      // Security: Ensure teacher is allowed to view this student (Optional but recommended)
      // You can copy the "SECURITY CHECK" logic from your student-details endpoint here if strictness is needed.

      const query = `
        SELECT subject, pace_number, score, is_completed 
        FROM pace_records 
        WHERE student_id = ?
      `
      const result: any = await conn.execute(query, [student_id])
      return Array.isArray(result) ? result : result.rows || []
      
    } catch (error: any) {
      throw createError({ statusCode: 500, message: error.message })
    }
  }

  // --- POST: Save a Record ---
  if (method === 'POST') {
    const body = await readBody(event)
    const { student_id, subject, pace_number, score, is_completed } = body

    // Validation
    if (!student_id || !subject || !pace_number) {
      throw createError({ statusCode: 400, message: 'Missing required fields' })
    }

    try {
      // UPSERT Logic for TiDB/MySQL
      const query = `
        INSERT INTO pace_records 
        (student_id, subject, pace_number, score, is_completed, updated_by, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
          score = VALUES(score), 
          is_completed = VALUES(is_completed),
          updated_by = VALUES(updated_by),
          updated_at = NOW()
      `

      await conn.execute(query, [
        student_id, 
        subject, 
        pace_number, 
        score || 0, 
        is_completed ? 1 : 0, // Ensure boolean is stored as tinyint(1) if needed
        session.user.id
      ])
      
      return { success: true }

    } catch (error: any) {
      console.error('Save Pace Error:', error)
      throw createError({ statusCode: 500, message: 'Failed to save pace record' })
    }
  }
})