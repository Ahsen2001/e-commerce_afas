import Header from "./components/layouts/Header";
import Home from "./components/Home";
import "./App.css";
import Footer from "./components/layouts/Footer";
import {
Route,
BrowserRouter as Router,
Routes,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { lazy, Suspense, useEffect, useState } from "react";
import store from "./store";
import { loadUser } from "./actions/authActions";

import ProtectedRoute from "./components/route/ProtectedRoute";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import axios from "axios";

 
const ProductDetail = lazy(() => import("./components/product/ProductDetail"));
const ProductSearch = lazy(() => import("./components/product/ProductSearch"));
const Login = lazy(() => import("./components/user/Login"));
const Register = lazy(() => import("./components/user/Register"));
const Experiences = lazy(() => import("./components/experience/Experiences"));
const Profile = lazy(() => import("./components/user/Profile"));
const UpdateProfile = lazy(() => import("./components/user/UpdateProfile"));
const UpdatePassword = lazy(() => import("./components/user/UpdatePassword"));
const ForgotPassword = lazy(() => import("./components/user/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/user/ResetPassword"));
const Cart = lazy(() => import("./components/cart/Cart"));
const Shipping = lazy(() => import("./components/cart/Shipping"));
const ConfirmOrder = lazy(() => import("./components/cart/confirmOrder"));
const Payment = lazy(() => import("./components/cart/Payment"));
const OrderSuccess = lazy(() => import("./components/cart/OrderSuccess"));
const UserOrders = lazy(() => import("./components/cart/UserOrders"));
const OrderDetail = lazy(() => import("./components/order/orderDetail"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const ProductList = lazy(() => import("./components/admin/ProductList"));
const NewProduct = lazy(() => import("./components/admin/NewProduct"));
const UpdateProduct = lazy(() => import("./components/admin/UpdateProduct"));
const OrderList = lazy(() => import("./components/admin/OrderList"));
const UpdateOrder = lazy(() => import("./components/admin/UpdateOrder"));
const UserList = lazy(() => import("./components/admin/UserList"));
const UpdateUser = lazy(() => import("./components/admin/UpdateUser"));
const ReviewList = lazy(() => import("./components/admin/ReviewList"));
const ItineraryList = lazy(() => import("./components/itinerary/ItineraryList"));
const ItineraryDetail = lazy(() => import("./components/itinerary/ItineraryDetail"));
const VehicleList = lazy(() => import("./components/vehicles/VehicleList"));
const VehicleBooking = lazy(() => import("./components/vehicles/VehicleBooking"));
const MyVehicleBookings = lazy(() => import("./components/vehicles/MyVehicleBookings"));
const VehicleAdminDashboard = lazy(() => import("./components/vehicles/VehicleAdminDashboard"));
const VehicleAdminList = lazy(() => import("./components/vehicles/admin/VehicleAdminList"));
const VehicleAdminNew = lazy(() => import("./components/vehicles/admin/VehicleAdminNew"));
const VehicleAdminEdit = lazy(() => import("./components/vehicles/admin/VehicleAdminEdit"));
const VehicleBookingList = lazy(() => import("./components/vehicles/admin/VehicleBookingList"));

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    if (location.pathname !== "/payment" || stripePromise) return;

    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapi");
        setStripePromise(loadStripe(data.stripeApiKey));
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    }

    getStripeApiKey();
  }, [location.pathname, stripePromise]);

  return (
          <div className="App">
        <HelmetProvider>
          <ToastContainer theme="dark" />

        {/*  Hide Header and Footer on admin routes */}
        {!isAdminRoute && <Header />}

        {/*  No container wrapper for admin — it manages its own layout */}
        <Suspense fallback={<div role="status" style={{ padding: "2rem", textAlign: "center" }}>Loading page...</div>}>
        {isAdminRoute ? (
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <ProtectedRoute isAdmin={true}>
                  <NewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute isAdmin={true}>
                  <OrderList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/order/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ReviewList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicle/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <VehicleAdminDashboard />
                </ProtectedRoute>
              }
            />
           
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute adminOnly={true}>
                  <VehicleAdminList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicle/new"
              element={
                <ProtectedRoute adminOnly={true}>
                  <VehicleAdminNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicle/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <VehicleAdminEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicle/bookings"
              element={
                <ProtectedRoute adminOnly={true}>
                  <VehicleBookingList />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        ) : (
          <div className="container container-fluid">
                        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
<Route path="/experiences" element={<Experiences />} />
              <Route path="/itineraries" element={<ItineraryList />} />
              <Route path="/itineraries/:id" element={<ItineraryDetail />} />
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/vehicle/:id" element={<VehicleBooking />} />
              <Route
                path="/my/vehicle/bookings"
                element={
                  <ProtectedRoute>
                    <MyVehicleBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile/update"
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile/update/password"
                element={
                  <ProtectedRoute>
                    <UpdatePassword />
                  </ProtectedRoute>
                }
              />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <Shipping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/confirm"
                element={
                  <ProtectedRoute>
                    <ConfirmOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <UserOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    {stripePromise ? (
                      <Elements stripe={stripePromise}>
                        <Payment />
                      </Elements>
                    ) : (
                      <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        Loading payment details...
                      </div>
                    )}
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
)}

        </Suspense>
        {!isAdminRoute && <Footer />}
        </HelmetProvider>
      </div>
);
}

// ✅ App just wraps with Router so useLocation works in AppLayout
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
