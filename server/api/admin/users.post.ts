// server/api/admin/users.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { requireUserSession } from '#imports'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  // 1. Authorization Check (Admins Only)
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  // 2. Input Validation
  const body = await readBody(event)
  if (!body.email || !body.full_name || !body.password) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const conn = useDb()

  try {
    // 3. Secure Password Hashing
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)

    // 4. Create Base User Record
    // We explicitly set the role to 'teacher' here.
    const userResult: any = await conn.execute(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [body.email, hash, body.full_name, 'teacher']
    )

    // 5. Retrieve New User ID (Driver Agnostic)
    // Different SQL drivers return the ID in different properties (insertId vs lastInsertId).
    // If both fail, we fallback to a manual SELECT fetch.
    let newUserId = userResult.insertId || userResult.lastInsertId

    if (!newUserId) {
      const fetchId = await conn.execute('SELECT id FROM users WHERE email = ?', [body.email])
      const rows = Array.isArray(fetchId) ? fetchId : (fetchId as any).rows
      if (rows && rows.length > 0) {
        newUserId = rows[0].id
      }
    }

    if (!newUserId) {
      throw new Error('Critical: Failed to retrieve new user ID after insertion.')
    }

    // 6. Create Teacher Profile
    // We use null coalescence (|| null) to ensure optional fields don't break the query.
    const profileQuery = `
      INSERT INTO profiles_teacher (
        user_id, photo_url, qualification, phone, address,
        guarantor_name, guarantor_phone, guarantor_rel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    await conn.execute(profileQuery, [
      newUserId,
      body.photo_url || null,
      body.qualification || null,
      body.phone || null,
      body.address || null,
      body.guarantor_name || null,
      body.guarantor_phone || null,
      body.guarantor_rel || null
    ])

    return { success: true, message: 'Teacher account created successfully' }

  } catch (error: any) {
    // 7. Error Handling
    // Catch duplicate email errors specifically for better UI feedback.
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('Duplicate entry')) {
      throw createError({ statusCode: 409, message: 'Email address is already registered.' })
    }
    
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Database transaction failed.' 
    })
  }
})