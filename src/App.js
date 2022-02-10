import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const { books, loading, hasMore, error } = useBookSearch(query, pageNumber);

  const lastBookElement = useCallback((node) => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  const onSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <div className='container'>
      <div className='content'>
        <h2 className='title'>Type to get book results</h2>
        <input
          type={'text'}
          value={query}
          onChange={onSearch}
          placeholder='Search for books'
          className='input'
        />
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElement} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })}
        <div>{loading && <b>Loading...</b>}</div>
        <div>{error && 'Error from API'}</div>
      </div>
    </div>
  );
}

export default App;
