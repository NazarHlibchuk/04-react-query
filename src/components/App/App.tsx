import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { FetchMoviesResponse } from "../../services/movieService";

import "modern-normalize/modern-normalize.css";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<FetchMoviesResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  // показуємо toast тільки один раз при новому успішному запиті
  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <SearchBar
        onSubmit={(searchQuery) => {
          setQuery(searchQuery);
          setPage(1);
        }}
      />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <>
          {/* Пагінація зверху */}
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <Toaster position="top-right" />
    </>
  );
}
