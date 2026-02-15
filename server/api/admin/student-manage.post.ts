import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // ----------------------------------------------------------------------
  // 🔒 SECURITY CHECK (CRITICAL)
  // ----------------------------------------------------------------------
  const session = await requireUserSession(event)
  
  // Strict: Only 'admin' role can create, edit, or delete students.
  // Teachers should NOT be able to access this.
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized: Admins only.' })
  }

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
      
      return { success: true, message: 'Student deleted successfully' }
    }

    // ----------------------------------------------------------------------
    // 2. MOVE CLASS ACTION
    // Promotes or moves a student to a different class level
    // ----------------------------------------------------------------------
    if (body.action === 'move') {
      if (!body.id || !body.new_class) throw createError({ statusCode: 400, message: 'ID and New Class required' })
      
      await conn.execute('UPDATE students SET class_level = ? WHERE id = ?', [body.new_class, body.id])
      return { success: true, message: 'Student moved successfully' }
    }

    // ----------------------------------------------------------------------
    // 3. CREATE STUDENT ACTION
    // Registers a new student profile with full details
    // ----------------------------------------------------------------------
    if (body.action === 'create') {
      if (!body.first_name || !body.last_name || !body.class_level) {
        throw createError({ statusCode: 400, message: 'Name and Class are required' })
      }

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

    // ----------------------------------------------------------------------
    // 4. UPDATE STUDENT ACTION
    // Edits an existing student's profile details
    // ----------------------------------------------------------------------
    if (body.action === 'update') {
      if (!body.id) throw createError({ statusCode: 400, message: 'Student ID required for update' })

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
        body.access_code || null,
        body.id // WHERE id = ?
      ]

      const query = `
        UPDATE students SET 
          first_name = ?, 
          last_name = ?, 
          admission_number = ?, 
          class_level = ?, 
          gender = ?, 
          dob = ?, 
          photo_url = ?, 
          allergies = ?, 
          special_needs = ?,
          parent1_name = ?, 
          parent1_phone = ?, 
          parent1_rel = ?, 
          access_code = ?
        WHERE id = ?
      `

      await conn.execute(query, values)
      
      return { success: true, message: 'Student profile updated successfully' }
    }

  } catch (error: any) {
    console.error('Student Manage Error:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || 'Database operation failed.' 
    })
  }
})