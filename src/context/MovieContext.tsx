import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieFilters, MovieStats } from '../types';

const DEFAULT_MOVIES: Movie[] = [
  {
    id: 1,
    title: "低俗小说",
    poster: "https://upload.wikimedia.org/wikipedia/zh/8/82/Pulp_Fiction_cover.jpg",
    year: 1994,
    rating: 8.9,
    genre: "剧情",
    director: "Quentin Tarantino",
    description: "影片由三个看似独立却又相互关联的故事组成，围绕着两个黑帮杀手、一个拳击手、黑帮老大的妻子以及一对抢劫鸳鸯展开，充满了黑色幽默和暴力美学。",
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    duration: 154,
  },
  {
    id: 2,
    title: "一一",
    poster: "https://k.sinaimg.cn/n/sinakd20120/225/w1080h1545/20210529/edef-kquziii3805688.jpg/w700d1q75cms.jpg",
    year: 2000,
    rating: 9.1,
    genre: "剧情",
    director: "杨德昌",
    description: "讲述了台北一家人各自面临的生活困境和情感纠葛，透过孩童、青年、中年、老年的不同视角，展现了生命的各个阶段和人生的复杂况味。",
    actors: ["吴念真", "金燕玲", "李凯莉"],
    duration: 173,
  },

  {
    id: 3,
    title: "星际穿越",
    poster: "https://upload.wikimedia.org/wikipedia/zh/b/bc/Interstellar_film_poster.jpg",
    year: 2014,
    rating: 9.4,
    genre: "科幻",
    director: "Christopher Nolan",
    description: "在地球环境恶化、粮食短缺的未来，一组宇航员通过虫洞穿越星系，寻找人类的新家园，探索关于爱、时间与生存的宏大命题。",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    duration: 169,
  },
  {
    id: 4,
    title: "一级恐惧",
    poster: "https://pic4.zhimg.com/100/v2-21da8f20210c8b535d5340f21b3dfd91_r.jpg",
    year: 1996,
    rating: 8.5,
    genre: "惊悚",
    director: "Gregory Hoblit",
    description: "芝加哥一名主教被杀，身上有血迹的少年阿伦被当场抓获。律师马丁决定为阿伦辩护，随着调查深入，他发现案情远比想象中复杂。",
    actors: ["Richard Gere", "Edward Norton", "Laura Linney"],
    duration: 129,
  },
  {
    id: 5,
    title: "美丽人生",
    poster: "https://ww2.sinaimg.cn/mw690/00650tNsly1hw57lkiak1j30wz1an7ii.jpg",
    year: 1997,
    rating: 9.6,
    genre: "剧情",
    director: "Roberto Benigni",
    description: "二战时期，犹太青年基多和儿子被送进纳粹集中营。为了不让儿子心灵蒙上阴影，基多用游戏的方式编织了一个美丽的谎言，保护了孩子的童心。",
    actors: ["Roberto Benigni", "Nicoletta Braschi", "Giorgio Cantarini"],
    duration: 116,
  },
  {
    id: 6,
    title: "和莎莫的五百天",
    poster: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201712%2F26%2F20171226214209_BKNaz.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1767775329&t=fbd2358bbc7d3e2f63741dce69b8f742",
    year: 2009,
    rating: 8.0,
    genre: "爱情",
    director: "Marc Webb",
    description: "相信真爱的汤姆爱上了不相信真爱的女孩莎莫。电影通过非线性的叙事，展现了两人500天的情感波折，探讨了爱情的本质。",
    actors: ["Joseph Gordon-Levitt", "Zooey Deschanel", "Geoffrey Arend"],
    duration: 95,
  },
];

interface MovieContextType {
  movies: Movie[];
  favorites: (string | number)[];
  searchMovies: (query: string, filters?: MovieFilters) => Movie[];
  toggleFavorite: (movieId: string | number) => void;
  isFavorite: (movieId: string | number) => boolean;
  addMovie: (movieData: Omit<Movie, 'id'>) => void;
  getMovieById: (id: string | number) => Movie | undefined;
  getFeaturedMovies: (limit?: number) => Movie[];
  getRecommendations: (movieId: string | number, limit?: number) => Movie[];
  deleteMovie: (movieId: string | number) => void;
  getAllMovies: () => Movie[];
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedMovies, setUploadedMovies] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('uploadedMovies');
    return stored ? JSON.parse(stored) : [];
  });

  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    const stored = localStorage.getItem('movieFavorites');
    return stored ? JSON.parse(stored) : [];
  });

  // Combine default and uploaded movies
  const allMovies = [...DEFAULT_MOVIES, ...uploadedMovies];

  useEffect(() => {
    localStorage.setItem('uploadedMovies', JSON.stringify(uploadedMovies));
  }, [uploadedMovies]);

  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const getAllMovies = () => allMovies;

  const getMovieById = (id: string | number) => {
    return allMovies.find(m => m.id == id);
  };

  const searchMovies = (query: string, filters: MovieFilters = {}) => {
    let filtered = allMovies;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.director.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery) ||
        movie.actors.some(actor => actor.toLowerCase().includes(lowerQuery))
      );
    }

    if (filters.genre && filters.genre !== 'all') {
      filtered = filtered.filter(movie => movie.genre === filters.genre);
    }

    if (filters.year) {
      filtered = filtered.filter(movie => movie.year == filters.year);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter(movie => movie.rating >= filters.minRating!);
    }

    return filtered;
  };

  const toggleFavorite = (movieId: string | number) => {
    setFavorites(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  const isFavorite = (movieId: string | number) => favorites.includes(movieId);

  const addMovie = (movieData: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movieData,
      id: Date.now(),
      rating: Number(movieData.rating),
      year: Number(movieData.year),
      duration: Number(movieData.duration)
    };
    setUploadedMovies(prev => [...prev, newMovie]);
  };

  const deleteMovie = (movieId: string | number) => {
    setUploadedMovies(prev => prev.filter(m => m.id !== movieId));
    setFavorites(prev => prev.filter(id => id !== movieId));
  };

  const getFeaturedMovies = (limit = 5) => {
    return [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  const getRecommendations = (movieId: string | number, limit = 6) => {
    const currentMovie = getMovieById(movieId);
    if (!currentMovie) return [];

    let recommendations = allMovies.filter(
      movie => movie.id != currentMovie.id && movie.genre === currentMovie.genre
    );

    if (recommendations.length < limit) {
      const additional = allMovies
        .filter(movie => movie.id != currentMovie.id && !recommendations.includes(movie) && movie.rating >= 8.0)
        .slice(0, limit - recommendations.length);
      recommendations = [...recommendations, ...additional];
    }

    return recommendations.slice(0, limit);
  };

  return (
    <MovieContext.Provider value={{
      movies: allMovies,
      favorites,
      searchMovies,
      toggleFavorite,
      isFavorite,
      addMovie,
      getMovieById,
      getFeaturedMovies,
      getRecommendations,
      deleteMovie,
      getAllMovies
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};



