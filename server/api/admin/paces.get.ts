import { defineEventHandler, getQuery, getCookie, createError } from 'h3'
import { getUserSession } from '#imports'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const student_id = query.student_id as string
  const config = useRuntimeConfig()
  const conn = useDb()

  let isAuthorized = false

  // 1. Verify Parent Access (Cookie Token)
  const parentToken = getCookie(event, 'parent_token')
  if (parentToken) {
    try {
      const decoded: any = jwt.verify(parentToken, config.JWT_SECRET)
      // Ensure strict ID matching (string comparison)
      if (String(decoded.student_id) === String(student_id)) {
        isAuthorized = true
      }
    } catch {
      // Token invalid or expired; fall through to staff check
    }
  }

  // 2. Verify Staff Access (Session Fallback)
  if (!isAuthorized) {
    const session = await getUserSession(event)
    if (session.user && ['admin', 'teacher'].includes(session.user.role)) {
      isAuthorized = true
    }
  }

  // 3. Enforce Authorization Gate
  if (!isAuthorized) {
    throw createError({ statusCode: 403, message: 'Access Denied.' })
  }

  // 4. Validate Input
  if (!student_id) {
    throw createError({ statusCode: 400, message: 'Student ID is required' })
  }

  // 5. Execute Data Retrieval
  try {
    const sql = `
      SELECT subject, pace_number, score, is_completed 
      FROM pace_records 
      WHERE student_id = ?
    `
    const result: any = await conn.execute(sql, [student_id])
    return Array.isArray(result) ? result : result.rows || []

  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Database error' })
  }
})