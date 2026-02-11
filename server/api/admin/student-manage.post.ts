// server/api/admin/student-manage.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const conn = useDb()

  try {
    // ----------------------------------------------------------------------
    // 1. DELETE ACTION
    // Removes a student and all associated academic records manually
    // ----------------------------------------------------------------------
    if (body.action === 'delete') {
      if (!body.id) throw createError({ statusCode: 400, message: 'ID required' })
      
      // Delete dependent records first to maintain referential integrity
      await conn.execute('DELETE FROM academic_records WHERE student_id = ?', [body.id])
      await conn.execute('DELETE FROM term_reports WHERE student_id = ?', [body.id])
      
      // Finally, delete the student profile
      await conn.execute('DELETE FROM students WHERE id = ?', [body.id])
      
      return { success: true }
    }

    // ----------------------------------------------------------------------
    // 2. MOVE CLASS ACTION
    // Promotes or moves a student to a different class level
    // ----------------------------------------------------------------------
    if (body.action === 'move') {
      await conn.execute('UPDATE students SET class_level = ? WHERE id = ?', [body.new_class, body.id])
      return { success: true }
    }

    // ----------------------------------------------------------------------
    // 3. CREATE STUDENT ACTION
    // Registers a new student profile with full details
    // ----------------------------------------------------------------------
    if (body.action === 'create') {
      // 3.1 Input Validation
      if (!body.first_name || !body.last_name || !body.class_level) {
        throw createError({ statusCode: 400, message: 'Name and Class are required' })
      }

      // 3.2 Prepare Values
      // Map body fields to DB columns, ensuring NULL is used for optional fields
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
        body.parent2_rel || null,
        body.access_code || null
      ]

      // 3.3 Execute Insert
      const query = `
        INSERT INTO students (
          first_name, last_name, admission_number, class_level, gender, 
          dob, photo_url, allergies, special_needs,
          parent1_name, parent1_phone, parent1_rel,
          parent2_name, parent2_phone, parent2_rel, 
          access_code 
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      await conn.execute(query, values)
      
      return { success: true, message: 'Student profile created successfully' }
    }

  } catch (error: any) {
    // 4. Global Error Handling
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Database operation failed.' 
    })
  }
})