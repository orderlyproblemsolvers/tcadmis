// server/api/admin/staff-manage.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const conn = useDb()

  // Ensure only admins can access this (Security Check)
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  try {
    // --- ACTION: DELETE STAFF ---
    if (body.action === 'delete') {
      if (!body.id) throw createError({ statusCode: 400, message: 'ID required' })

      // 1. Unassign their classes first (Set teacher_id to NULL)
      // This prevents classes from disappearing or erroring out
      await conn.execute('UPDATE classes SET teacher_id = NULL WHERE teacher_id = ?', [body.id])
      
      // 2. Delete the User
      // Note: If you set up the Foreign Key correctly with ON DELETE CASCADE,
      // this will automatically delete the row in 'profiles_teacher' too.
      await conn.execute('DELETE FROM users WHERE id = ?', [body.id])
      
      return { success: true, message: 'Staff deleted successfully' }
    }

    // --- ACTION: UPDATE STAFF ---
    if (body.action === 'update') {
      if (!body.id) throw createError({ statusCode: 400, message: 'ID required' })

      // 1. Update Core Info (Users Table)
      await conn.execute(
        'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
        [body.full_name, body.email, body.id]
      )

      // 2. Update/Upsert Profile Info (Profiles Table)
      // We use INSERT ... ON DUPLICATE KEY UPDATE to handle cases where 
      // the user exists but the profile row might be missing (e.g. old accounts)
      const profileQuery = `
        INSERT INTO profiles_teacher (
          user_id, photo_url, qualification, phone, address,
          guarantor_name, guarantor_phone, guarantor_rel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          photo_url = VALUES(photo_url),
          qualification = VALUES(qualification),
          phone = VALUES(phone),
          address = VALUES(address),
          guarantor_name = VALUES(guarantor_name),
          guarantor_phone = VALUES(guarantor_phone),
          guarantor_rel = VALUES(guarantor_rel)
      `

      await conn.execute(profileQuery, [
        body.id, // user_id
        body.photo_url || null,
        body.qualification || null,
        body.phone || null,
        body.address || null,
        body.guarantor_name || null,
        body.guarantor_phone || null,
        body.guarantor_rel || null
      ])

      return { success: true, message: 'Staff profile updated successfully' }
    }

    throw createError({ statusCode: 400, message: 'Invalid action' })

  } catch (error: any) {
    console.error('Staff Manage Error:', error)
    throw createError({ statusCode: 500, message: error.message || 'Database error' })
  }
})