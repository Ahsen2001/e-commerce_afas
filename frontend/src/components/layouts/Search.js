import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

    useEffect(() => {
    if (location.pathname === '/') {
      setKeyword('');
      }
  }, [location]);
  
  return (
    <form onSubmit={searchHandler} style={{ width: "100%" }}>
      <style>{`
        #search_field::placeholder { color: rgba(0,0,0,0.45); }
        #search_field { color: #fff; }
      `}</style>

      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.12)",
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderRadius: "25px",
        padding: "4px 6px 4px 16px",
        transition: "border-color 0.2s, background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      >
        <i className="fa fa-search" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginRight: "10px", flexShrink: 0 }} />

        <input
          id="search_field"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search destinations, products..."
          style={{
            flex: 1, background: "transparent",
            border: "none", outline: "none",
            fontSize: "14px", padding: "6px 0",
          }}
        />

        {/* Clear button */}
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword('')}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              color: "#fff", borderRadius: "50%",
              width: "22px", height: "22px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "11px", marginRight: "6px",
              flexShrink: 0,
            }}
          >
            <i className="fa fa-times" />
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #5ce1e6, #0d7377)",
            border: "none", color: "#fff",
            borderRadius: "20px", padding: "7px 16px",
            fontSize: "13px", fontWeight: 700,
            cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", gap: "6px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <i className="fa fa-search" />
          Search
        </button>
      </div>
    </form>
  );
}