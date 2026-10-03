import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

export default function Experiences() {
  const location = useLocation();
  const FALLBACK = "/images/panos/sample-360.jpg";

  const [url, setUrl]               = useState(location.state?.url || FALLBACK);
  const [aframeReady, setAframeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeScene, setActiveScene]   = useState(0);

  const API = useMemo(
    () => axios.create({ baseURL: "http://localhost:5000/api" }),
    []
  );

  // Sample destinations — replace images with your real pano paths
  const destinations = [
    { title: "Sigiriya Rock Fortress", tag: "Heritage",     img: "/images/panos/sample-360.jpg", desc: "Ancient rock fortress, 5th century CE." },
    { title: "Nine Arch Bridge",       tag: "Hill Country", img: "/images/panos/sample-360.jpg", desc: "Iconic colonial-era railway bridge."      },
    { title: "Temple of the Tooth",    tag: "Culture",      img: "/images/panos/sample-360.jpg", desc: "Sacred Buddhist temple in Kandy."         },
    { title: "Unawatuna Beach",        tag: "Beach",        img: "/images/panos/sample-360.jpg", desc: "Golden sands on the southern coast."      },
    { title: "Yala National Park",     tag: "Wildlife",     img: "/images/panos/sample-360.jpg", desc: "Home to leopards and elephants."          },
    { title: "Galle Fort",             tag: "Heritage",     img: "/images/panos/sample-360.jpg", desc: "Dutch colonial fort by the ocean."        },
  ];

  const tagColors = {
    Heritage:       { bg: "#e8f0fb", color: "#1b6ca8" },
    "Hill Country": { bg: "#e0f5f0", color: "#0d5c4a" },
    Culture:        { bg: "#f3e8fb", color: "#6b21a8" },
    Beach:          { bg: "#fff8e0", color: "#b07800" },
    Wildlife:       { bg: "#fdecea", color: "#e74c3c" },
  };

  useEffect(() => {
    let mounted = true;
    import("aframe")
      .then(() => { if (mounted) setAframeReady(true); })
      .catch(() => { if (mounted) setAframeReady(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (location.state?.url) {
      setUrl(location.state.url);
      return;
    }
    API.get("/scenes")
      .then(({ data }) => {
        const first = data?.scenes?.items?.[0]?.url;
        if (first) setUrl(first);
      })
      .catch(() => setUrl(FALLBACK));
  }, [API, location.state]);

  const handleSelectScene = (dest, index) => {
    setUrl(dest.img);
    setActiveScene(index);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>

      {/* ── Page Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
        borderRadius: "16px", padding: "1.4rem 1.8rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "10px",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fa fa-street-view" style={{ color: "#5ce1e6", fontSize: "22px" }} />
          </div>
          <div>
            <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>360° Experiences</h4>
            <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
              Immersive virtual tours of Sri Lanka
            </p>
          </div>
        </div>
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff", textDecoration: "none",
          padding: "8px 16px", borderRadius: "20px",
          fontSize: "13px", fontWeight: 600,
        }}>
          <i className="fa fa-arrow-left" />
          Back to Home
        </Link>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Left: 360 Viewer ── */}
        <div style={{ flex: "1 1 600px", minWidth: 0 }}>

          {/* Now Viewing Label */}
          <div style={{
            background: "#fff", borderRadius: "12px 12px 0 0",
            border: "1px solid #eee", borderBottom: "none",
            padding: "12px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#0d7377",
                boxShadow: "0 0 0 3px rgba(13,115,119,0.2)",
                animation: "pulse 2s infinite",
              }} />
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a1a" }}>
                {destinations[activeScene]?.title || "360° View"}
              </span>
              <span style={{
                background: tagColors[destinations[activeScene]?.tag]?.bg || "#f0f0f0",
                color: tagColors[destinations[activeScene]?.tag]?.color || "#555",
                borderRadius: "20px", padding: "2px 10px",
                fontSize: "11px", fontWeight: 700,
              }}>
                {destinations[activeScene]?.tag}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                background: "#e8f0fb", color: "#1b6ca8",
                borderRadius: "6px", padding: "3px 10px",
                fontSize: "11px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                <i className="fa fa-street-view" />
                360° VR
              </span>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  border: "none", color: "#fff",
                  borderRadius: "6px", padding: "5px 12px",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
              >
                <i className={`fa fa-${isFullscreen ? "compress" : "expand"}`} />
                {isFullscreen ? "Exit" : "Fullscreen"}
              </button>
            </div>
          </div>

          {/* Viewer */}
          <div style={{
            borderRadius: "0 0 12px 12px",
            overflow: "hidden",
            border: "1px solid #eee",
            height: isFullscreen ? "80vh" : "460px",
            background: "#0f0f0f",
            position: "relative",
            transition: "height 0.3s ease",
          }}>
            {!aframeReady ? (
              <div style={{
                height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "16px",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  border: "4px solid rgba(27,108,168,0.2)",
                  borderTop: "4px solid #1b6ca8",
                  animation: "spin 0.9s linear infinite",
                }} />
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 600 }}>
                  Loading 360° viewer...
                </p>
                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
                `}</style>
              </div>
            ) : (
              <a-scene
                embedded
                vr-mode-ui="enabled: true"
                style={{ width: "100%", height: "100%" }}
              >
                <a-sky src={url} rotation="0 -90 0" />
                <a-entity camera look-controls position="0 1.6 0" />
              </a-scene>
            )}

            {/* Drag hint overlay */}
            {aframeReady && (
              <div style={{
                position: "absolute", bottom: "16px", left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
                color: "#fff", borderRadius: "20px",
                padding: "6px 16px", fontSize: "12px", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "6px",
                pointerEvents: "none",
              }}>
                <i className="fa fa-hand-o-up" style={{ color: "#5ce1e6" }} />
                Click and drag to look around
              </div>
            )}
          </div>

          {/* Scene info */}
          <div style={{
            background: "#fff", borderRadius: "12px",
            border: "1px solid #eee", padding: "1rem 1.2rem",
            marginTop: "12px",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <i className="fa fa-map-marker" style={{ color: "#1b6ca8", fontSize: "18px" }} />
            <div>
              <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>
                {destinations[activeScene]?.title}
              </div>
              <div style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>
                {destinations[activeScene]?.desc}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleSelectScene(destinations[(activeScene - 1 + destinations.length) % destinations.length], (activeScene - 1 + destinations.length) % destinations.length)}
                style={{
                  background: "#f0f7ff", border: "1px solid #d0e4f7",
                  color: "#1b6ca8", borderRadius: "8px",
                  padding: "6px 12px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
                  display: "flex", alignItems: "center", gap: "4px",
                }}
              >
                <i className="fa fa-chevron-left" /> Prev
              </button>
              <button
                onClick={() => handleSelectScene(destinations[(activeScene + 1) % destinations.length], (activeScene + 1) % destinations.length)}
                style={{
                  background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                  border: "none", color: "#fff", borderRadius: "8px",
                  padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontSize: "13px",
                  display: "flex", alignItems: "center", gap: "4px",
                }}
              >
                Next <i className="fa fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Scene Selector ── */}
        <div style={{ width: "300px", flexShrink: 0 }}>
          <div style={{
            background: "#fff", borderRadius: "14px",
            border: "1px solid #eee",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
            position: "sticky", top: "80px",
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              padding: "0.9rem 1.2rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <i className="fa fa-list" style={{ color: "#5ce1e6", fontSize: "14px" }} />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                All Destinations
              </span>
              <span style={{
                marginLeft: "auto", background: "rgba(255,255,255,0.15)",
                color: "#fff", borderRadius: "20px",
                padding: "2px 10px", fontSize: "11px", fontWeight: 700,
              }}>
                {destinations.length}
              </span>
            </div>

            {/* Scene list */}
            <div style={{ maxHeight: "520px", overflowY: "auto" }}>
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectScene(dest, index)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", cursor: "pointer",
                    borderBottom: "1px solid #f5f5f5",
                    background: activeScene === index
                      ? "linear-gradient(135deg, #e8f0fb, #e0f5f5)"
                      : "#fff",
                    borderLeft: activeScene === index
                      ? "3px solid #1b6ca8"
                      : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (activeScene !== index) e.currentTarget.style.background = "#f8f9fa"; }}
                  onMouseLeave={e => { if (activeScene !== index) e.currentTarget.style.background = "#fff"; }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: "56px", height: "48px", borderRadius: "8px",
                    backgroundImage: `url(${dest.img})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    flexShrink: 0, border: activeScene === index ? "2px solid #1b6ca8" : "2px solid transparent",
                    position: "relative", overflow: "hidden",
                  }}>
                    {activeScene === index && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(27,108,168,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <i className="fa fa-play-circle" style={{ color: "#fff", fontSize: "16px" }} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: activeScene === index ? 700 : 600,
                      fontSize: "13px", color: "#1a1a1a",
                      marginBottom: "3px",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {dest.title}
                    </div>
                    <span style={{
                      background: tagColors[dest.tag]?.bg || "#f0f0f0",
                      color: tagColors[dest.tag]?.color || "#555",
                      borderRadius: "20px", padding: "2px 8px",
                      fontSize: "10px", fontWeight: 700,
                    }}>
                      {dest.tag}
                    </span>
                  </div>

                  {activeScene === index && (
                    <i className="fa fa-street-view" style={{ color: "#1b6ca8", fontSize: "14px", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* VR tip */}
            <div style={{
              padding: "12px 14px",
              background: "#f8fbff",
              borderTop: "1px solid #eee",
              display: "flex", alignItems: "flex-start", gap: "8px",
            }}>
              <i className="fa fa-info-circle" style={{ color: "#1b6ca8", fontSize: "14px", marginTop: "1px", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "11px", color: "#888", lineHeight: 1.5 }}>
                Click and drag inside the viewer to look around. Use the VR button for an immersive headset experience.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}