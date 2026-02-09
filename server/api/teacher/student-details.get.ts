// server/api/teacher/student-details.get.ts
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const session = await requireUserSession(event)
  const conn = useDb()

  if (!id) throw createError({ statusCode: 400, message: 'Student ID required' })

  try {
    // 1. Fetch Student Info
    const studentQuery = `SELECT * FROM students WHERE id = ?`
    const result: any = await conn.execute(studentQuery, [id])
    const rows = Array.isArray(result) ? result : result.rows || []
    
    if (rows.length === 0) throw createError({ statusCode: 404, message: 'Student not found' })
    const student = rows[0]

    // 2. SECURITY CHECK (The Upgrade)
    // Verify that the student's class matches a class assigned to this teacher
    const authQuery = `SELECT name FROM classes WHERE name = ? AND teacher_id = ?`
    const authRes: any = await conn.execute(authQuery, [student.class_level, session.user.id])
    const authRows = Array.isArray(authRes) ? authRes : authRes.rows || []

    if (authRows.length === 0) {
      throw createError({ statusCode: 403, message: 'Unauthorized: This student is not in your assigned class.' })
    }

    // 3. Fetch History (The Upgrade)
    let history = []
    try {
       const historyQuery = `
          SELECT session, term, class_level
          FROM academic_records 
          WHERE student_id = ? 
          GROUP BY session, term, class_level
          ORDER BY session DESC, term DESC
        `
        const histRes: any = await conn.execute(historyQuery, [id])
        history = Array.isArray(histRes) ? histRes : histRes.rows || []
    } catch (e) {
        // Ignore if table doesn't exist yet
    }

    // Return BOTH pieces of data
    return { student, history }

  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, message: error.message })
  }
})