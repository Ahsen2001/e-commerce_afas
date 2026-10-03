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
import ProductDetail from "./components/product/ProductDetail";
import ProductSearch from "./components/product/ProductSearch";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Experiences from "./components/experience/Experiences";
import { useEffect, useState } from "react";
import store from "./store";
import { loadUser } from "./actions/authActions";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/confirmOrder";
import Payment from "./components/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import OrderSuccess from "./components/cart/OrderSuccess";
import UserOrders from "./components/cart/UserOrders";
import OrderDetail from "./components/order/orderDetail";
import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import UpdateOrder from "./components/admin/UpdateOrder";
import UserList from "./components/admin/UserList";
import UpdateUser from "./components/admin/UpdateUser";
import ReviewList from "./components/admin/ReviewList";
import ItineraryList from "./components/itinerary/ItineraryList";
import ItineraryDetail from "./components/itinerary/ItineraryDetail";
import VehicleList from "./components/vehicles/VehicleList";
import VehicleBooking from "./components/vehicles/VehicleBooking";
import MyVehicleBookings from "./components/vehicles/MyVehicleBookings";
import VehicleAdminDashboard from "./components/vehicles/VehicleAdminDashboard";
import VehicleAdminList from "./components/vehicles/admin/VehicleAdminList";
import VehicleAdminNew from "./components/vehicles/admin/VehicleAdminNew";
import VehicleAdminEdit from "./components/vehicles/admin/VehicleAdminEdit";
import VehicleBookingList from "./components/vehicles/admin/VehicleBookingList";

// ✅ Separate component so useLocation works inside Router
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapi");
        setStripePromise(loadStripe(data.stripeApiKey));
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    }

    getStripeApiKey();
  }, []);

  return (
          <div className="App">
        <HelmetProvider>
          <ToastContainer theme="dark" />

        {/*  Hide Header and Footer on admin routes */}
        {!isAdminRoute && <Header />}

        {/*  No container wrapper for admin — it manages its own layout */}
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
            // Inside admin Routes block:
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
