import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieFilters, MovieStats } from '../types';

const DEFAULT_MOVIES: Movie[] = [
  {
    id: 1,
    title: "肖申克的救赎",
    poster: "https://upload.wikimedia.org/wikipedia/zh/d/de/The_Shawshank_Redemption_poster.jpg",
    year: 1994,
    rating: 9.7,
    genre: "剧情",
    director: "Frank Darabont",
    description: "一场谋杀案使银行家安迪蒙冤入狱，谋杀妻子及其情人的罪名将他囚禁于肖申克监狱。在二十年的铁窗生涯中，他与瑞德结下了深厚的友谊，从未放弃对自由的渴望，最终实现了自我救赎。",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    duration: 142,
  },
  {
    id: 2,
    title: "教父",
    poster: "https://upload.wikimedia.org/wikipedia/zh/1/1c/Godfather_ver1.jpg",
    year: 1972,
    rating: 9.3,
    genre: "剧情",
    director: "Francis Ford Coppola",
    description: "二战结束后，美国黑手党柯里昂家族面临新老交替。小儿子迈克尔在父亲遭暗杀未遂后，逐渐从一个不想涉足家族事务的青年，转变为冷酷无情的家族新一代教父。",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    duration: 175,
  },
  {
    id: 3,
    title: "蝙蝠侠：黑暗骑士",
    poster: "https://upload.wikimedia.org/wikipedia/zh/6/6b/Dark_knight_poster.jpg",
    year: 2008,
    rating: 9.2,
    genre: "动作",
    director: "Christopher Nolan",
    description: "小丑的出现让哥谭市陷入混乱，蝙蝠侠必须在坚守原则和打击罪恶之间做出艰难抉择。他与戈登警长和哈维·丹特联手，试图将在这座城市蔓延的犯罪组织一网打尽。",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    duration: 152,
  },
  {
    id: 4,
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
    id: 5,
    title: "盗梦空间",
    poster: "https://upload.wikimedia.org/wikipedia/zh/1/18/Inception_OST.jpg",
    year: 2010,
    rating: 9.4,
    genre: "科幻",
    director: "Christopher Nolan",
    description: "造梦师柯布通过潜入他人的梦境窃取商业机密。为了重返家园，他接受了一项看似不可能的任务：不是窃取想法，而是在目标人物的潜意识中植入一个想法。",
    actors: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    duration: 148,
  },
  {
    id: 6,
    title: "一一",
    poster: "https://upload.wikimedia.org/wikipedia/zh/a/ae/Yi_Yi_poster.jpg",
    year: 2000,
    rating: 9.1,
    genre: "剧情",
    director: "杨德昌",
    description: "讲述了台北一家人各自面临的生活困境和情感纠葛，透过孩童、青年、中年、老年的不同视角，展现了生命的各个阶段和人生的复杂况味。",
    actors: ["吴念真", "金燕玲", "李凯莉"],
    duration: 173,
  },
  {
    id: 7,
    title: "怦然心动",
    poster: "https://upload.wikimedia.org/wikipedia/zh/8/87/Flipped_poster.jpg",
    year: 2010,
    rating: 9.1,
    genre: "爱情",
    director: "Rob Reiner",
    description: "讲述了青春期男孩布莱斯和女孩朱莉两人之间的有趣战争。朱莉对布莱斯一见钟情，而布莱斯避之不及，随着成长的变化，两人对彼此的看法也发生了逆转。",
    actors: ["Madeline Carroll", "Callan McAuliffe", "Rebecca De Mornay"],
    duration: 90,
  },
  {
    id: 8,
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
    id: 9,
    title: "酒精计划",
    poster: "https://upload.wikimedia.org/wikipedia/zh/0/04/Druk_poster.jpg",
    year: 2020,
    rating: 8.1,
    genre: "剧情",
    director: "Thomas Vinterberg",
    description: "四名高中老师为了摆脱日常的循规蹈矩，开始了一项持续醉酒的实验，试图通过维持一定程度的酒精摄入来提高工作效率和生活质量。",
    actors: ["Mads Mikkelsen", "Thomas Bo Larsen", "Magnus Millang"],
    duration: 117,
  },
  {
    id: 10,
    title: "控方证人",
    poster: "https://upload.wikimedia.org/wikipedia/zh/2/2f/Witness_for_the_Prosecution_poster.jpg",
    year: 1957,
    rating: 9.6,
    genre: "剧情",
    director: "Billy Wilder",
    description: "伦敦著名刑案辩护律师韦尔弗里德爵士接手了一桩谋杀案，嫌疑人沃尔被指控杀害了富婆。在庭审过程中，案情跌宕起伏，真相扑朔迷离。",
    actors: ["Tyrone Power", "Marlene Dietrich", "Charles Laughton"],
    duration: 116,
  },
  {
    id: 11,
    title: "遗愿清单",
    poster: "https://upload.wikimedia.org/wikipedia/zh/5/53/Bucket_list_poster.jpg",
    year: 2007,
    rating: 8.7,
    genre: "剧情",
    director: "Rob Reiner",
    description: "两个患了癌症晚期的病人——亿万富翁爱德华和汽车修理工卡特，决定在余下的日子里去完成他们列出的“遗愿清单”，在旅途中寻找人生的意义。",
    actors: ["Jack Nicholson", "Morgan Freeman", "Sean Hayes"],
    duration: 97,
  },
  {
    id: 12,
    title: "绿皮书",
    poster: "https://upload.wikimedia.org/wikipedia/zh/3/32/Green_Book_poster.jpg",
    year: 2018,
    rating: 8.9,
    genre: "剧情",
    director: "Peter Farrelly",
    description: "改编自真实故事，讲述了意裔美国人托尼作为司机，护送黑人钢琴家唐·雪利前往种族歧视严重的美国南方巡演的过程，两人跨越种族与阶级建立起深厚友谊。",
    actors: ["Viggo Mortensen", "Mahershala Ali", "Linda Cardellini"],
    duration: 130,
  },
  {
    id: 13,
    title: "触不可及",
    poster: "https://upload.wikimedia.org/wikipedia/zh/9/94/Intouchables_poster.jpg",
    year: 2011,
    rating: 9.3,
    genre: "剧情",
    director: "Olivier Nakache",
    description: "因为一次跳伞事故，白人富翁菲利普瘫痪在床，雇佣了刚从监狱出来的黑人青年德希斯作为看护。两个背景天差地别的人，在相处中碰撞出奇妙的火花。",
    actors: ["François Cluzet", "Omar Sy", "Anne Le Ny"],
    duration: 112,
  },
  {
    id: 14,
    title: "一级恐惧",
    poster: "https://upload.wikimedia.org/wikipedia/zh/f/fc/Primal_Fear_poster.jpg",
    year: 1996,
    rating: 8.5,
    genre: "惊悚",
    director: "Gregory Hoblit",
    description: "芝加哥一名主教被杀，身上有血迹的少年阿伦被当场抓获。律师马丁决定为阿伦辩护，随着调查深入，他发现案情远比想象中复杂。",
    actors: ["Richard Gere", "Edward Norton", "Laura Linney"],
    duration: 129,
  },
  {
    id: 15,
    title: "美丽人生",
    poster: "https://upload.wikimedia.org/wikipedia/zh/7/7c/Life_is_Beautiful_poster.jpg",
    year: 1997,
    rating: 9.6,
    genre: "剧情",
    director: "Roberto Benigni",
    description: "二战时期，犹太青年基多和儿子被送进纳粹集中营。为了不让儿子心灵蒙上阴影，基多用游戏的方式编织了一个美丽的谎言，保护了孩子的童心。",
    actors: ["Roberto Benigni", "Nicoletta Braschi", "Giorgio Cantarini"],
    duration: 116,
  },
  {
    id: 16,
    title: "周处除三害",
    poster: "https://upload.wikimedia.org/wikipedia/zh/1/1c/The_Pig%2C_The_Snake_and_The_Pigeon.jpg",
    year: 2023,
    rating: 8.1,
    genre: "动作",
    director: "黄精甫",
    description: "通缉犯陈桂林在得知自己身患绝症后，决定在死前干一番大事，除掉通缉榜上排在自己前面的两大罪犯，以留名青史。",
    actors: ["阮经天", "袁富华", "陈以文"],
    duration: 134,
  },
  {
    id: 17,
    title: "沙丘",
    poster: "https://upload.wikimedia.org/wikipedia/zh/d/de/Dune_Part_One_poster.jpg",
    year: 2021,
    rating: 7.7,
    genre: "科幻",
    director: "Denis Villeneuve",
    description: "天赋异禀的少年保罗·厄崔迪为了家族的未来，必须前往宇宙中最危险的星球——沙丘，那里出产珍贵的香料，也是各方势力争夺的焦点。",
    actors: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    duration: 155,
  },
  {
    id: 18,
    title: "疾速追杀",
    poster: "https://upload.wikimedia.org/wikipedia/zh/5/57/John_Wick_poster.jpg",
    year: 2014,
    rating: 7.8,
    genre: "动作",
    director: "Chad Stahelski",
    description: "退休杀手约翰·威克因为爱犬被杀、爱车被抢，愤而重出江湖，单枪匹马对黑帮展开了血腥的复仇之路。",
    actors: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
    duration: 101,
  },
  {
    id: 19,
    title: "阿甘正传",
    poster: "https://upload.wikimedia.org/wikipedia/zh/0/02/Forrest_Gump_poster.jpg",
    year: 1994,
    rating: 9.5,
    genre: "剧情",
    director: "Robert Zemeckis",
    description: "先天智障的阿甘，在母亲的鼓励下，凭借上帝赐予的“飞毛腿”和纯真善良的心，见证了美国历史上的多个重大事件，并创造了属于自己的传奇。",
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    duration: 142,
  },
  {
    id: 20,
    title: "和莎莫的五百天",
    poster: "https://upload.wikimedia.org/wikipedia/zh/d/d1/Five_Hundred_Days_of_Summer.jpg",
    year: 2009,
    rating: 8.0,
    genre: "爱情",
    director: "Marc Webb",
    description: "相信真爱的汤姆爱上了不相信真爱的女孩莎莫。电影通过非线性的叙事，展现了两人500天的情感波折，探讨了爱情的本质。",
    actors: ["Joseph Gordon-Levitt", "Zooey Deschanel", "Geoffrey Arend"],
    duration: 95,
  },
  {
    id: 21,
    title: "银翼杀手",
    poster: "https://upload.wikimedia.org/wikipedia/zh/c/c2/Blade_Runner_poster.jpg",
    year: 1982,
    rating: 8.5,
    genre: "科幻",
    director: "Ridley Scott",
    description: "2019年的洛杉矶，退役的“银翼杀手”戴克奉命追捕潜入地球的复制人。在追捕过程中，他开始怀疑人类与复制人的界限，以及生命的意义。",
    actors: ["Harrison Ford", "Rutger Hauer", "Sean Young"],
    duration: 117,
  },
  {
    id: 22,
    title: "心灵捕手",
    poster: "https://upload.wikimedia.org/wikipedia/zh/b/b8/Good_Will_Hunting_poster.jpg",
    year: 1997,
    rating: 8.9,
    genre: "剧情",
    director: "Gus Van Sant",
    description: "麻省理工学院的清洁工威尔是一个数学天才，但他却是个叛逆的问题少年。在心理学教授尚恩的帮助下，威尔终于打开心扉，消除了人际隔阂，找回了自我。",
    actors: ["Matt Damon", "Robin Williams", "Ben Affleck"],
    duration: 126,
  },
  {
    id: 23,
    title: "闪灵",
    poster: "https://upload.wikimedia.org/wikipedia/zh/1/1d/The_Shining_poster.jpg",
    year: 1980,
    rating: 8.3,
    genre: "恐怖",
    director: "Stanley Kubrick",
    description: "作家杰克带着妻儿到一家豪华酒店看管过冬。在大雪封山的日子里，杰克逐渐被酒店里的幻象逼疯，挥刀砍向了自己的亲人。",
    actors: ["Jack Nicholson", "Shelley Duvall", "Danny Lloyd"],
    duration: 146,
  },
  {
    id: 24,
    title: "头号玩家",
    poster: "https://upload.wikimedia.org/wikipedia/zh/7/74/Ready_Player_One_%28film%29.png",
    year: 2018,
    rating: 8.6,
    genre: "科幻",
    director: "Steven Spielberg",
    description: "2045年，现实世界衰退破败，人们沉迷于虚拟游戏“绿洲”。创始人去世前留下遗嘱，谁找到彩蛋就能继承巨额财富，韦德因此踏上了冒险之旅。",
    actors: ["Tye Sheridan", "Olivia Cooke", "Ben Mendelsohn"],
    duration: 140,
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



