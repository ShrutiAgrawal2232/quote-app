import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const observer = useRef();

  const fetchQuotes = async () => {
    const token = localStorage.getItem("token");
    if (!hasMore || isLoading) return; // Prevent duplicate requests

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${offset}`,
        { headers: { Authorization: token } }
      );
      const { data } = await response.json();
      if (data.length) {
        setQuotes((prev) => [...prev, ...data]);
        setOffset((prev) => prev + 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      alert("Failed to fetch quotes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []); // Initial fetch

  const lastQuoteElementRef = useRef();

  // Observer for infinite scroll
  useEffect(() => {
    if (isLoading) return;
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchQuotes();
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      root: null, // Observe viewport
      rootMargin: "100px", // Trigger before reaching the element
      threshold: 1.0,
    });

    if (lastQuoteElementRef.current) {
      observer.current.observe(lastQuoteElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote, index) => (
          <div
            key={quote.id}
            className="p-4 bg-white rounded shadow-md"
            ref={index === quotes.length - 1 ? lastQuoteElementRef : null}
          >
            <div
              className="relative w-full h-48 bg-gray-200 rounded"
              style={{
                backgroundImage: `url(${quote.mediaUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="absolute inset-0 flex items-center justify-center text-white text-center bg-black bg-opacity-50 p-2">
                {quote.text}
              </p>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>{quote.username}</p>
              <p>{new Date(quote.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="text-center text-gray-500 mt-4">Loading...</div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-500 mt-4">
          You have reached the end of the list.
        </div>
      )}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-4 right-4 p-4 text-white bg-blue-500 rounded-full hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
};

export default QuoteList;
