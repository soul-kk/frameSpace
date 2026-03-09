export interface Movie {
  id: number | string
  title: string //标题
  poster: string //海报
  year: number //年份
  rating: number //评分
  genre: string[] //类型
  director: string //导演
  description: string //描述
  actors: string[] //演员
  duration: number //时长
  comment?: string // 评论
  created_at?: string // 创建时间
  watchUrl?: string // 观影链接
}

export interface MovieFilters {
  query?: string
  genre?: string
  year?: number | string
  minRating?: number
}

export interface MovieStats {
  total: number
  byGenre: Record<string, number>
  byYear: Record<string, number>
  byRating: Record<string, number>
  favorites: number
}
