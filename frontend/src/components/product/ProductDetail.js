import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import { Carousel } from "react-bootstrap";
import MetaData from "../layouts/MetaData";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { product, loading } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (!product) return <h3>Product not found</h3>;

  return (
    <Fragment>
        <MetaData title={product.name} />
      <div className="row f-flex justify-content-around">
        
        {/* Image Carousel */}
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          {product.images?.length > 0 && (
            <Carousel pause="hover">
              {product.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={image.image}
                    height="500"
                    alt={product.name}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>

        {/* Product Details */}
        <div className="col-12 col-lg-5 mt-5">
          <h3>{product.name}</h3>
          <p id="product_id">Product # {product._id}</p>

          <hr />

          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(product.ratings / 5) * 100}%` }}
            />
          </div>
          <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

          <hr />

          <p id="product_price">${product.price}</p>

          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus">-</span>
            <input
              type="number"
              className="form-control count d-inline"
              value="1"
              readOnly
            />
            <span className="btn btn-primary plus">+</span>
          </div>

          <button id="cart_btn" className="btn btn-primary d-inline ml-4">
            Add To Cart
          </button>

          <hr />

          <p>
            Status:
            <span
              className={product.stock > 0 ? "greenColor" : "redColor"}
              id="stock_status"
            >
              {product.stock > 0 ? " In Stock" : " Out of Stock"}
            </span>
          </p>

          <hr />

          <h4>Description:</h4>
          <p>{product.description}</p>

          <hr />

          <p id="product_seller">
            Sold by: <strong>{product.seller}</strong>
          </p>

          <button
            className="btn btn-warning mt-3"
            onClick={() => alert("Submit Review button clicked")}
          >
            Submit Your Review
          </button>
        </div>
      </div>
    </Fragment>
  );
}
