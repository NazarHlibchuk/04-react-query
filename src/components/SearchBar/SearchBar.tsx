import { useState } from "react";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search movies..."
        className={css.input}
      />
      <button type="submit" className={css.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
