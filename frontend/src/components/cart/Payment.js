import {
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { validateShipping } from "../cart/Shipping";
import { createOrder } from "../../actions/orderActions";
import { clearError as clearOrderError } from "../../slices/orderSlice";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../layouts/MetaData";

const stripeElementStyle = {
  style: {
    base: {
      fontSize: "15px",
      color: "#222",
      fontFamily: "'Amazon Ember', sans-serif",
      "::placeholder": { color: "#bbb" },
    },
    invalid: { color: "#e74c3c" },
  },
};

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");

  const { user = {} } = useSelector((state) => state.auth || {});
  const { items: cartItems = [], shippingInfo = {} } = useSelector(
    (state) => state.cart || {}
  );
  const { error: orderError } = useSelector((state) => state.order || {});

  useEffect(() => {
    validateShipping(shippingInfo, navigate);

    if (orderError) {
      toast(orderError, { position: "bottom-center", type: "error" });
      dispatch(clearOrderError());
    }
  }, [shippingInfo, navigate, orderError, dispatch]);

 const paymentData = {
  amount: Math.round((Number(orderInfo.totalPrice) || 0) * 100),
  shipping: {
      name: user.name,
    address: {
      city: shippingInfo.city,
      postal_code: shippingInfo.postalCode,
        country: shippingInfo.country,
        state: shippingInfo.state,
      line1: shippingInfo.address,
    },
    phone: shippingInfo.phoneNo,
  },
};

  const order = {
    orderItems: cartItems,
    shippingInfo,
    itemsPrice: orderInfo.itemsPrice,
    shippingPrice: orderInfo.shippingPrice,
    taxPrice: orderInfo.taxPrice,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData);
      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        toast(result.error.message, {
          type: "error",
          position: "bottom-center",
        });
        setPaying(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        toast("Payment successful!", {
          type: "success",
          position: "bottom-center",
        });

        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        dispatch(orderCompleted());
        await dispatch(createOrder(order));
        navigate("/order/success");
      } else {
        toast("Please try again!", {
          type: "warning",
          position: "bottom-center",
        });
        setPaying(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || error.message || "Payment failed", {
        type: "error",
        position: "bottom-center",
      });
      setPaying(false);
    }
  };

  return (
    <>
      <MetaData title="Payment" />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-6 col-xl-5">

            {/* Card Preview */}
            <div
              className="card text-white border-0 shadow-lg mb-4"
              style={{
                background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 55%, #0d7377 100%)",
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex justify-content-center align-items-center rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(255,255,255,0.15)",
                      }}
                    >
                      <i className="fa fa-credit-card text-info"></i>
                    </div>
                    <h5 className="mb-0 fw-bold">
                      TravelVista<span className="text-info">.LK</span>
                    </h5>
                  </div>

                  <div className="d-flex gap-2">
                    <i className="fa fa-cc-visa fs-3 text-white-50"></i>
                    <i className="fa fa-cc-mastercard fs-3 text-white-50"></i>
                    <i className="fa fa-cc-amex fs-3 text-white-50"></i>
                  </div>
                </div>

                <div
                  className="mb-4 rounded"
                  style={{
                    width: "50px",
                    height: "35px",
                    background: "linear-gradient(135deg, #f0c040, #c8960c)",
                  }}
                ></div>

                <div
                  className="mb-4"
                  style={{
                    letterSpacing: "4px",
                    fontFamily: "monospace",
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  •••• •••• •••• ••••
                </div>

                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <small className="text-uppercase text-white-50 d-block">
                      Card Holder
                    </small>
                    <div className="fw-semibold">{user.name || "Your Name"}</div>
                  </div>

                  <div className="text-end">
                    <small className="text-uppercase text-white-50 d-block">
                      Amount
                    </small>
                    <div className="fw-bold fs-5 text-info">
                      LKR {orderInfo?.totalPrice || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="fa fa-lock text-primary me-2"></i>
                  Enter Card Details
                </h5>

                <form onSubmit={submitHandler} autoComplete="off">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-uppercase small text-muted">
                      Card Number
                    </label>
                    <div className="form-control py-3">
                      <CardNumberElement options={stripeElementStyle} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-uppercase small text-muted">
                        Expiry Date
                      </label>
                      <div className="form-control py-3">
                        <CardExpiryElement options={stripeElementStyle} />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-uppercase small text-muted">
                        CVC / CVV
                      </label>
                      <div className="form-control py-3">
                        <CardCvcElement options={stripeElementStyle} />
                      </div>
                    </div>
                  </div>

                  <button
                    id="pay_btn"
                    type="submit"
                    disabled={!stripe || paying}
                    className="btn btn-primary w-100 py-3 fw-bold mt-2"
                  >
                    {paying ? (
                      <>
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-lock me-2"></i>
                        Pay LKR {orderInfo?.totalPrice || 0}
                      </>
                    )}
                  </button>

                  <div className="d-flex justify-content-center flex-wrap gap-3 mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
                      <i className="fa fa-lock text-primary"></i>
                      <span>SSL Secure</span>
                    </div>

                    <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
                      <i className="fa fa-shield text-primary"></i>
                      <span>256-bit Enc.</span>
                    </div>

                    <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
                      <i className="fa fa-check-circle text-primary"></i>
                      <span>PCI DSS</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}