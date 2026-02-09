// server/api/admin/dashboard-stats.get.ts
export default defineEventHandler(async (event) => {
  const conn = useDb()

  try {
    // This query is a bit of magic. It joins Classes, Users (Teachers), and counts Students.
    const query = `
      SELECT 
        c.name as class_name,
        u.full_name as teacher_name,
        u.id as teacher_id,
        (SELECT COUNT(*) FROM students s WHERE s.class_level = c.name) as student_count
      FROM classes c
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY c.name
    `
    
    // Also fetch ALL teachers so we can populate the dropdowns
    const teachersQuery = `SELECT id, full_name, email FROM users WHERE role = 'teacher'`

    const [classesResult, teachersResult] = await Promise.all([
      conn.execute(query),
      conn.execute(teachersQuery)
    ])

    return {
      classes: classesResult.rows || classesResult,
      teachers: teachersResult.rows || teachersResult
    }

  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message })
  }
})