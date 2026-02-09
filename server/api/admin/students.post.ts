// server/api/admin/students.post.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') throw createError({ statusCode: 403, message: 'Unauthorized' })

  const body = await readBody(event)
  
  if (!body.first_name || !body.last_name || !body.admission_number || !body.class_level) {
    throw createError({ statusCode: 400, message: 'All fields are required' })
  }

  const conn = useDb()

  try {
    await conn.execute(
      `INSERT INTO students (first_name, last_name, admission_number, class_level) 
       VALUES (?, ?, ?, ?)`,
      [body.first_name, body.last_name, body.admission_number, body.class_level]
    )
    return { success: true }
  } catch (error: any) {
    if (error.message && error.message.includes('Duplicate entry')) {
      throw createError({ statusCode: 409, message: 'Admission Number already exists' })
    }
    // If class doesn't exist in the database constraints
    if (error.message && error.message.includes('foreign key constraint fails')) {
       throw createError({ statusCode: 400, message: 'Invalid Class Level selected' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }
})