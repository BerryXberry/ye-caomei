'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  stockCode: string | null
  stockName: string | null
  tags: string[]
  views: number
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    comments: number
    likes: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts?page=${page}&limit=20`)
      const data = await res.json()
      
      if (res.ok) {
        setPosts(data.posts)
        setPagination(data.pagination)
      } else {
        setError(data.error || '获取帖子失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-pink-600">{error}</p>
        <button 
          onClick={fetchPosts}
          className="mt-4 text-pink-600 hover:underline"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          还没有帖子，来发第一条吧！
        </div>
      ) : (
        posts.map(post => (
          <Link 
            key={post.id} 
            href={`/post/${post.id}`}
            className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
          >
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {post.title}
            </h3>

            {/* 内容预览 */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {post.content}
            </p>

            {/* 股票标签 */}
            {post.stockCode && (
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-pink-50 to-orange-50 text-pink-700">
                  📈 {post.stockCode} {post.stockName}
                </span>
              </div>
            )}

            {/* 标签 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 底部信息 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>{post.author.name || '匿名用户'}</span>
                <span>{formatTime(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  👁 {post.views}
                </span>
                <span className="flex items-center gap-1">
                  💬 {post._count.comments}
                </span>
                <span className="flex items-center gap-1">
                  👍 {post._count.likes}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span className="px-4 py-2 text-gray-600">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
