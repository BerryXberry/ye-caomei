'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

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

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  replies: Comment[]
}

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPost()
      fetchComments()
      checkLikeStatus()
    }
  }, [params.id])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      }
    } catch (err) {
      console.error('获取帖子失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (err) {
      console.error('获取评论失败:', err)
    }
  }

  const checkLikeStatus = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/like`)
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
      }
    } catch (err) {
      console.error('检查点赞状态失败:', err)
    }
  }

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLiked(data.liked)
        if (post) {
          setPost({
            ...post,
            _count: {
              ...post._count,
              likes: post._count.likes + (data.liked ? 1 : -1)
            }
          })
        }
      }
    } catch (err) {
      console.error('点赞失败:', err)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent })
      })

      if (res.ok) {
        setCommentContent('')
        fetchComments()
        if (post) {
          setPost({
            ...post,
            _count: {
              ...post._count,
              comments: post._count.comments + 1
            }
          })
        }
      }
    } catch (err) {
      console.error('发表评论失败:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">帖子不存在或已被删除</p>
            <Link href="/" className="text-pink-600 hover:underline mt-4 inline-block">
              返回首页
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 帖子内容 */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* 作者信息 */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {(post.author.name || '匿').charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name || '匿名用户'}</p>
                <p className="text-sm text-gray-500">{formatTime(post.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👁 {post.views} 浏览</span>
            </div>
          </div>

          {/* 股票信息 */}
          {post.stockCode && (
            <div className="mb-6">
              <Link 
                href={`/stock/${post.stockCode}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-50 to-orange-50 text-pink-700 rounded-lg hover:from-pink-100 hover:to-orange-100 transition-colors"
              >
                <span className="font-semibold">📈 {post.stockCode}</span>
                {post.stockName && (
                  <span className="ml-2">{post.stockName}</span>
                )}
              </Link>
            </div>
          )}

          {/* 内容 */}
          <div className="prose max-w-none mb-6 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* 互动按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-pink-50 text-pink-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👍 {post._count.likes}
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              💬 {post._count.comments}
            </button>
          </div>
        </article>

        {/* 评论区 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            评论 ({post._count.comments})
          </h2>

          {/* 评论表单 */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="发表你的看法..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !commentContent.trim()}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {submitting ? '发送中...' : '发表评论'}
              </button>
            </div>
          </form>

          {/* 评论列表 */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">还没有评论，来抢沙发吧！</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {(comment.author.name || '匿').charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author.name || '匿名用户'}</span>
                        <span className="text-sm text-gray-500">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
