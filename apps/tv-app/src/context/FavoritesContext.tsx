import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteChannels: string[];
  favoriteMovies: string[];
  toggleFavoriteChannel: (channelId: string) => void;
  isChannelFavorite: (channelId: string) => boolean;
  toggleFavoriteMovie: (movieId: string) => void;
  isMovieFavorite: (movieId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteChannels: [],
  favoriteMovies: [],
  toggleFavoriteChannel: () => {},
  isChannelFavorite: () => false,
  toggleFavoriteMovie: () => {},
  isMovieFavorite: () => false,
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteChannels, setFavoriteChannels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexotv_fav_channels');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteMovies, setFavoriteMovies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexotv_fav_movies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexotv_fav_channels', JSON.stringify(favoriteChannels));
    } catch (e) {
      console.log('Error saving fav channels:', e);
    }
  }, [favoriteChannels]);

  useEffect(() => {
    try {
      localStorage.setItem('nexotv_fav_movies', JSON.stringify(favoriteMovies));
    } catch (e) {
      console.log('Error saving fav movies:', e);
    }
  }, [favoriteMovies]);

  const toggleFavoriteChannel = (id: string) => {
    setFavoriteChannels((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isChannelFavorite = (id: string) => favoriteChannels.includes(id);

  const toggleFavoriteMovie = (id: string) => {
    setFavoriteMovies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isMovieFavorite = (id: string) => favoriteMovies.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteChannels,
        favoriteMovies,
        toggleFavoriteChannel,
        isChannelFavorite,
        toggleFavoriteMovie,
        isMovieFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
