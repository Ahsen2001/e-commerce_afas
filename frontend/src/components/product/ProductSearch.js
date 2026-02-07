import { Fragment, useEffect, useState } from "react";
import MetaData from ".././layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from ".././product/Product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const { products, loading, error, resPerPage, productsCount } =
    useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);

  // UI value (smooth drag)
  const [price, setPrice] = useState([1, 1000]);

  // Applied value (API call only when user stops dragging)
  const [priceChanged, setPriceChanged] = useState([1, 1000]);

  const [category, setCategory] = useState(null);
  const [rating, setRating] = useState(null);

  const { keyword } = useParams();

  const Categories = [
    "Mobile Phones",
    "Clothes/Shoes",
    "Headphones",
    "Books",
    "Accessories",
    "Laptops",
  ];

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-center" });
      return;
    }

    // ✅ Use priceChanged, not price
    dispatch(getProducts(keyword || "", priceChanged, category, rating, currentPage));
  }, [error, dispatch, currentPage, keyword, priceChanged, category, rating]);

  // ✅ Correct handleRender pattern for rc-slider
  const handleRender = (node, handleProps) => {
    return (
      <Tooltip overlay={`$${handleProps.value}`} placement="top" key={handleProps.index}>
        {node}
      </Tooltip>
    );
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Buy Traditional Products" />
          <h1 id="products_heading">Search Products</h1>

          <section id="products" className="mt-5">
            <div className="container">
              <div className="row mt-4">
                <div className="col-6 col-md-3 mb-5 mt-5">
                  <div className="px-5">
                    {/* ✅ Slider */}
                    <Slider
                      range
                      marks={{ 1: "$1", 1000: "$1000" }}
                      min={1}
                      max={1000}
                      value={price}
                      onChange={(val) => setPrice(val)} // smooth UI drag
                      onAfterChange={(val) => {
                        setPriceChanged(val); // ✅ triggers API once after drag ends
                        setCurrentPage(1);
                      }}
                      handleRender={handleRender}
                    />

                    {/* Categories */}
                    <hr className="my-5" />
                    <div className="mt-5">
                      <h3 className="mb-3">Categories</h3>
                      <ul className="pl-0">
                        {Categories.map((cat) => (
                          <li
                            style={{ cursor: "pointer", listStyleType: "none" }}
                            key={cat}
                            onClick={() => {
                              setCategory(cat);
                              setCurrentPage(1);
                            }}
                          >
                            {cat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ratings */}
                    <hr className="my-5" />
                    <div className="mt-5">
                      <h4 className="mb-3">Ratings</h4>
                      <ul className="pl-0">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <li
                            style={{ cursor: "pointer", listStyleType: "none" }}
                            key={star}
                            onClick={() => {
                              setRating(star);
                              setCurrentPage(1);
                            }}
                          >
                            <div className="rating-outer">
                              <div
                                className="rating-inner"
                                style={{ width: `${star * 20}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-6 col-md-9">
                  <div className="row">
                    {products &&
                      products.map((product) => (
                        <Product col={4} key={product._id} product={product} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {productsCount > resPerPage && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={(page) => setCurrentPage(page)}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
