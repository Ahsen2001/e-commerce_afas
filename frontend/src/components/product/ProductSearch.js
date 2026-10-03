import { Fragment, useEffect, useState } from "react";
import MetaData from ".././layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from ".././product/Product";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const { products, loading, error, resPerPage, productsCount } = useSelector(
    (state) => state.products,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [priceChanged, setPriceChanged] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(null);

  const { keyword } = useParams();

  const Categories = [
    "Handicrafts & Souvenirs",
    "Batik & Clothing",
    "Tea, Spices & Herbal",
    "Ayurvedic Wellness",
    "Cultural Art & Masks",
    "Jewellery & Gems",
    "Wood & Handmade Items",
    "Traditional Food",
    "Eco-friendly Products",
    "Village Products",
    "Tour Packages",
    "Experiences & Activities",
  ];

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
      return;
    }
    dispatch(
      getProducts(keyword || "", priceChanged, category, rating, currentPage),
    );
  }, [error, dispatch, currentPage, keyword, priceChanged, category, rating]);

  const handleRender = (node, handleProps) => (
    <Tooltip
      overlay={`$${handleProps.value}`}
      placement="top"
      key={handleProps.index}
    >
        {node}
      </Tooltip>
    );

  const clearFilters = () => {
    setCategory(null);
    setRating(null);
    setPrice([1, 1000]);
    setPriceChanged([1, 1000]);
    setCurrentPage(1);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Search Products" />

          {/* Page Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              borderRadius: "12px",
              padding: "1.2rem 1.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "1.5rem 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <i
                className="fa fa-search"
                style={{ color: "#5ce1e6", fontSize: "20px" }}
              />
              <div>
                <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                  Search Results
                  {keyword && (
                    <span style={{ color: "#5ce1e6" }}> — "{keyword}"</span>
                  )}
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  {productsCount || 0} products found
                </p>
              </div>
            </div>
            {(category ||
              rating ||
              priceChanged[0] !== 1 ||
              priceChanged[1] !== 1000) && (
              <button
                onClick={clearFilters}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <i className="fa fa-times" style={{ marginRight: "6px" }} />
                Clear Filters
              </button>
            )}
          </div>

          <section id="products">
            <div className="container-fluid px-0">
              <div className="row">
                {/* ── Sidebar ── */}
                <div className="col-12 col-md-3 mb-4">
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "14px",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      overflow: "hidden",
                      position: "sticky",
                      top: "80px",
                    }}
                  >
                    {/* Sidebar Header */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #0f4c75, #0d7377)",
                        padding: "0.9rem 1.2rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <i
                        className="fa fa-filter"
                        style={{ color: "#5ce1e6", fontSize: "14px" }}
                      />
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        Filters
                      </span>
                    </div>

                    <div style={{ padding: "1.2rem" }}>
                      {/* Price Range */}
                      <div style={{ marginBottom: "1.2rem" }}>
                        <h6
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fa fa-tag"
                            style={{ color: "#1b6ca8" }}
                          />
                          Price Range
                        </h6>
                        <div style={{ padding: "0 6px" }}>
                    <Slider
                      range
                      marks={{ 1: "$1", 1000: "$1000" }}
                      min={1}
                      max={1000}
                      value={price}
                            onChange={(val) => setPrice(val)}
                      onAfterChange={(val) => {
                              setPriceChanged(val);
                        setCurrentPage(1);
                      }}
                      handleRender={handleRender}
                            trackStyle={[{ backgroundColor: "#1b6ca8" }]}
                            handleStyle={[
                              {
                                borderColor: "#1b6ca8",
                                backgroundColor: "#fff",
                              },
                              {
                                borderColor: "#1b6ca8",
                                backgroundColor: "#fff",
                              },
                            ]}
                            railStyle={{ backgroundColor: "#e0e0e0" }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "1.5rem",
                          }}
                        >
                          <span
                            style={{
                              background: "#f0f7ff",
                              color: "#1b6ca8",
                              borderRadius: "6px",
                              padding: "3px 10px",
                              fontSize: "13px",
                              fontWeight: 700,
                            }}
                          >
                            ${price[0]}
                          </span>
                          <span
                            style={{
                              background: "#f0f7ff",
                              color: "#1b6ca8",
                              borderRadius: "6px",
                              padding: "3px 10px",
                              fontSize: "13px",
                              fontWeight: 700,
                            }}
                          >
                            ${price[1]}
                          </span>
                        </div>
                      </div>

                      <hr
                        style={{ borderColor: "#f0f0f0", margin: "1rem 0" }}
                    />

                    {/* Categories */}
                      <div style={{ marginBottom: "1.2rem" }}>
                        <h6
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fa fa-th-large"
                            style={{ color: "#1b6ca8" }}
                          />
                          Categories
                        </h6>
                        {Categories.map((cat) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setCategory(cat);
                              setCurrentPage(1);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              marginBottom: "4px",
                              background:
                                category === cat
                                  ? "linear-gradient(135deg, #e8f0fb, #e0f5f5)"
                                  : "transparent",
                              border:
                                category === cat
                                  ? "1.5px solid #1b6ca8"
                                  : "1.5px solid transparent",
                              transition: "all 0.15s",
                            }}
                          >
                            <i
                              className="fa fa-chevron-right"
                              style={{
                                fontSize: "10px",
                                color: category === cat ? "#1b6ca8" : "#bbb",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: category === cat ? 700 : 400,
                                color: category === cat ? "#1b6ca8" : "#444",
                              }}
                          >
                            {cat}
                            </span>
                          </div>
                        ))}
                    </div>

                      <hr
                        style={{ borderColor: "#f0f0f0", margin: "1rem 0" }}
                      />

                    {/* Ratings */}
                      <div>
                        <h6
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#888",
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            marginBottom: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fa fa-star"
                            style={{ color: "#1b6ca8" }}
                          />
                          Min. Rating
                        </h6>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div
                            key={star}
                            onClick={() => {
                              setRating(star);
                              setCurrentPage(1);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "7px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              marginBottom: "4px",
                              background:
                                rating === star
                                  ? "linear-gradient(135deg, #e8f0fb, #e0f5f5)"
                                  : "transparent",
                              border:
                                rating === star
                                  ? "1.5px solid #1b6ca8"
                                  : "1.5px solid transparent",
                              transition: "all 0.15s",
                            }}
                          >
                            <div
                              className="rating-outer"
                              style={{ fontSize: "14px" }}
                            >
                              <div
                                className="rating-inner"
                                style={{ width: `${star * 20}%` }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#888",
                                fontWeight: rating === star ? 700 : 400,
                              }}
                            >
                              & up
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Products Grid ── */}
                <div className="col-12 col-md-9">
                  {products && products.length > 0 ? (
                  <div className="row">
                      {products.map((product) => (
                        <Product col={4} key={product._id} product={product} />
                      ))}
                  </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0f4c75, #0d7377)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1.2rem",
                        }}
                      >
                        <i
                          className="fa fa-search"
                          style={{ color: "#fff", fontSize: "30px" }}
                        />
              </div>
                      <h4 style={{ fontWeight: 700, color: "#333" }}>
                        No products found
                      </h4>
                      <p style={{ color: "#888" }}>
                        Try adjusting your filters or search term.
                      </p>
                      <button
                        onClick={clearFilters}
                        style={{
                          background:
                            "linear-gradient(135deg, #0f4c75, #0d7377)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "25px",
                          padding: "10px 24px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Clear Filters
                      </button>
            </div>
                  )}

                  {/* Pagination */}
          {productsCount > resPerPage && (
                    <div className="d-flex justify-content-center mt-4 mb-2">
                      <ReactPaginate
                activePage={currentPage}
                onChange={(page) => setCurrentPage(page)}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
                </div>
              </div>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
}
