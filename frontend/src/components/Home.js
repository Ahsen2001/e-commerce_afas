import { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-js-pagination";
import { Link, useNavigate } from "react-router-dom";
import { getVehicles } from "../actions/vehicleActions";
import WeatherWidget from "./WeatherWidget";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products = [],
    loading,
    error,
    resPerPage = 8,
    productsCount = 0,
  } = useSelector((state) => state.products);
  const { vehicles = [], loading: vehicleLoading } = useSelector(
    (state) => state.vehicle,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const heroSlides = [
    {
      title: "Sigiriya Rock Fortress",
      subtitle: "Ancient Wonder of Sri Lanka",
      tag: "Heritage",
      img: "/images/panos/sigiriya.jpg",
    },
    {
      title: "Nine Arch Bridge",
      subtitle: "Beautiful Hill Country View",
      tag: "Hill Country",
      img: "/images/panos/nine-arch.jpg",
    },
    {
      title: "Unawatuna Beach",
      subtitle: "Golden Coastal Paradise",
      tag: "Beach",
      img: "/images/panos/beach.jpg",
    },
  ];

  const experiences = [
    {
      title: "Sigiriya Rock Fortress",
      tag: "Heritage",
      img: "/images/panos/sample-360.jpg",
      desc: "Ancient rock fortress with panoramic views.",
    },
    {
      title: "Nine Arch Bridge",
      tag: "Hill Country",
      img: "/images/panos/sample-360.jpg",
      desc: "Iconic railway bridge surrounded by tea hills.",
    },
    {
      title: "Temple of the Tooth",
      tag: "Culture",
      img: "/images/panos/sample-360.jpg",
      desc: "Buddhism's most sacred relic temple.",
    },
    {
      title: "Unawatuna Beach",
      tag: "Beach",
      img: "/images/panos/sample-360.jpg",
      desc: "Golden sands on Sri Lanka's southern coast.",
    },
  ];

  const tagColors = {
    Heritage: { bg: "#e8f0fb", color: "#1b6ca8" },
    "Hill Country": { bg: "#e0f5f0", color: "#0d5c4a" },
    Culture: { bg: "#f3e8fb", color: "#6b21a8" },
    Beach: { bg: "#fff8e0", color: "#b07800" },
    Wildlife: { bg: "#fdecea", color: "#e74c3c" },
  };

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

 useEffect(() => {
  if (error) {
    toast.error(error, { position: "bottom-center" });
    return;
  }
  dispatch(getProducts("", [], null, null, currentPage));
}, [dispatch, error, currentPage]);
  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  return (
    <Fragment>
  {loading ? (
    <Loader />
  ) : (
    <Fragment>
          <MetaData title="TravelVista.LK — Smart Tourism Sri Lanka" />

          {/* Global keyframe animations used throughout the page */}
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(18px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes badgeDotPulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(92,225,230,0.6); }
              50%      { box-shadow: 0 0 0 6px rgba(92,225,230,0); }
            }
            @keyframes ctaShimmer {
              0%   { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .stat-card {
              animation: fadeInUp 0.5s ease both;
              transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
            }
            .stat-card:hover {
              transform: translateY(-5px);
            }
            .exp-card, .why-card {
              animation: fadeInUp 0.5s ease both;
            }
            .why-card {
              transition: transform 0.25s ease, box-shadow 0.25s ease;
            }
            .why-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 10px 24px rgba(0,0,0,0.08) !important;
            }
            .why-card:hover .why-icon-tile {
              transform: scale(1.1) rotate(-4deg);
            }
            .cta-explore {
              background-size: 200% 200%;
              animation: ctaShimmer 3s linear infinite;
            }
          `}</style>

          {/* ══════════════════════════════════════
              HERO — Full viewport image slider
          ══════════════════════════════════════ */}
          <div
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

          {/* ══════════════════════════════════════
              STATS ROW
          ══════════════════════════════════════ */}
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "3rem",
              }}
            >
              {[
                {
                  icon: "fa-map-marker",
                  value: "150+",
                  label: "Destinations",
                  color: "#1b6ca8",
                },
                {
                  icon: "fa-users",
                  value: "50K+",
                  label: "Happy Visitors",
                  color: "#0d7377",
                },
                {
                  icon: "fa-star",
                  value: "4.9★",
                  label: "Avg Rating",
                  color: "#b07800",
                },
                {
                  icon: "fa-street-view",
                  value: "360°",
                  label: "VR Tours",
                  color: "#8e44ad",
                },
              ].map(({ icon, value, label, color }, i) => (
                <div
                  key={label}
                  className="stat-card"
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid #eee",
                    borderTop: `3px solid ${color}`,
                    padding: "1.2rem",
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    animationDelay: `${i * 0.08}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 10px 24px ${color}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                  }}
                >
                  <i
                    className={`fa ${icon}`}
                    style={{
                      fontSize: "22px",
                      color,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#1a1a1a",
                    }}
                  >
                    {value}
        </div>
                  <div
                    style={{ fontSize: "12px", color: "#888", fontWeight: 600 }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════
                360° EXPERIENCES
            ══════════════════════════════════════ */}
            <div style={{ marginBottom: "3.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: "1.2rem",
                }}
              >
                <div>
                  <div className="divider-with-text">
                    <span>Explore 360°</span>
                  </div>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      margin: "4px 0 0",
                    }}
                  >
                    Virtually explore before you visit
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "18px",
                }}
              >
                {experiences.map((d, i) => (
                  <Link
                    key={i}
                    to="/experiences"
                    state={{ url: d.img }}
                    style={{ textDecoration: "none" }}
                  >
                    <article
                      className="exp-card"
                      style={{
                        background: "#fff",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        animationDelay: `${i * 0.08}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 28px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.06)";
                      }}
                    >
                      <div
                        style={{
                          height: "175px",
                          backgroundImage: `url(${d.img})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(0,0,0,0.55)",
                            color: "#fff",
                            borderRadius: "20px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <i
                            className="fa fa-street-view"
                            style={{ color: "#5ce1e6" }}
                          />
                          360°
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: tagColors[d.tag]?.bg || "#f0f0f0",
                            color: tagColors[d.tag]?.color || "#555",
                            borderRadius: "20px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {d.tag}
                        </div>
                      </div>
                      <div style={{ padding: "14px" }}>
                        <h3
                          style={{
                            margin: "0 0 4px",
                            fontWeight: 700,
                            fontSize: "15px",
                            color: "#1a1a1a",
                          }}
                        >
                          {d.title}
                        </h3>
                        <p
                          style={{
                            margin: "0 0 10px",
                            color: "#888",
                            fontSize: "13px",
                            lineHeight: 1.5,
                          }}
                        >
                          {d.desc}
                        </p>
                        <div
                          style={{
                            color: "#1b6ca8",
                            fontSize: "13px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <i className="fa fa-play-circle" />
                          View in 360°
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
                <WeatherWidget />
            {/* ══════════════════════════════════════
                SHOP LOCAL PRODUCTS
            ══════════════════════════════════════ */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: "1.2rem",
                }}
              >
                <div>
                  <div className="divider-with-text">
                    <span>Shop Local Products</span>
                  </div>
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      margin: "4px 0 0",
                    }}
                  >
                    Authentic Sri Lankan products delivered to your door
                  </p>
                </div>
              </div>

              <div className="row">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Product col={3} key={product._id} product={product} />
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      width: "100%",
                    }}
                  >
                    <i
                      className="fa fa-shopping-cart"
                      style={{
                        fontSize: "48px",
                        color: "#ddd",
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    />
                    <p style={{ color: "#888" }}>No products found</p>
                  </div>
                )}
              </div>

              {productsCount > resPerPage && (
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
            activePage={currentPage}
                    onChange={(pageNo) => setCurrentPage(pageNo)}
                    totalItemsCount={productsCount}
                    itemsCountPerPage={resPerPage}
                    nextPageText="Next"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
            </div>
          {/* ══════════════════════════════════════
    VEHICLE RENTALS SECTION
══════════════════════════════════════ */}
<div style={{ marginBottom: "3.5rem" }}>

  {/* Section Header */}
  <div style={{
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "1.2rem",
    flexWrap: "wrap",
    gap: "10px",
  }}>
    <div>
      <h2 style={{ fontWeight: 800, fontSize: "22px", color: "#1a1a1a", margin: 0 }}>
        <i className="fa fa-car" style={{ color: "#1b6ca8", marginRight: "10px" }} />
        Vehicle Rentals
      </h2>
      <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>
        Explore Sri Lanka at your own pace
      </p>
    </div>
    <Link
      to="/vehicles"
      style={{
        color: "#1b6ca8", fontWeight: 700, fontSize: "14px",
        textDecoration: "none",
        display: "flex", alignItems: "center", gap: "4px",
      }}
    >
      Show all <i className="fa fa-arrow-right" style={{ fontSize: "12px" }} />
    </Link>
  </div>

  {/* Grid */}
  {vehicleLoading ? (
    <Loader />
  ) : vehicles.length === 0 ? (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <i className="fa fa-car" style={{ fontSize: "48px", color: "#ddd", display: "block", marginBottom: "1rem" }} />
      <p style={{ color: "#888", fontSize: "13px" }}>No vehicles available right now</p>
    </div>
  ) : (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "18px",
    }}>
      {vehicles.slice(0, 4).map((v, i) => (
        <div
          key={v._id}
          className="exp-card"
          style={{
            background: "#fff",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s, box-shadow 0.2s",
            animationDelay: `${i * 0.08}s`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          }}
        >
          {/* Image */}
          <div style={{
            position: "relative",
            height: "170px",
            background: "#f0f4f8",
            overflow: "hidden",
          }}>
            {v.images?.length > 0 ? (
              <img
                src={v.images[0].image}
                alt={v.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
            ) : (
              <div style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <i
                  className={`fa fa-${
                    v.type === "Bike" ? "motorcycle"
                    : v.type === "Van" || v.type === "Bus" ? "bus"
                    : v.type === "SUV" ? "truck"
                    : v.type === "Tuk-Tuk" ? "taxi"
                    : "car"
                  }`}
                  style={{ fontSize: "52px", color: "#1b6ca8", opacity: 0.2 }}
                />
              </div>
            )}

            {/* Type badge */}
            <span style={{
              position: "absolute", top: "10px", left: "10px",
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              color: "#fff", borderRadius: "20px",
              padding: "3px 10px", fontSize: "11px", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              <i className={`fa fa-${
                v.type === "Bike" ? "motorcycle"
                : v.type === "Van" || v.type === "Bus" ? "bus"
                : v.type === "SUV" ? "truck"
                : v.type === "Tuk-Tuk" ? "taxi"
                : "car"
              }`} style={{ fontSize: "10px" }} />
              {v.type}
            </span>

            {/* Available badge */}
            <span style={{
              position: "absolute", top: "10px", right: "10px",
              background: v.available ? "rgba(13,115,119,0.9)" : "rgba(231,76,60,0.9)",
              color: "#fff", borderRadius: "20px",
              padding: "3px 10px", fontSize: "11px", fontWeight: 700,
            }}>
              {v.available ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Body */}
          <div style={{
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "8px",
          }}>

            {/* Name */}
            <h6 style={{
              margin: 0, fontWeight: 700,
              fontSize: "15px", color: "#1a1a1a",
            }}>
              {v.name}
            </h6>

            {/* Spec pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { icon: "fa-users", val: `${v.seats} Seats`  },
                { icon: "fa-cog",   val: v.transmission       },
                { icon: "fa-tint",  val: v.fuelType           },
              ].map(({ icon, val }) => (
                <span key={val} style={{
                  background: "#f0f7ff", color: "#1b6ca8",
                  borderRadius: "6px", padding: "3px 8px",
                  fontSize: "11px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "3px",
                }}>
                  <i className={`fa ${icon}`} style={{ fontSize: "10px" }} />
                  {val}
                </span>
              ))}
            </div>

            {/* Location */}
            <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
              <i className="fa fa-map-marker" style={{ marginRight: "4px", color: "#1b6ca8" }} />
              {v.location}
            </p>

            {/* Price + Button */}
            <div style={{
              marginTop: "auto",
              paddingTop: "10px",
              borderTop: "1px solid #f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <span style={{
                  fontSize: "17px", fontWeight: 800,
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  LKR {v.pricePerDay?.toLocaleString()}
                </span>
                <span style={{
                  fontSize: "11px", color: "#aaa",
                  marginLeft: "3px",
                  WebkitTextFillColor: "#aaa",
                }}>
                  /day
                </span>
              </div>

              <Link
                to={`/vehicle/${v._id}`}
                style={{
                  background: v.available
                    ? "linear-gradient(135deg, #0f4c75, #1b6ca8, #0d7377)"
                    : "#ccc",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  pointerEvents: v.available ? "auto" : "none",
                }}
              >
                <i className="fa fa-calendar" />
                {v.available ? "Book Now" : "Unavailable"}
              </Link>
            </div>
          </div>
        </div>
      ))}
        </div>
      )}
</div>
            {/* ══════════════════════════════════════
                WHY TRAVELVISTA
            ══════════════════════════════════════ */}
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "20px",
                padding: "2.5rem 2rem",
                marginBottom: "3rem",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  color: "#1a1a1a",
                  textAlign: "center",
                  marginBottom: "4px",
                }}
              >
                Why TravelVista.LK?
              </h2>
              <p
                style={{
                  color: "#888",
                  textAlign: "center",
                  fontSize: "13px",
                  marginBottom: "2rem",
                }}
              >
                The smarter way to explore and shop Sri Lanka
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {[
                  {
                    icon: "fa-street-view",
                    title: "360° Virtual Tours",
                    desc: "Explore destinations before you visit",
                    color: "#e8f0fb",
                    iconColor: "#1b6ca8",
                  },
                  {
                    icon: "fa-lock",
                    title: "Secure Payments",
                    desc: "SSL encrypted, PCI-DSS compliant",
                    color: "#e0f5f0",
                    iconColor: "#0d7377",
                  },
                  {
                    icon: "fa-truck",
                    title: "Island-wide Delivery",
                    desc: "Fast shipping across Sri Lanka",
                    color: "#fff8e0",
                    iconColor: "#b07800",
                  },
                  {
                    icon: "fa-headphones",
                    title: "24/7 Support",
                    desc: "Always here when you need us",
                    color: "#f3e8fb",
                    iconColor: "#8e44ad",
                  },
                ].map(({ icon, title, desc, color, iconColor }, i) => (
                  <div
                    key={title}
                    className="why-card"
                    style={{
                      background: "#fff",
                      borderRadius: "14px",
                      padding: "1.4rem",
                      border: "1px solid #eee",
                      borderBottom: `3px solid ${iconColor}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div
                      className="why-icon-tile"
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "12px",
                        background: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "12px",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <i
                        className={`fa ${icon}`}
                        style={{ fontSize: "20px", color: iconColor }}
                      />
                    </div>
                    <h5
                      style={{
                        fontWeight: 700,
                        color: "#1a1a1a",
                        margin: "0 0 5px",
                        fontSize: "14px",
                      }}
                    >
                      {title}
                    </h5>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "12px",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
    </Fragment>
  )}
</Fragment>
  );
}