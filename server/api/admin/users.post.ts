// server/api/admin/users.post.ts
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  console.log('--- STARTING USER CREATION ---')
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  console.log('1. Received Body:', { email: body.email, name: body.full_name })

  if (!body.email || !body.full_name || !body.password) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const conn = useDb()

  try {
    // 1. Hash Password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(body.password, salt)

    // 2. Insert into USERS
    console.log('2. Inserting into Users table...')
    const userResult: any = await conn.execute(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, 'teacher')`,
      [body.email, hash, body.full_name]
    )
    
    // DEBUG LOG: See what the database returned
    console.log('3. Database Result Object:', JSON.stringify(userResult, null, 2))

    // 3. Extract ID (Handle different driver responses)
    // Some drivers return 'insertId', others 'lastInsertId', others put it in 'rows'
    let newUserId = userResult.insertId || userResult.lastInsertId
    
    // Fallback: If ID is missing, try fetching it manually
    if (!newUserId) {
      console.log('⚠️ Warning: ID not returned directly. Fetching manually...')
      const fetchId = await conn.execute('SELECT id FROM users WHERE email = ?', [body.email])
      const rows = Array.isArray(fetchId) ? fetchId : (fetchId as any).rows
      if (rows && rows.length > 0) {
        newUserId = rows[0].id
      }
    }

    console.log('4. New User ID:', newUserId)

    if (!newUserId) {
      throw new Error('CRITICAL: Could not determine new User ID.')
    }

    // 4. Insert into PROFILES
    console.log('5. Inserting into Profiles table...')
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

    console.log('✅ SUCCESS: Teacher created.')
    return { success: true, message: 'Teacher account created successfully' }

  } catch (error: any) {
    console.error('❌ FATAL ERROR:', error)
    
    if (error.message && (error.message.includes('Duplicate entry') || error.code === 'ER_DUP_ENTRY')) {
      throw createError({ statusCode: 409, message: 'Email already exists' })
    }
    
    // Return the actual error message to the frontend so you can see it in the Toast
    throw createError({ statusCode: 500, message: `DB Error: ${error.message}` })
  }
})