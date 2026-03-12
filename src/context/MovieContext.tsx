import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types';
import { getMovies } from '../services/api';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies();
        // Map API data to Movie interface
        const mappedMovies: Movie[] = data.map((item: any) => ({
          ...item,
          poster: item.posterUrl, // Map posterUrl to poster
          rating: item.rate,      // Map rate to rating
        }));
        setMovies(mappedMovies);
        console.log('movie:::::', mappedMovies);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, loading, error }}>
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
