import { Link } from 'react-router-dom';

export default function Product({ product, col }) {
  return (
    <div className={`col-md-3 col-sm-6 col-lg-${col} mb-4`} key={product._id}>
      <div className="card p-3">

        <img
          className="card-img-top mx-auto"
          src={product.images[0]?.image}
          alt={product.name}
        />

        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>

          <div className="ratings mt-2">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(product.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id="no_of_reviews">
              ({product.numOfReviews} Reviews)
            </span>
          </div>

          <p className="card-text mt-2">${product.price}</p>

          <Link
            to={`/product/${product._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}
