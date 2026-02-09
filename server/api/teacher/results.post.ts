// server/api/teacher/results.post.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  
  if (session.user.role !== 'teacher' && session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const conn = useDb()

  try {
    // 1. Save Term Report (Summary Data)
    const summaryQuery = `
      INSERT INTO term_reports (
        student_id, session, term, class_level, 
        class_teacher_comment, head_teacher_comment,
        total_paces, pace_average, days_absent, next_term_begins, reading_comprehension
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        class_teacher_comment = VALUES(class_teacher_comment),
        head_teacher_comment = VALUES(head_teacher_comment),
        total_paces = VALUES(total_paces),
        pace_average = VALUES(pace_average),
        days_absent = VALUES(days_absent),
        next_term_begins = VALUES(next_term_begins),
        reading_comprehension = VALUES(reading_comprehension)
    `

    await conn.execute(summaryQuery, [
      body.student_id,
      body.session,
      body.term,
      body.class_level,
      body.comments?.teacher || '',
      body.comments?.principal || '',
      body.summary?.total_paces || null,
      body.summary?.pace_average || null,
      body.summary?.days_absent || 0,
      body.summary?.next_term_begins || null,
      body.summary?.reading_comprehension || null
    ])

    // 2. Save Academic Records
    // Clear old records for this term to prevent duplicates
    await conn.execute(
      `DELETE FROM academic_records WHERE student_id = ? AND session = ? AND term = ?`,
      [body.student_id, body.session, body.term]
    )

    // Insert new records using CORRECT COLUMN NAMES
    if (body.academics && body.academics.length > 0) {
      
      const values: any[] = []
      const placeholders: string[] = []

      for (const sub of body.academics) {
        values.push(
           body.student_id, 
           session.user.id, 
           body.session, 
           body.term, 
           body.class_level, 
           sub.subject, 
           sub.ca1 || 0, 
           sub.ca2 || 0, 
           sub.assignment || 0, 
           sub.class_ex || 0, 
           sub.affective || 0, 
           sub.psychomotor || 0, 
           sub.exam || 0
        )
        placeholders.push(`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      }

      if (placeholders.length > 0) {
        // FIX: Used actual DB column names (e.g., ca1_score) instead of short names (ca1)
        const batchQuery = `
          INSERT INTO academic_records 
          (student_id, teacher_id, session, term, class_level, subject, 
           ca1_score, ca2_score, assignment_score, class_exercise_score, 
           affective_score, psychomotor_score, exam_score)
          VALUES ${placeholders.join(', ')}
        `
        
        await conn.execute(batchQuery, values)
      }
    }

    return { success: true, message: 'Results saved successfully' }

  } catch (error: any) {
    console.error('Save Results Error:', error)
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})