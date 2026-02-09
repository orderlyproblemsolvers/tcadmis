// server/api/admin/class-details.get.ts
export default defineEventHandler(async (event) => {
  const { class_name } = getQuery(event)
  const conn = useDb()

  try {
    // 1. Get Students
    const query = `SELECT * FROM students WHERE class_level = ? ORDER BY last_name ASC`
    const result = await conn.execute(query, [class_name])
    const rows = Array.isArray(result) ? result : (result as any).rows || []

    return { students: rows }
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to load class details' })
  }
})