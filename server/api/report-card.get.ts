// server/api/report-card.get.ts
export default defineEventHandler(async (event) => {
  const { student_id, session, term } = getQuery(event)
  
  const conn = useDb()

  try {
    // HELPER: safely extract rows regardless of driver format
    const getRows = (result: any) => {
      if (Array.isArray(result)) return result;
      return (result as any).rows || [];
    }

    // 1. Fetch Student Info
    const studentResult = await conn.execute('SELECT * FROM students WHERE id = ?', [student_id])
    const studentRows = getRows(studentResult)
    const student = studentRows[0]

    if (!student) {
      throw createError({ statusCode: 404, message: 'Student not found' })
    }

    // 2. Fetch Academic Scores
    const academicQuery = `
      SELECT subject, 
             ca1_score as ca1, 
             ca2_score as ca2, 
             assignment_score as assignment, 
             class_exercise_score as class_ex, 
             affective_score as affective, 
             psychomotor_score as psychomotor, 
             exam_score as exam,
             (ca1_score + ca2_score + assignment_score + class_exercise_score + affective_score + psychomotor_score + exam_score) as total
      FROM academic_records 
      WHERE student_id = ? AND session = ? AND term = ?
    `
    const academicResult = await conn.execute(academicQuery, [student_id, session, term])
    const academicRows = getRows(academicResult)

    // 3. Fetch Report Summary (Comments & New Metrics)
    // REPLACED: behavioral_traits -> total_paces, pace_average, etc.
    const reportQuery = `
      SELECT class_teacher_comment, head_teacher_comment, 
             total_paces, pace_average, days_absent, next_term_begins, reading_comprehension
      FROM term_reports 
      WHERE student_id = ? AND session = ? AND term = ?
    `
    const reportResult = await conn.execute(reportQuery, [student_id, session, term])
    const reportData = getRows(reportResult)[0]

    // 4. Return Structured Data
    return {
      student,
      academics: academicRows,
      meta: {
        session,
        term,
        // Using the new 'days_absent' field instead of the old attendance count logic
        days_absent: reportData?.days_absent || 0,
        next_term_begins: reportData?.next_term_begins || null,
        total_paces: reportData?.total_paces || 'N/A',
        pace_average: reportData?.pace_average || 'N/A',
        reading_comprehension: reportData?.reading_comprehension || 'N/A'
      },
      comments: {
        teacher: reportData?.class_teacher_comment || '',
        principal: reportData?.head_teacher_comment || ''
      }
    }

  } catch (error: any) {
    console.error('Report API Error:', error)
    throw createError({ statusCode: 500, message: error.message || 'Failed to generate report card' })
  }
})