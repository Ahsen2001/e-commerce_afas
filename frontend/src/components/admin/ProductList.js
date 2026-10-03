import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from "../../actions/productActions";
import { clearError, clearProductDeleted } from "../../slices/productsSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ProductList() {
  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.products || {});

  const { isProductDeleted, error: productError } = useSelector(
    (state) => state.products || {},
  );

  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarWidth = sidebarOpen ? "250px" : "72px";

  const deleteHandler = (e, id) => {
    e.currentTarget.disabled = true;
    dispatch(deleteProduct(id));
  };

  const setProducts = () => {
    const data = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Price", field: "price", sort: "asc" },
        { label: "Stock", field: "stock", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `LKR ${product.price?.toLocaleString()}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1b6ca8, #0d7377)",
                color: "#fff",
                textDecoration: "none",
                marginRight: "6px",
              }}
            >
              <i className="fa fa-pencil" style={{ fontSize: "13px" }} />
            </Link>

            <button
              onClick={(e) => deleteHandler(e, product._id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "#fdecea",
                border: "1px solid #fcd0ce",
                color: "#e74c3c",
                cursor: "pointer",
              }}
            >
              <i className="fa fa-trash" style={{ fontSize: "13px" }} />
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  useEffect(() => {
    if (isProductDeleted) {
      toast.success("Product deleted successfully", {
        position: "bottom-center",
        autoClose: 3000,
      });

      dispatch(clearProductDeleted());
    }

    if (error || productError) {
      toast.error(error || productError);
      dispatch(clearError());
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, productError, isProductDeleted]);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      {/* Fixed Sidebar */}
      <Sidebar collapsed={!sidebarOpen} />

      {/* Main */}
      <div
        style={{
          marginLeft: sidebarWidth,
          background: "#f4f6fb",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #eee",
            padding: "0 1.5rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              fontSize: "16px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4f8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <i className={`fa fa-${sidebarOpen ? "indent" : "dedent"}`} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            <i className="fa fa-home" style={{ color: "#1b6ca8" }} />
            <span>/</span>
            <span style={{ color: "#555" }}>Products</span>
            <span>/</span>
            <span style={{ color: "#1b6ca8", fontWeight: 600 }}>
              All Products
            </span>
          </div>

          <Link
            to="/admin/products/create"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #0f4c75, #0d7377)",
              color: "#fff",
              textDecoration: "none",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            <i className="fa fa-plus" />
            Add Product
          </Link>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem 1.8rem", flex: 1 }}>
          {/* Page Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
              borderRadius: "14px",
              padding: "1.2rem 1.8rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 16px rgba(15,76,117,0.2)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fa fa-shopping-cart"
                style={{ color: "#5ce1e6", fontSize: "20px" }}
              />
            </div>

            <div>
              <h4 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                Product List
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                total
              </p>
            </div>
          </div>

          {/* Table Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #eee",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setProducts()}
                bordered
                striped
                hover
                className="px-3"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
