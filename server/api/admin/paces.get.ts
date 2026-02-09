// server/api/admin/paces.get.ts
export default defineEventHandler(async (event) => {
  const { student_id } = getQuery(event)
  const session = await requireUserSession(event)
  const conn = useDb()

  // 1. Role Check
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  if (!student_id) {
    throw createError({ statusCode: 400, message: 'Student ID is required' })
  }

  try {
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
})