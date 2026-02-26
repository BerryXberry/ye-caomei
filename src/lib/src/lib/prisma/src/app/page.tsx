import Navbar from '@/components/Navbar'
import PostList from '@/components/PostList'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Image 
                src="/logo.png" 
                alt="野草莓社区" 
                width={64} 
                height={64}
                className="rounded-xl"
              />
              <div>
                <h1 className="text-3xl font-bold">野草莓社区</h1>
                <p className="text-pink-100 text-sm">资本美学 · 限时觉醒</p>
              </div>
            </div>
            
            <p className="text-pink-100 mb-6 max-w-2xl">
              一个专为散户投资者打造的交流平台。分享投资心得，讨论股票走势，
              学习交易技巧。这里没有机构，只有志同道合的散户。
            </p>
            <Link 
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              ✍️ 发布帖子
            </Link>
          </div>
          
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {['短线', '长线', '技术分析', '基本面', '打新', '可转债', 'ETF', '涨停'].map(tag => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-pink-50 text-gray-700 hover:text-pink-600 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <hr className="my-4 border-gray-200" />

              <h3 className="font-semibold text-gray-900 mb-4">免责声明</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                本社区所有内容仅供参考，不构成投资建议。
                股市有风险，投资需谨慎。
              </p>
            </div>
          </div>

          {/* Post List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">最新讨论</h2>
              <div className="flex gap-2">
                <Link 
                  href="/?sort=newest"
                  className="px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg"
                >
                  最新
                </Link>
                <Link 
                  href="/?sort=hottest"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  热门
                </Link>
              </div>
            </div>
            
            <PostList />
          </div>
        </div>
      </main>
    </div>
  )
}
