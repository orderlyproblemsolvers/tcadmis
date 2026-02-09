export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') throw createError({ statusCode: 403 })

  const conn = useDb()
  const result: any = await conn.execute(
    'SELECT id, first_name, last_name, admission_number, class_level, access_code FROM students ORDER BY class_level, last_name'
  )
  return Array.isArray(result) ? result : result.rows || []
})