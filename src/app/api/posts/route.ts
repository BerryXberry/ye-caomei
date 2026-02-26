import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/posts - 获取帖子列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const stockCode = searchParams.get('stockCode')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'newest'

    const skip = (page - 1) * limit

    const where: any = {}
    if (stockCode) {
      where.stockCode = stockCode
    }
    if (tag) {
      where.tags = { has: tag }
    }

    const orderBy: any = sort === 'hottest' 
      ? [{ views: 'desc' }, { createdAt: 'desc' }]
      : { createdAt: 'desc' }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    return NextResponse.json(
      { error: '获取帖子列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/posts - 创建新帖子
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, content, stockCode, stockName, tags } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        stockCode: stockCode?.trim() || null,
        stockName: stockName?.trim() || null,
        tags: tags?.filter(Boolean) || [],
        authorId: session.user.id
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

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('创建帖子失败:', error)
    return NextResponse.json(
      { error: '创建帖子失败' },
      { status: 500 }
    )
  }
}
