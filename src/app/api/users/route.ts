import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await db.user.findMany({
      include: { _count: { select: { listings: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    const user = await db.user.update({ where: { id }, data: updates })
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Users PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
