import { defineEventHandler, createError, getQuery } from 'h3'

// ---------------------------------------------------------
// 1. THE CORE DATA FETCHER
// Separated from the event handler so we can cache it.
// ---------------------------------------------------------
async function fetchInsightsData(sessionVal: string, termVal: string, classVal: string) {
  const conn = useDb()

  // Safe row extractor for various DB drivers
  const getRows = (result: any) => {
    if (Array.isArray(result)) return result
    if (result && result.rows) return result.rows
    if (result && typeof result === 'object') return [result]
    return []
  }

  const CALC_TOTAL = `(
    COALESCE(ca1_score, 0) + COALESCE(ca2_score, 0) + 
    COALESCE(assignment_score, 0) + COALESCE(class_exercise_score, 0) + 
    COALESCE(affective_score, 0) + COALESCE(psychomotor_score, 0) + 
    COALESCE(exam_score, 0)
  )`

  // --- Dynamic Query Builders ---
  let arWhere = `ar.session = ? AND ar.term = ?`
  let arParams: any[] = [sessionVal, termVal]

  let studentWhere = `1=1`
  let studentParams: any[] = []

  if (classVal !== 'All') {
    arWhere += ` AND ar.class_level = ?`
    arParams.push(classVal)
    
    studentWhere = `class_level = ?`
    studentParams.push(classVal)
  }

  let responseData = {
    stats: { total_students: 0, total_teachers: 0, failing_records: 0 },
    gender: [],
    classPerformance: [],
    subjectPerformance: [],
    gradeDistribution: [],
    atRisk: [],
    bestPerformers: []
  }

  // 1. Basic Counts
  const [studentsRes, teachersRes, failingRes] = await Promise.all([
    conn.execute(`SELECT COUNT(*) as count FROM students WHERE ${studentWhere}`, studentParams),
    conn.execute(`SELECT COUNT(*) as count FROM users WHERE role = 'teacher'`),
    conn.execute(`SELECT COUNT(*) as count FROM academic_records ar WHERE ${arWhere} AND ${CALC_TOTAL} < 50 AND ${CALC_TOTAL} > 0`, arParams)
  ])

  responseData.stats.total_students = Number(getRows(studentsRes)[0]?.count || 0)
  responseData.stats.total_teachers = Number(getRows(teachersRes)[0]?.count || 0)
  responseData.stats.failing_records = Number(getRows(failingRes)[0]?.count || 0)

  // 2. Gender Distribution
  const genderResult = await conn.execute(`
    SELECT 
      CASE 
        WHEN TRIM(LOWER(gender)) IN ('m', 'male', 'boy', 'man') OR TRIM(LOWER(gender)) LIKE 'm%' THEN 'Male'
        WHEN TRIM(LOWER(gender)) IN ('f', 'female', 'girl', 'woman') OR TRIM(LOWER(gender)) LIKE 'f%' THEN 'Female'
        ELSE 'Unknown'
      END as gender_normalized,
      COUNT(*) as count 
    FROM students 
    WHERE ${studentWhere}
    GROUP BY gender_normalized
  `, studentParams)
  
  responseData.gender = getRows(genderResult).map((r: any) => ({
    gender: r.gender_normalized,
    count: Number(r.count)
  }))

  // 3. Class Performance
  const perfResult = await conn.execute(`
    SELECT ar.class_level, ROUND(AVG(${CALC_TOTAL}), 1) as avg_score 
    FROM academic_records ar
    WHERE ${arWhere} AND ${CALC_TOTAL} > 0 
    GROUP BY ar.class_level ORDER BY avg_score DESC
  `, arParams)
  responseData.classPerformance = getRows(perfResult)

  // 4. Subject Performance
  const subResult = await conn.execute(`
    SELECT ar.subject, ROUND(AVG(${CALC_TOTAL}), 1) as avg_score 
    FROM academic_records ar
    WHERE ${arWhere} AND ${CALC_TOTAL} > 0 
    GROUP BY ar.subject ORDER BY avg_score DESC
  `, arParams)
  responseData.subjectPerformance = getRows(subResult)

  // 5. Grade Distribution (Using your specific EXC -> NGI scale)
  const gradeResult = await conn.execute(`
    SELECT 
      CASE 
        WHEN ${CALC_TOTAL} >= 80 THEN 'EXC'
        WHEN ${CALC_TOTAL} >= 70 THEN 'VG'
        WHEN ${CALC_TOTAL} >= 60 THEN 'G'
        WHEN ${CALC_TOTAL} >= 55 THEN 'S'
        WHEN ${CALC_TOTAL} >= 50 THEN 'NI'
        ELSE 'NGI'
      END as grade_band,
      CASE 
        WHEN ${CALC_TOTAL} >= 80 THEN 1
        WHEN ${CALC_TOTAL} >= 70 THEN 2
        WHEN ${CALC_TOTAL} >= 60 THEN 3
        WHEN ${CALC_TOTAL} >= 55 THEN 4
        WHEN ${CALC_TOTAL} >= 50 THEN 5
        ELSE 6
      END as sort_order,
      COUNT(*) as count 
    FROM academic_records ar
    WHERE ${arWhere} AND ${CALC_TOTAL} > 0 
    GROUP BY grade_band, sort_order
    ORDER BY sort_order ASC
  `, arParams)
  responseData.gradeDistribution = getRows(gradeResult)

  // 6. At Risk Students
  const riskResult = await conn.execute(`
    SELECT s.id as student_id, s.first_name, s.last_name, ar.class_level, ROUND(AVG(${CALC_TOTAL}), 1) as term_average
    FROM academic_records ar
    JOIN students s ON ar.student_id = s.id
    WHERE ${arWhere} AND ${CALC_TOTAL} > 0
    GROUP BY ar.student_id, s.id, s.first_name, s.last_name, ar.class_level
    HAVING term_average < 50
    ORDER BY term_average ASC LIMIT 5
  `, arParams)
  responseData.atRisk = getRows(riskResult)

  // 7. Best Performers
  const bestResult = await conn.execute(`
    SELECT s.id as student_id, s.first_name, s.last_name, ar.class_level, ROUND(AVG(${CALC_TOTAL}), 1) as term_average
    FROM academic_records ar
    JOIN students s ON ar.student_id = s.id
    WHERE ${arWhere} AND ${CALC_TOTAL} > 0
    GROUP BY ar.student_id, s.id, s.first_name, s.last_name, ar.class_level
    ORDER BY term_average DESC LIMIT 5
  `, arParams)
  responseData.bestPerformers = getRows(bestResult)

  return responseData
}

// ---------------------------------------------------------
// 2. THE CACHED WRAPPER
// Caches the results of fetchInsightsData for 5 minutes.
// ---------------------------------------------------------
const getCachedInsights = defineCachedFunction(fetchInsightsData, {
  maxAge: 60 * 5, // Cache expires after 5 minutes (300 seconds)
  name: 'school-insights', 
  // Generates a unique cache bucket for every filter combination
  getKey: (sessionVal: string, termVal: string, classVal: string) => `${sessionVal}-${termVal}-${classVal}`
})

// ---------------------------------------------------------
// 3. THE API ENDPOINT
// Handles security, query parsing, and cache retrieval.
// ---------------------------------------------------------
export default defineEventHandler(async (event) => {
  // Always run security check first
  const sessionUser = await requireUserSession(event)
  if (sessionUser.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const query = getQuery(event)
  const sessionVal = (query.session as string) || '2025/2026'
  const termVal = (query.term as string) || '1st Term'
  const classVal = (query.class_level as string) || 'All'
  
  // Optional bypass: If the frontend sends ?refresh=true, skip the cache
  const isRefresh = query.refresh === 'true'

  try {
    if (isRefresh) {
      return await fetchInsightsData(sessionVal, termVal, classVal)
    }

    console.log(`[Insights API] Fetching cached data for ${sessionVal} | ${termVal} | ${classVal}`)
    return await getCachedInsights(sessionVal, termVal, classVal)

  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to generate insights' })
  }
})