import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const conn = useDb()
  
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  // Helper to extract rows safely from any driver response
  // We moved this UP so we can use it for everything
  const getRows = (result: any) => {
    // If it's already an array of rows (Standard MySQL/TiDB)
    if (Array.isArray(result)) return result
    // If it's nested in a 'rows' property (Postgres/Some Drivers)
    if (result && result.rows) return result.rows
    // If it's a single object (Edge case)
    if (result && typeof result === 'object') return [result]
    return []
  }

  const CALC_TOTAL = `(
    COALESCE(ca1_score, 0) + 
    COALESCE(ca2_score, 0) + 
    COALESCE(assignment_score, 0) + 
    COALESCE(class_exercise_score, 0) + 
    COALESCE(affective_score, 0) + 
    COALESCE(psychomotor_score, 0) + 
    COALESCE(exam_score, 0)
  )`

  let responseData = {
    stats: { total_students: 0, total_teachers: 0, failing_records: 0 },
    gender: [],
    classPerformance: [],
    atRisk: [],
    bestPerformers: []
  }

  try {
    // ------------------------------------------------------------------
    // QUERY 1: Basic Counts
    // ------------------------------------------------------------------
    // Removed [counts] destructuring. capture full result.
    const countsResult = await conn.execute(`
      SELECT 
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') as total_teachers,
        (SELECT COUNT(*) FROM academic_records WHERE ${CALC_TOTAL} < 50 AND ${CALC_TOTAL} > 0) as failing_records
    `)
    
    const countRows = getRows(countsResult)
    if (countRows.length > 0) responseData.stats = countRows[0]

    // ------------------------------------------------------------------
    // QUERY 2: Gender Distribution
    // ------------------------------------------------------------------
    // Removed [gender] destructuring. This was the bug!
    const genderResult = await conn.execute(`
      SELECT 
        CASE 
          WHEN TRIM(LOWER(gender)) IN ('m', 'male', 'boy', 'man') OR TRIM(LOWER(gender)) LIKE 'm%' THEN 'Male'
          WHEN TRIM(LOWER(gender)) IN ('f', 'female', 'girl', 'woman') OR TRIM(LOWER(gender)) LIKE 'f%' THEN 'Female'
          ELSE 'Unknown'
        END as gender_normalized,
        COUNT(*) as count 
      FROM students 
      GROUP BY gender_normalized
    `)
    
    const genderRows = getRows(genderResult)
    
    responseData.gender = genderRows.map((r: any) => ({
      gender: r.gender_normalized,
      count: r.count
    }))

    // ------------------------------------------------------------------
    // QUERY 3: Class Performance
    // ------------------------------------------------------------------
    const perfResult = await conn.execute(`
      SELECT class_level, ROUND(AVG(${CALC_TOTAL}), 1) as avg_score 
      FROM academic_records WHERE ${CALC_TOTAL} > 0 
      GROUP BY class_level ORDER BY avg_score DESC
    `)
    responseData.classPerformance = getRows(perfResult)

    // ------------------------------------------------------------------
    // QUERY 4: At Risk
    // ------------------------------------------------------------------
    const riskResult = await conn.execute(`
      SELECT s.first_name, s.last_name, s.class_level, ROUND(AVG(${CALC_TOTAL}), 1) as term_average
      FROM academic_records ar
      JOIN students s ON ar.student_id = s.id
      WHERE ${CALC_TOTAL} > 0
      GROUP BY ar.student_id
      HAVING term_average < 50
      ORDER BY term_average ASC LIMIT 5
    `)
    responseData.atRisk = getRows(riskResult)

    // ------------------------------------------------------------------
    // QUERY 5: Best Performers
    // ------------------------------------------------------------------
    const bestResult = await conn.execute(`
      SELECT s.first_name, s.last_name, s.class_level, ROUND(AVG(${CALC_TOTAL}), 1) as term_average
      FROM academic_records ar
      JOIN students s ON ar.student_id = s.id
      WHERE ${CALC_TOTAL} > 0
      GROUP BY ar.student_id
      ORDER BY term_average DESC LIMIT 5
    `)
    responseData.bestPerformers = getRows(bestResult)

    return responseData

  } catch (error: any) {
    console.error('❌ [Insights API] Error:', error)
    return responseData 
  }
})