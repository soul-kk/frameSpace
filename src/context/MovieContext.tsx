import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieFilters, MovieStats } from '../types';

const DEFAULT_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster: "https://kimi-web-img.moonshot.cn/img/m.media-amazon.com/dacb8779d94de8bc574b7d481fcb11ac45f180d6.jpg",
    year: 1994,
    rating: 9.2,
    genre: "drama",
    director: "Frank Darabont",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    actors: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    duration: 142,
  },
  {
    id: 2,
    title: "The Godfather",
    poster: "https://kimi-web-img.moonshot.cn/img/i.etsystatic.com/76b971d4ae44f9b6c50706f15d43a94c6416ea49.jpg",
    year: 1972,
    rating: 9.2,
    genre: "drama",
    director: "Francis Ford Coppola",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    duration: 175,
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster: "https://kimi-web-img.moonshot.cn/img/m.media-amazon.com/4ac17f13900cd6efe377b03e579c0f7d32cbfb9b.jpg",
    year: 2008,
    rating: 9.0,
    genre: "action",
    director: "Christopher Nolan",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    duration: 152,
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster: "https://kimi-web-img.moonshot.cn/img/i.ebayimg.com/cd52756866c98950ca6bc85eac1f379a03a54842.jpg",
    year: 1994,
    rating: 8.9,
    genre: "drama",
    director: "Quentin Tarantino",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    duration: 154,
  },
  {
    id: 5,
    title: "Inception",
    poster: "https://kimi-web-img.moonshot.cn/img/i.ebayimg.com/ffb5ae1e3227bdb0595d9adab6416e35d353b87f.png",
    year: 2010,
    rating: 8.8,
    genre: "scifi",
    director: "Christopher Nolan",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    actors: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    duration: 148,
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

    if (filters.minRating) {
      filtered = filtered.filter(movie => movie.rating >= filters.minRating);
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



