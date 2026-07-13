import { defineEventHandler, createError, getQuery } from 'h3'

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

function getPreviousTerm(term: string, session: string): { term: string; session: string } | null {
  if (term === '2nd Term') return { term: '1st Term', session }
  if (term === '3rd Term') return { term: '2nd Term', session }
  if (term === '1st Term') {
    const [start, end] = session.split('/').map(Number)
    return { term: '3rd Term', session: `${start - 1}/${end - 1}` }
  }
  return null
}

// ---------------------------------------------------------
// 1. THE CORE DATA FETCHER
// ---------------------------------------------------------
async function fetchInsightsData(sessionVal: string, termVal: string, classVal: string) {
  const conn = useDb()

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

  // --- Dynamic filters ---
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

  // --- Term-over-term setup ---
  const prevTerm = getPreviousTerm(termVal, sessionVal)

  const termCompareParams: any[] = prevTerm
    ? [
        termVal, sessionVal,          
        prevTerm.term, prevTerm.session, 
        termVal, sessionVal,          
        prevTerm.term, prevTerm.session, 
        ...(classVal !== 'All' ? [classVal] : []),
      ]
    : []

  const termCompareByClassParams: any[] = prevTerm
    ? [
        termVal, sessionVal,
        prevTerm.term, prevTerm.session,
        termVal, sessionVal,
        prevTerm.term, prevTerm.session,
        ...(classVal !== 'All' ? [classVal] : []),
      ]
    : arParams 

  // ---------------------------------------------------------
  // SINGLE Promise.all 
  // ---------------------------------------------------------
  const [
    studentsRes,
    teachersRes,
    failingRes,
    termCompareRes,        
    genderResult,
    classCompareResult,    
    subResult,             
    gradeResult,
    riskResult,
    bestResult,
  ] = await Promise.all([

    // 1. Total students
    conn.execute(
      `SELECT COUNT(*) as count FROM students WHERE ${studentWhere}`,
      studentParams
    ),

    // 2. Total teachers
    conn.execute(`SELECT COUNT(*) as count FROM users WHERE role = 'teacher'`),

    // 3. Failing subject entries
    conn.execute(
      `SELECT COUNT(*) as count FROM academic_records ar
       WHERE ${arWhere} AND ${CALC_TOTAL} < 60 AND ${CALC_TOTAL} > 0`,
      arParams
    ),

    // 4. Overall term-over-term
    prevTerm
      ? conn.execute(
          `SELECT
             ROUND(AVG(CASE WHEN ar.term = ? AND ar.session = ? THEN ${CALC_TOTAL} END), 1) AS current_avg,
             ROUND(AVG(CASE WHEN ar.term = ? AND ar.session = ? THEN ${CALC_TOTAL} END), 1) AS prev_avg
           FROM academic_records ar
           WHERE ${CALC_TOTAL} > 0
             AND (
               (ar.term = ? AND ar.session = ?) OR
               (ar.term = ? AND ar.session = ?)
             )
             ${classVal !== 'All' ? 'AND ar.class_level = ?' : ''}`,
          termCompareParams
        )
      : Promise.resolve(null),

    // 5. Gender distribution
    conn.execute(
      `SELECT
         CASE
           WHEN TRIM(LOWER(gender)) IN ('m', 'male', 'boy', 'man') OR TRIM(LOWER(gender)) LIKE 'm%' THEN 'Male'
           WHEN TRIM(LOWER(gender)) IN ('f', 'female', 'girl', 'woman') OR TRIM(LOWER(gender)) LIKE 'f%' THEN 'Female'
           ELSE 'Unknown'
         END AS gender_normalized,
         COUNT(*) AS count
       FROM students
       WHERE ${studentWhere}
       GROUP BY gender_normalized`,
      studentParams
    ),

    // 6. Class performance with previous term comparison
    prevTerm
      ? conn.execute(
          `SELECT
             ar.class_level,
             ROUND(AVG(CASE WHEN ar.term = ? AND ar.session = ? THEN ${CALC_TOTAL} END), 1) AS current_avg,
             ROUND(AVG(CASE WHEN ar.term = ? AND ar.session = ? THEN ${CALC_TOTAL} END), 1) AS prev_avg
           FROM academic_records ar
           WHERE ${CALC_TOTAL} > 0
             AND (
               (ar.term = ? AND ar.session = ?) OR
               (ar.term = ? AND ar.session = ?)
             )
             ${classVal !== 'All' ? 'AND ar.class_level = ?' : ''}
           GROUP BY ar.class_level
           ORDER BY current_avg DESC`,
          termCompareByClassParams
        )
      : conn.execute(
          `SELECT ar.class_level,
             ROUND(AVG(${CALC_TOTAL}), 1) AS current_avg,
             NULL AS prev_avg
           FROM academic_records ar
           WHERE ${arWhere} AND ${CALC_TOTAL} > 0
           GROUP BY ar.class_level ORDER BY current_avg DESC`,
          arParams
        ),

    // 7. ENHANCED: Subject performance + pass/fail rate + MIN/MAX
    conn.execute(
      `SELECT
         ar.subject,
         ROUND(AVG(${CALC_TOTAL}), 1)                                                       AS avg_score,
         MAX(${CALC_TOTAL})                                                                 AS max_score,
         MIN(${CALC_TOTAL})                                                                 AS min_score,
         COUNT(*)                                                                           AS total_entries,
         COUNT(CASE WHEN ${CALC_TOTAL} >= 60 THEN 1 END)                                    AS pass_count,
         ROUND(COUNT(CASE WHEN ${CALC_TOTAL} >= 60 THEN 1 END) * 100.0 / COUNT(*), 1)       AS pass_rate
       FROM academic_records ar
       WHERE ${arWhere} AND ${CALC_TOTAL} > 0
       GROUP BY ar.subject
       ORDER BY avg_score DESC`,
      arParams
    ),

    // 8. Grade distribution
    conn.execute(
      `SELECT
         CASE
           WHEN ${CALC_TOTAL} >= 80 THEN 'EXC'
           WHEN ${CALC_TOTAL} >= 70 THEN 'VG'
           WHEN ${CALC_TOTAL} >= 60 THEN 'G'
           ELSE 'FAIL'
         END AS grade_band,
         CASE
           WHEN ${CALC_TOTAL} >= 80 THEN 1
           WHEN ${CALC_TOTAL} >= 70 THEN 2
           WHEN ${CALC_TOTAL} >= 60 THEN 3
           ELSE 4
         END AS sort_order,
         COUNT(*) AS count
       FROM academic_records ar
       WHERE ${arWhere} AND ${CALC_TOTAL} > 0
       GROUP BY grade_band, sort_order
       ORDER BY sort_order ASC`,
      arParams
    ),

    // 9. At-risk students
    conn.execute(
      `SELECT s.id AS student_id, s.first_name, s.last_name, ar.class_level,
         ROUND(AVG(${CALC_TOTAL}), 1) AS term_average
       FROM academic_records ar
       JOIN students s ON ar.student_id = s.id
       WHERE ${arWhere} AND ${CALC_TOTAL} > 0
       GROUP BY ar.student_id, s.id, s.first_name, s.last_name, ar.class_level
       HAVING term_average < 60
       ORDER BY term_average ASC LIMIT 5`,
      arParams
    ),

    // 10. Best performers
    conn.execute(
      `SELECT s.id AS student_id, s.first_name, s.last_name, ar.class_level,
         ROUND(AVG(${CALC_TOTAL}), 1) AS term_average
       FROM academic_records ar
       JOIN students s ON ar.student_id = s.id
       WHERE ${arWhere} AND ${CALC_TOTAL} > 0
       GROUP BY ar.student_id, s.id, s.first_name, s.last_name, ar.class_level
       ORDER BY term_average DESC LIMIT 5`,
      arParams
    ),
  ])

  // Term-over-term delta
  const termCompareRow = termCompareRes ? getRows(termCompareRes)[0] : null
  const currentAvg = termCompareRow ? Number(termCompareRow.current_avg) : null
  const prevAvg    = termCompareRow ? Number(termCompareRow.prev_avg)    : null
  const delta      = (currentAvg !== null && prevAvg !== null && prevAvg > 0)
    ? Number((currentAvg - prevAvg).toFixed(1))
    : null

  return {
    stats: {
      total_students:  Number(getRows(studentsRes)[0]?.count   || 0),
      total_teachers:  Number(getRows(teachersRes)[0]?.count   || 0),
      failing_records: Number(getRows(failingRes)[0]?.count    || 0),
    },

    termOverTerm: {
      current_avg: currentAvg,
      prev_avg:    prevAvg,
      delta,
      prev_term:   prevTerm?.term    ?? null,
      prev_session: prevTerm?.session ?? null,
    },

    gender: getRows(genderResult).map((r: any) => ({
      gender: r.gender_normalized,
      count:  Number(r.count),
    })),

    classPerformance: getRows(classCompareResult).map((r: any) => ({
      class_level:  r.class_level,
      current_avg:  Number(r.current_avg  ?? 0),
      prev_avg:     r.prev_avg !== null ? Number(r.prev_avg) : null,
      avg_score:    Number(r.current_avg  ?? 0),
    })),

    subjectPerformance: getRows(subResult).map((r: any) => ({
      subject:       r.subject,
      avg_score:     Number(r.avg_score),
      highest_score: Number(r.max_score), // NEW
      lowest_score:  Number(r.min_score), // NEW
      pass_rate:     Number(r.pass_rate),
      pass_count:    Number(r.pass_count),
      fail_count:    Number(r.total_entries) - Number(r.pass_count),
      total_entries: Number(r.total_entries),
    })),

    gradeDistribution: getRows(gradeResult),
    atRisk:            getRows(riskResult),
    bestPerformers:    getRows(bestResult),
  }
}

// ---------------------------------------------------------
// 2. CACHED WRAPPER 
// ---------------------------------------------------------
const getCachedInsights = defineCachedFunction(fetchInsightsData, {
  maxAge: 60 * 5,
  name: 'school-insights',
  getKey: (s: string, t: string, c: string) => `${s}-${t}-${c}`,
})

// ---------------------------------------------------------
// 3. API ENDPOINT
// ---------------------------------------------------------
export default defineEventHandler(async (event) => {
  const sessionUser = await requireUserSession(event)
  if (sessionUser.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const query      = getQuery(event)
  const sessionVal = (query.session     as string) || '2025/2026'
  const termVal    = (query.term        as string) || '1st Term'
  const classVal   = (query.class_level as string) || 'All'
  const isRefresh  = query.refresh === 'true'

  try {
    if (isRefresh) {
      return await fetchInsightsData(sessionVal, termVal, classVal)
    }
    return await getCachedInsights(sessionVal, termVal, classVal)
  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to generate insights' })
  }
})