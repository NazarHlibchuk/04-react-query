import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { fetchMovies } from "../../api/moviesApi";
import type { MoviesResponse, Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

const App = () => {
  const [query, setQuery] = useState("spiderman");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    keepPreviousData: true,
  });

  const handleSearch = (search: string) => {
    setPage(1);
    setQuery(search);
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>Movie Search</h1>

      <SearchBar onSearch={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage message="Failed to load movies." />}

      {data && <MovieGrid movies={data.results as Movie[]} />}

      {data && data.total_pages > 1 && (
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
    </div>
  );
};

export default App;
