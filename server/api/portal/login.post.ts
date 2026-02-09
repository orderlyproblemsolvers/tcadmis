import { defineEventHandler, readBody, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const conn = useDb()

  // 1. Validate Input
  if (!body.admission_number || !body.access_code) {
    throw createError({ statusCode: 400, message: 'Missing credentials' })
  }

  try {
    // 2. Find Student (Secure Query)
    // We strictly match both fields.
    const query = `
      SELECT id, first_name, last_name, class_level 
      FROM students 
      WHERE admission_number = ? AND access_code = ?
      LIMIT 1
    `
    // Ensure you are passing the normalized admission number (Uppercase)
    const result: any = await conn.execute(query, [body.admission_number, body.access_code])
    
    // Handle TiDB response format (array vs object)
    const rows = Array.isArray(result) ? result : result.rows || []

    if (rows.length === 0) {
      throw createError({ statusCode: 401, message: 'Invalid Admission Number or PIN' })
    }

    const student = rows[0]

    // 3. Generate Token
    // We sign a token with the student's ID. This is how we know who they are on the dashboard.
    const token = jwt.sign(
      { 
        student_id: student.id, 
        role: 'parent', 
        name: student.first_name 
      }, 
      config.JWT_SECRET || 'tcad_secret_key_change_me', 
      { expiresIn: '24h' }
    )

    return { success: true, token }

  } catch (error: any) {
    console.error("Login Error:", error)
    // If it's a known 401, throw it. Otherwise generic 500.
    if (error.statusCode === 401) throw error
    
    throw createError({ 
      statusCode: 500, 
      message: 'Login service unavailable.' 
    })
  }
})