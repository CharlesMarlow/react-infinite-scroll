import { useEffect, useState } from 'react';
import axios from 'axios';

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  let cancel;
  useEffect(() => {
    setLoading(true);
    setError(false);
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {
        q: query,
        page: pageNumber,
        cancelToken: new axios.CancelToken(
          (cancelToken) => (cancel = cancelToken)
        ),
      },
    })
      .then((res) => {
        setBooks((prevBooks) => {
          // Titles may be the same, hence we want no duplicates by spreading
          // a unique set back to an array
          return [
            ...new Set([
              ...prevBooks,
              ...res.data.docs.map((book) => book.title),
            ]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
      });

    return () => {
      cancel();
    };
  }, [query, pageNumber]);

  return {
    books,
    loading,
    hasMore,
    error,
  };
};

export default useBookSearch;
