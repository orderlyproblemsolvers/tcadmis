// server/api/auth/login.post.ts
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Email and password required' })
  }

  const conn = useDb()

  try {
    // 1. Fetch User
    // The driver returns the array directly, so we cast 'result' as the array
    const result = await conn.execute('SELECT * FROM users WHERE email = ?', [body.email.trim()])
    const rows = result as any[] 
    const user = rows?.[0]

    // 2. Check if user exists
    if (!user) {
      throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }

    // 3. Verify Password
    const passwordMatch = await bcrypt.compare(body.password.trim(), user.password_hash)

    if (!passwordMatch) {
      throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }

    // 4. Create Session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    })

    return { success: true, role: user.role }

  } catch (error: any) {
    console.error('Login Error:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: 'Server error' })
  }
})