import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const conn = useDb()

  // 1. Fetch EVERYTHING: Student Name, Class, Subject, and Total Score
  const query = `
    SELECT 
      s.first_name, s.last_name, s.class_level,
      ar.subject, 
      (COALESCE(ar.ca1_score, 0) + COALESCE(ar.ca2_score, 0) + COALESCE(ar.assignment_score, 0) + 
       COALESCE(ar.class_exercise_score, 0) + COALESCE(ar.affective_score, 0) + 
       COALESCE(ar.psychomotor_score, 0) + COALESCE(ar.exam_score, 0)) as total
    FROM academic_records ar
    JOIN students s ON ar.student_id = s.id
    ORDER BY s.class_level, s.last_name, ar.subject
  `

  // FIX: Remove destructuring [rows]. Capture the raw result instead.
  const rawResult: any = await conn.execute(query)

  // Helper to extract rows safely (Handles different DB driver responses)
  const getRows = (data: any) => {
    if (!data) return []
    // If it's an array, it's likely the rows themselves (TiDB/MySQL2)
    if (Array.isArray(data)) return data
    // If it's an object with a 'rows' property (Postgres)
    if (data.rows && Array.isArray(data.rows)) return data.rows
    return []
  }

  const results = getRows(rawResult)

  // 2. Group by Student for the AI
  const groupedData: any = {}

  results.forEach((row: any) => {
    const studentName = `${row.first_name} ${row.last_name} (${row.class_level})`
    
    if (!groupedData[studentName]) {
      groupedData[studentName] = {}
    }
    
    // Format: "Math: 85"
    groupedData[studentName][row.subject] = row.total
  })

  return groupedData
})