import { defineEventHandler, getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const conn = useDb()
  
  // 1. Get the token from the cookie
  const token = getCookie(event, 'parent_token')
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    // 2. Verify and Decode Token
    const decoded: any = jwt.verify(token, config.JWT_SECRET || 'tcad_secret_key_change_me')
    const studentId = decoded.student_id

    // 3. Fetch Student Bio-data
    const studentRes: any = await conn.execute(
      'SELECT id, first_name, last_name, admission_number, class_level, photo_url FROM students WHERE id = ?', 
      [studentId]
    )
    const studentRows = Array.isArray(studentRes) ? studentRes : studentRes.rows || []
    
    if (studentRows.length === 0) throw createError({ statusCode: 404, message: 'Student record lost' })
    const student = studentRows[0]

    // 4. Fetch Academic History (Report cards)
    const historyRes: any = await conn.execute(
      'SELECT session, term, class_level FROM term_reports WHERE student_id = ? ORDER BY session DESC, term DESC',
      [studentId]
    )
    const history = Array.isArray(historyRes) ? historyRes : historyRes.rows || []

    return { student, history }

  } catch (err) {
    throw createError({ statusCode: 401, message: 'Invalid or expired session' })
  }
})