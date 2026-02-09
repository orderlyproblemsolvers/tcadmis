// server/api/admin/student-manage.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const conn = useDb()

  console.log(`[API] Processing Action: ${body.action}`)

  try {
    // --- ACTION: DELETE ---
    if (body.action === 'delete') {
      if (!body.id) throw createError({ statusCode: 400, message: 'ID required' })
      await conn.execute('DELETE FROM academic_records WHERE student_id = ?', [body.id])
      await conn.execute('DELETE FROM term_reports WHERE student_id = ?', [body.id])
      await conn.execute('DELETE FROM students WHERE id = ?', [body.id])
      return { success: true }
    }

    // --- ACTION: MOVE ---
    if (body.action === 'move') {
      await conn.execute('UPDATE students SET class_level = ? WHERE id = ?', [body.new_class, body.id])
      return { success: true }
    }

    // --- ACTION: CREATE ---
    if (body.action === 'create') {
      // Validation
      if (!body.first_name || !body.last_name || !body.class_level) {
        throw createError({ statusCode: 400, message: 'Name and Class are required' })
      }

      // Prepare values (Convert empty strings to null for DB)
      const values = [
        body.first_name, 
        body.last_name, 
        body.admission_number, 
        body.class_level, 
        body.gender,
        body.dob || null,            
        body.photo_url || null,      
        body.allergies || null,      
        body.special_needs ? 1 : 0,  
        body.parent1_name || null,
        body.parent1_phone || null,
        body.parent1_rel || null,
        body.parent2_name || null,
        body.parent2_phone || null,
        body.parent2_rel || null
      ]

      const query = `
        INSERT INTO students (
          first_name, last_name, admission_number, class_level, gender, 
          dob, photo_url, allergies, special_needs,
          parent1_name, parent1_phone, parent1_rel,
          parent2_name, parent2_phone, parent2_rel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      await conn.execute(query, values)
      
      console.log(`[API] Success: Created student ${body.first_name}`)
      return { success: true, message: 'Student profile created successfully' }
    }

  } catch (error: any) {
    // LOG THE REAL ERROR TO TERMINAL
    console.error("❌ [API ERROR] Student Manage Failed:", error)
    
    // Send a clean error to frontend
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Database operation failed. Check server logs.' 
    })
  }
})