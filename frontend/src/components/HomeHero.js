import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

  const heroSlides = [
    {
      title: "Sigiriya Rock Fortress",
      subtitle: "Ancient Wonder of Sri Lanka",
      tag: "Heritage",
      img: "/images/previews/Sigiriya.jpg",
    },
    {
      title: "Nine Arch Bridge",
      subtitle: "Beautiful Hill Country View",
      tag: "Hill Country",
      img: "/images/previews/nine-arch.jpg",
    },
    {
      title: "Unawatuna Beach",
      subtitle: "Golden Coastal Paradise",
      tag: "Beach",
      img: "/images/previews/beach.jpg",
    },
  ];


function HomeHero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const heroRef = useRef(null);

  useEffect(() => {
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(heroRef.current);
    const interval = setInterval(() => {
      if (visible && !document.hidden) {
        setCurrentSlide((previous) => (previous + 1) % heroSlides.length);
      }
    }, 4500);
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
          <div ref={heroRef}
            style={{
              height: "92vh",
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              position: "relative",
              overflow: "hidden",
              marginBottom: "3rem",
            }}
          >
            {/* Slides */}
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${slide.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: index === currentSlide ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                }}
              >
                {/* Dark gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(10,30,60,0.75) 100%)",
                  }}
                />
              </div>
            ))}

            {/* Hero Content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(92,225,230,0.15)",
                  border: "1px solid rgba(92,225,230,0.4)",
                  borderRadius: "20px",
                  padding: "5px 16px",
                  marginBottom: "1.2rem",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#5ce1e6",
                    display: "inline-block",
                    animation: "badgeDotPulse 1.8s ease-in-out infinite",
                  }}
                />
                <i
                  className="fa fa-globe"
                  style={{ color: "#5ce1e6", fontSize: "12px" }}
                />
                <span
                  style={{
                    color: "#5ce1e6",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Smart Tourism Platform
                </span>
              </div>

              {/* Main heading */}
              <h1
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "clamp(36px, 6vw, 72px)",
                  lineHeight: 1.1,
                  marginBottom: "0.6rem",
                  textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}
              >
                Discover Sri Lanka
              </h1>

              {/* Slide subtitle */}
              <p
                style={{
                  color: "#5ce1e6",
                  fontSize: "clamp(16px, 2.5vw, 22px)",
                  fontWeight: 700,
                  marginBottom: "0.4rem",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                  transition: "all 0.4s",
                }}
              >
                {heroSlides[currentSlide].title}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "15px",
                  marginBottom: "2rem",
                }}
              >
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Search bar */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "50px",
                  padding: "6px 6px 6px 20px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "540px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  marginBottom: "2rem",
                  gap: "8px",
                }}
              >
                <i
                  className="fa fa-search"
                  style={{ color: "#aaa", fontSize: "15px" }}
                />
                <input
                  type="text"
                  placeholder="Search destinations or products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchInput.trim())
                      navigate(`/search/${searchInput}`);
                  }}
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: "14px",
                    color: "#333",
                    background: "transparent",
                  }}
                />
                <button
                  onClick={() =>
                    searchInput.trim() && navigate(`/search/${searchInput}`)
                  }
                  style={{
                    background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "40px",
                    padding: "11px 22px",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Search
                </button>
              </div>

              {/* CTA buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "2.5rem",
                }}
              >
                <button
                  className="cta-explore"
                  onClick={() => navigate("/experiences")}
                  style={{
                    background:
                      "linear-gradient(90deg, #5ce1e6, #8ff0e0, #5ce1e6)",
                    color: "#0f4c75",
                    border: "none",
                    borderRadius: "30px",
                    padding: "13px 28px",
                    fontWeight: 800,
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 16px rgba(92,225,230,0.4)",
                  }}
                >
                  <i className="fa fa-street-view" />
                  Explore 360°
                </button>
                <button
                  onClick={() => navigate("/search/")}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    borderRadius: "30px",
                    padding: "13px 28px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backdropFilter: "blur(6px)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                  }
                >
                  <i className="fa fa-shopping-cart" />
                  Shop Local
                </button>
              </div>

              {/* Slide thumbnail cards */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                {heroSlides.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      width: "130px",
                      border:
                        i === currentSlide
                          ? "2px solid #5ce1e6"
                          : "1.5px solid rgba(255,255,255,0.2)",
                      transition: "all 0.2s",
                      transform:
                        i === currentSlide ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <div
                      style={{
                        height: "60px",
                        backgroundImage: `url(${item.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ padding: "6px 8px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#5ce1e6",
                          marginTop: "2px",
                        }}
                      >
                        <i
                          className="fa fa-street-view"
                          style={{ marginRight: "3px" }}
                        />
                        360° View
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 3,
              }}
            >
              {heroSlides.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "10px",
                    background:
                      currentSlide === index
                        ? "#5ce1e6"
                        : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>

            {/* Arrow controls */}
            {[
              {
                dir: "left",
                icon: "fa-chevron-left",
                action: () =>
                  setCurrentSlide(
                    (p) => (p - 1 + heroSlides.length) % heroSlides.length,
                  ),
              },
              {
                dir: "right",
                icon: "fa-chevron-right",
                action: () =>
                  setCurrentSlide((p) => (p + 1) % heroSlides.length),
              },
            ].map(({ dir, icon, action }) => (
              <button
                key={dir}
                onClick={action}
                style={{
                  position: "absolute",
                  top: "50%",
                  [dir]: "20px",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                <i className={`fa ${icon}`} />
              </button>
            ))}
          </div>
  );
}

export default memo(HomeHero);
