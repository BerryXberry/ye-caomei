import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/posts/[id]/comments - 获取帖子的评论
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id, parentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('获取评论失败:', error)
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// POST /api/posts/[id]/comments - 发表评论
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

    const body = await req.json()
    const { content, parentId } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: params.id,
        authorId: session.user.id,
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('发表评论失败:', error)
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    )
  }
}
