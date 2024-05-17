import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

type Film = {
  id: number;
  original_language: string;
  title: string;
  overview: string;
  poster_path: string;
};

const FILMS_PER_PAGE = 10;

function App() {
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getFilms = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=a9023a2109e90f26aecfa8eafeae32b6"
        );
        setFilms(response.data.results);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    };
    getFilms();
  }, []);

  const handleCardClick = (film: Film) => {
    setSelectedFilm(film);
    setSelectedFilmId(film.id);
    if (bannerRef.current) {
      bannerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFilms.length / FILMS_PER_PAGE);
  const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
  const selectedFilms = filteredFilms.slice(
    startIndex,
    startIndex + FILMS_PER_PAGE
  );

  return (
    <>
      <header className="header">
        <h1>Image Gallery</h1>
      </header>
      {selectedFilm && (
        <div className="banner" ref={bannerRef}>
          <img
            src={`https://image.tmdb.org/t/p/w500/${selectedFilm.poster_path}`}
            alt={selectedFilm.title}
          />
          <div className="banner-info">
            <h1>{selectedFilm.title}</h1>
            <p>{selectedFilm.overview}</p>
            <p>Language: {selectedFilm.original_language}</p>
          </div>
        </div>
      )}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="container">
        {selectedFilms.length < 1 ? (
          <p>Tidak ada film tersedia</p>
        ) : (
          selectedFilms.map((film) => (
            <div
              key={film.id}
              className={`card ${
                selectedFilmId === film.id
                  ? "selected"
                  : selectedFilmId
                  ? "faded"
                  : ""
              }`}
              onClick={() => handleCardClick(film)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${film.poster_path}`}
                alt="film image"
              />
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;
