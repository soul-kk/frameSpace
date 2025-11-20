export interface Movie {
  id: number | string;
  title: string;
  poster: string;
  year: number;
  rating: number;
  genre: string;
  director: string;
  description: string;
  actors: string[];
  duration: number;
}

export interface MovieFilters {
  query?: string;
  genre?: string;
  year?: number | string;
  minRating?: number;
}

export interface MovieStats {
  total: number;
  byGenre: Record<string, number>;
  byYear: Record<string, number>;
  byRating: Record<string, number>;
  favorites: number;
}



