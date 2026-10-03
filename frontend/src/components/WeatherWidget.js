import { useState, useEffect, useRef } from "react";

// Sri Lanka's 25 districts with representative coordinates (district capital/main town)
const DISTRICTS = [
  { name: "Colombo", lat: 6.9271, lon: 79.8612 },
  { name: "Gampaha", lat: 7.0873, lon: 79.999 },
  { name: "Kalutara", lat: 6.5854, lon: 79.9607 },
  { name: "Kandy", lat: 7.2906, lon: 80.6337 },
  { name: "Matale", lat: 7.4675, lon: 80.6234 },
  { name: "Nuwara Eliya", lat: 6.9497, lon: 80.7891 },
  { name: "Galle", lat: 6.0535, lon: 80.221 },
  { name: "Matara", lat: 5.9549, lon: 80.555 },
  { name: "Hambantota", lat: 6.1241, lon: 81.1185 },
  { name: "Jaffna", lat: 9.6615, lon: 80.0255 },
  { name: "Kilinochchi", lat: 9.3961, lon: 80.3982 },
  { name: "Mannar", lat: 8.981, lon: 79.9044 },
  { name: "Vavuniya", lat: 8.7514, lon: 80.4971 },
  { name: "Mullaitivu", lat: 9.267, lon: 80.8142 },
  { name: "Batticaloa", lat: 7.717, lon: 81.7 },
  { name: "Ampara", lat: 7.2975, lon: 81.6747 },
  { name: "Trincomalee", lat: 8.5874, lon: 81.2152 },
  { name: "Kurunegala", lat: 7.4863, lon: 80.3647 },
  { name: "Puttalam", lat: 8.0362, lon: 79.8283 },
  { name: "Anuradhapura", lat: 8.3114, lon: 80.4037 },
  { name: "Polonnaruwa", lat: 7.9403, lon: 81.0188 },
  { name: "Badulla", lat: 6.9934, lon: 81.055 },
  { name: "Monaragala", lat: 6.8724, lon: 81.351 },
  { name: "Ratnapura", lat: 6.6828, lon: 80.3992 },
  { name: "Kegalle", lat: 7.2513, lon: 80.3464 },
];

// Set REACT_APP_OPENWEATHER_KEY in your frontend .env
const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

// Animates a number counting up/down to `target` whenever it changes.
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target ?? 0);
  const rafRef = useRef(null);
  const fromRef = useRef(target ?? 0);

  useEffect(() => {
    if (target === null || target === undefined || isNaN(target)) return;

    const from = fromRef.current;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export default function WeatherWidget() {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS[0].name);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const animatedTemp = useCountUp(weather?.main?.temp);

  useEffect(() => {
    // Trigger card entrance animation on mount
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const district = DISTRICTS.find((d) => d.name === selectedDistrict);
    if (!district) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${district.lat}&lon=${district.lon}&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Invalid API key"
              : `Failed to fetch weather (${res.status})`
          );
        }
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedDistrict]);

  const statPills = weather
    ? [
        {
          icon: "fa-thermometer-half",
          label: "Feels Like",
          value: `${Math.round(weather.main?.feels_like)}°C`,
        },
        {
          icon: "fa-tint",
          label: "Humidity",
          value: `${weather.main?.humidity}%`,
        },
        {
          icon: "fa-wind",
          label: "Wind",
          value: `${weather.wind?.speed} m/s`,
        },
        {
          icon: "fa-eye",
          label: "Visibility",
          value: weather.visibility
            ? `${(weather.visibility / 1000).toFixed(1)} km`
            : "N/A",
        },
        {
          icon: "fa-arrow-up",
          label: "Pressure",
          value: weather.main?.pressure ? `${weather.main.pressure} hPa` : "N/A",
        },
      ]
    : [];

  return (
    <div style={{ marginBottom: "3.5rem" }}>
      {/* Scoped keyframe animations */}
      <style>{`
        @keyframes weatherCardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes weatherContentFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pillPop {
          from { opacity: 0; transform: scale(0.9) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cloudDrift {
          from { transform: translateX(0); }
          to   { transform: translateX(14px); }
        }
        .weather-select:hover {
          border-color: #1b6ca8 !important;
        }
      `}</style>

      {/* Section header — matches Vehicle Rentals / other sections */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.2rem",
          flexWrap: "wrap",
          gap: "10px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "22px",
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            <i
              className="fa fa-cloud"
              style={{ color: "#1b6ca8", marginRight: "10px" }}
            />
            Live Weather
          </h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 0" }}>
            Check current conditions before you travel
          </p>
        </div>

        {/* District selector */}
        <div
          className="weather-select"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#fff",
            border: "1.5px solid #e0e0e0",
            borderRadius: "30px",
            padding: "6px 8px 6px 16px",
            transition: "border-color 0.2s",
          }}
        >
          <i className="fa fa-map-marker" style={{ color: "#1b6ca8", fontSize: "13px" }} />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              fontWeight: 700,
              color: "#1a1a1a",
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: "20px",
            }}
          >
            {DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weather card */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          minHeight: "220px",
          background: loading || error
            ? "#f8f9fa"
            : "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 55%, #0d7377 100%)",
          boxShadow: loading || error
            ? "0 2px 12px rgba(0,0,0,0.06)"
            : "0 12px 32px rgba(15,76,117,0.25)",
          border: loading || error ? "1px solid #eee" : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          animation: visible ? "weatherCardIn 0.6s ease 0.1s both" : "none",
          transition: "background 0.4s, box-shadow 0.4s",
        }}
      >
        {/* Decorative drifting cloud accents on the gradient card */}
        {!loading && !error && weather && (
          <>
            <i
              className="fa fa-cloud"
              style={{
                position: "absolute",
                top: "-20px",
                right: "-10px",
                fontSize: "160px",
                color: "rgba(255,255,255,0.06)",
                animation: "cloudDrift 6s ease-in-out infinite alternate",
              }}
            />
            <i
              className="fa fa-cloud"
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "10%",
                fontSize: "110px",
                color: "rgba(255,255,255,0.05)",
                animation: "cloudDrift 8s ease-in-out infinite alternate-reverse",
              }}
            />
          </>
        )}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              color: "#888",
              animation: "weatherContentFade 0.35s ease both",
            }}
          >
            <i className="fa fa-spinner fa-spin" style={{ fontSize: "26px", color: "#1b6ca8" }} />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>
              Fetching weather for {selectedDistrict}...
            </span>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "1.5rem",
              textAlign: "center",
              animation: "weatherContentFade 0.35s ease both",
            }}
          >
            <i
              className="fa fa-exclamation-circle"
              style={{ fontSize: "28px", color: "#e74c3c" }}
            />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#e74c3c" }}>
              {error}
            </span>
            <span style={{ fontSize: "12px", color: "#aaa" }}>
              Please check your weather API configuration
            </span>
          </div>
        )}

        {/* Weather content — key forces a fresh fade-in whenever district changes */}
        {weather && !loading && !error && (
          <div
            key={selectedDistrict}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "1.8rem 2rem",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "28px",
              animation: "weatherContentFade 0.45s ease both",
            }}
          >
            {/* District + temp + icon */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || "Weather icon"}
                  style={{
                    width: "70px",
                    height: "70px",
                    animation: "iconFloat 3s ease-in-out infinite",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    marginBottom: "8px",
                  }}
                >
                  <i
                    className="fa fa-map-marker"
                    style={{ color: "#5ce1e6", fontSize: "11px" }}
                  />
                  <span
                    style={{
                      color: "#5ce1e6",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {selectedDistrict.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "44px",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    textShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Math.round(animatedTemp)}°C
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "capitalize",
                    marginTop: "4px",
                    fontWeight: 600,
                  }}
                >
                  {weather.weather?.[0]?.description}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "1px",
                alignSelf: "stretch",
                background: "rgba(255,255,255,0.2)",
                minHeight: "70px",
              }}
            />

            {/* Glass stat pills — staggered pop-in */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                flex: 1,
                minWidth: "260px",
              }}
            >
              {statPills.map(({ icon, label, value }, i) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    minWidth: "100px",
                    animation: `pillPop 0.4s ease ${0.15 + i * 0.06}s both`,
                    transition: "transform 0.2s, background 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.65)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "4px",
                    }}
                  >
                    <i className={`fa ${icon}`} />
                    {label}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}