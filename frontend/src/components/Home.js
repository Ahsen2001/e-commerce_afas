import { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error, resPerPage, productsCount } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage)
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  }

 useEffect(() => {
  if (error) {
    toast.error(error, { position: "bottom-center" });
    return;
  }

  dispatch(getProducts("", [], null, null, currentPage));
}, [dispatch, error, currentPage]);


  return (
    <Fragment>
  {loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title={"Buy Traditional Products"} />
      <h1 id="products_heading">Latest Products</h1>

      <section id="products" className="mt-5">
        <div className="container">
          <div className="row mt-4">
            {products && products.map(product => (
              <Product col={3} key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {productsCount > 0 && productsCount > resPerPage && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={currentPage}
            onChange={setCurrentPageNo}
            totalItemsCount={productsCount} // 5
            itemsCountPerPage={resPerPage}   // 3
            nextPageText={'Next'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass={'page-item'}
            linkClass={'page-link'}
          />

        </div>
      )}
    </Fragment>
  )}
</Fragment>
    
  );
}
