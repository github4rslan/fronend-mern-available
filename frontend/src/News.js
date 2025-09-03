import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_KEY = "b06a0d85fdd24b078674e5f0a5c7eede"; // ✅ your key

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNews();
  }, [navigate]);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
      );
      const data = await res.json();

      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        console.error("Error fetching news:", data);
      }
    } catch (err) {
      console.error("News fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>📰 Latest News</h1>

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {articles.map((article, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
                textAlign: "left",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt="news"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <h3 style={{ fontSize: "18px", marginTop: "10px" }}>
                {article.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
