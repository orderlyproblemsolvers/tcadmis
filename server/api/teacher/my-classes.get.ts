// server/api/teacher/my-classes.get.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id
  const conn = useDb()

  try {
    // Fetch all classes assigned to this teacher
    // We also count students in each class for the badge
    const query = `
      SELECT 
        c.name as class_name,
        (SELECT COUNT(*) FROM students s WHERE s.class_level = c.name) as student_count
      FROM classes c 
      WHERE c.teacher_id = ?
    `
    
    const result = await conn.execute(query, [userId])
    const rows = Array.isArray(result) ? result : (result as any).rows || []

    return { classes: rows }

  } catch (error: any) {
    console.error('My Classes API Error:', error)
    throw createError({ statusCode: 500, message: error.message })
  }
})