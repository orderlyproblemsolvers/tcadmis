// server/api/admin-reset.get.ts
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const conn = useDb()
  const email = 'efeiniko1@gmail.com'
  const password = '081031Efe###' // The password you will use to login
  
  try {
    // 1. Generate a fresh, valid hash
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // 2. Delete the old broken user (to avoid duplicates)
    await conn.execute('DELETE FROM users WHERE email = ?', [email])

    // 3. Insert the new fresh user
    await conn.execute(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hash, 'Inikori Efe', 'admin']
    )

    return {
      status: 'success',
      message: 'Admin recreated successfully',
      credentials: {
        email: email,
        password: password
      }
    }

  } catch (error: any) {
    return {
      status: 'error',
      message: error.message
    }
  }
})