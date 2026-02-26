import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/posts/[id]/like - 点赞/取消点赞
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id
        }
      }
    })

    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      return NextResponse.json({ liked: false })
    } else {
      // 添加点赞
      await prisma.like.create({
        data: {
          postId: params.id,
          userId: session.user.id
        }
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    return NextResponse.json(
      { error: '点赞操作失败' },
      { status: 500 }
    )
  }
}

// GET /api/posts/[id]/like - 检查是否已点赞
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('检查点赞状态失败:', error)
    return NextResponse.json(
      { error: '检查点赞状态失败' },
      { status: 500 }
    )
  }
}
