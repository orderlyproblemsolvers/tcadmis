// server/api/admin/assign-class.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const conn = useDb()

  try {
    // SCENARIO 1: REMOVE TEACHER
    if (body.action === 'remove') {
      await conn.execute('UPDATE classes SET teacher_id = NULL WHERE name = ?', [body.className])
      return { success: true, message: 'Teacher removed successfully' }
    }

    // SCENARIO 2: ASSIGN TEACHER
    const teacherId = parseInt(body.teacherId)

    // Check 1: Is this teacher already assigned to 2 classes?
    // We exclude the current class from the count (in case they are re-assigned to the same one)
    const checkQuery = `SELECT COUNT(*) as count FROM classes WHERE teacher_id = ? AND name != ?`
    const [checkResult] = await conn.execute(checkQuery, [teacherId, body.className]) as any[]
    
    // Safety check for the result format
    const currentCount = (checkResult as any).count || (Array.isArray(checkResult) ? checkResult[0]?.count : 0) || 0

    if (currentCount >= 2) {
      throw createError({ 
        statusCode: 400, 
        message: 'This teacher is already assigned to 2 classes (Maximum Limit).' 
      })
    }

    // If safe, proceed to assign
    await conn.execute(
      'UPDATE classes SET teacher_id = ? WHERE name = ?',
      [teacherId, body.className]
    )
    
    return { success: true, message: 'Teacher assigned successfully' }

  } catch (error: any) {
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message 
    })
  }
})