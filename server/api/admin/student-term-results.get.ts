import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const sessionUser = await requireUserSession(event)
  if (sessionUser.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const { student_id, session, term } = getQuery(event)
  const conn = useDb()

  if (!student_id || !session || !term) {
    throw createError({ statusCode: 400, message: 'Missing parameters' })
  }

  const getRows = (result: any) => {
    if (Array.isArray(result)) return result
    if (result && result.rows) return result.rows
    return []
  }

  try {
    const CALC_TOTAL = `(
      COALESCE(ca1_score, 0) + COALESCE(ca2_score, 0) + 
      COALESCE(assignment_score, 0) + COALESCE(class_exercise_score, 0) + 
      COALESCE(affective_score, 0) + COALESCE(psychomotor_score, 0) + 
      COALESCE(exam_score, 0)
    )`

    const query = `
      SELECT subject, ${CALC_TOTAL} as total_score
      FROM academic_records 
      WHERE student_id = ? AND session = ? AND term = ?
      ORDER BY total_score DESC
    `
    const result = await conn.execute(query, [student_id, session, term])
    
    return { records: getRows(result) }

  } catch (error: any) {
    console.error('Modal Fetch Error:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch student records' })
  }
})