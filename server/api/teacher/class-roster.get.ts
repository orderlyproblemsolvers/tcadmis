// server/api/teacher/class-roster.get.ts
export default defineEventHandler(async (event) => {
  const { class_name } = getQuery(event)
  const session = await requireUserSession(event)
  const conn = useDb()

  console.log(`[API] Fetching roster for class: ${class_name} | Teacher: ${session.user.id}`)

  try {
    // 1. SECURITY CHECK
    // CHANGED: We select 'name' instead of 'id' because 'id' does not exist
    const verifyQuery = `SELECT name FROM classes WHERE name = ? AND teacher_id = ?`
    
    const verifyResult = await conn.execute(verifyQuery, [class_name, session.user.id])
    // Handle TiDB array vs object response
    const verifyRows = Array.isArray(verifyResult) ? verifyResult : (verifyResult as any).rows || []
    
    if (verifyRows.length === 0) {
      throw createError({ statusCode: 403, message: 'Unauthorized: You are not assigned to this class.' })
    }

    // 2. FETCH STUDENTS
    const studentsQuery = `
      SELECT id, first_name, last_name, admission_number, gender 
      FROM students 
      WHERE class_level = ? 
      ORDER BY last_name ASC
    `
    const result = await conn.execute(studentsQuery, [class_name])
    const students = Array.isArray(result) ? result : (result as any).rows || []

    return { 
      class_name, 
      students 
    }

  } catch (error: any) {
    console.error('Class Roster Error:', error)
    throw createError({ statusCode: 500, message: error.message })
  }
})