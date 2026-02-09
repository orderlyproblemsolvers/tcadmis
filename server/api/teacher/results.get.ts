// server/api/teacher/results.get.ts
export default defineEventHandler(async (event) => {
  const { student_id, session, term } = getQuery(event)
  const conn = useDb()

  if (!student_id || !session || !term) {
    return { found: false }
  }

  try {
    // 1. Fetch Academic Scores
    // We alias the DB columns (e.g. ca1_score) to match the Frontend keys (e.g. ca1)
    const academicQuery = `
      SELECT subject, 
             ca1_score as ca1, 
             ca2_score as ca2, 
             assignment_score as assignment, 
             class_exercise_score as class_ex, 
             affective_score as affective, 
             psychomotor_score as psychomotor, 
             exam_score as exam
      FROM academic_records 
      WHERE student_id = ? AND session = ? AND term = ?
    `
    const academics: any = await conn.execute(academicQuery, [student_id, session, term])
    const academicRows = Array.isArray(academics) ? academics : academics.rows || []

    // 2. Fetch Report Summary (Comments & New Metrics)
    // REPLACED: behavioral_traits -> total_paces, pace_average, etc.
    const reportQuery = `
      SELECT class_teacher_comment, head_teacher_comment, 
             total_paces, pace_average, days_absent, next_term_begins, reading_comprehension
      FROM term_reports 
      WHERE student_id = ? AND session = ? AND term = ?
    `
    const reports: any = await conn.execute(reportQuery, [student_id, session, term])
    const reportData = Array.isArray(reports) ? reports[0] : (reports.rows?.[0] || null)

    // If no data exists at all, return not found so frontend loads defaults
    if (academicRows.length === 0 && !reportData) {
      return { found: false }
    }

    // 3. Return the Combined Data
    return {
      found: true,
      academics: academicRows,
      comments: {
        teacher: reportData?.class_teacher_comment || '',
        principal: reportData?.head_teacher_comment || ''
      },
      summary: {
        total_paces: reportData?.total_paces || '',
        pace_average: reportData?.pace_average || '',
        days_absent: reportData?.days_absent || 0,
        next_term_begins: reportData?.next_term_begins || '',
        reading_comprehension: reportData?.reading_comprehension || ''
      }
    }

  } catch (error: any) {
    console.error('Fetch Results Error:', error)
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch results' })
  }
})