// server/api/admin/teachers.get.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  
  // Security: Only Admins can view the full staff list
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const conn = useDb()

  try {
    // We LEFT JOIN 'profiles_teacher' so that even if a teacher 
    // hasn't filled out their profile yet, they still show up in the list.
    const query = `
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.role, 
        u.created_at,
        p.photo_url, 
        p.qualification, 
        p.phone, 
        p.address,
        p.guarantor_name, 
        p.guarantor_phone, 
        p.guarantor_rel
      FROM users u
      LEFT JOIN profiles_teacher p ON u.id = p.user_id
      WHERE u.role = 'teacher'
      ORDER BY u.full_name ASC
    `
    
    const result: any = await conn.execute(query)
    
    // Handle database driver response format
    const rows = Array.isArray(result) ? result : result.rows || []

    return rows

  } catch (error: any) {
    console.error('Fetch Teachers Error:', error)
    throw createError({ statusCode: 500, message: error.message || 'Failed to fetch staff list' })
  }
})