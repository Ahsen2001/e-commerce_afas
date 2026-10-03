import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState } from "react";
import { countries } from "countries-list";
import { saveShippingInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "react-toastify";

export const validateShipping = (shippingInfo, navigate) => {
  if (
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.state ||
    !shippingInfo.country ||
    !shippingInfo.phoneNo ||
    !shippingInfo.postalCode
  ) {
    toast.error("Please fill the shipping information", { position: "bottom-center" });
    navigate("/shipping");
  }
};

export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cart || {});

  const [address, setAddress]       = useState(shippingInfo.address    || "");
  const [city, setCity]             = useState(shippingInfo.city        || "");
  const [phoneNo, setPhoneNo]       = useState(shippingInfo.phoneNo     || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode  || "");
  const [country, setCountry]       = useState(shippingInfo.country     || "");
  const [state, setState]           = useState(shippingInfo.state       || "");

  const countryList = Object.values(countries);
  const dispatch    = useDispatch();
  const navigate    = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country, state }));
    navigate("/order/confirm");
  };

  const inputStyle = {
    borderRadius: "8px",
    border: "1.5px solid #e0e0e0",
    padding: "10px 14px",
    fontSize: "15px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelStyle = {
    fontSize: "12px", fontWeight: 700, color: "#555",
    textTransform: "uppercase", letterSpacing: "0.5px",
    marginBottom: "6px", display: "block",
  };

  const fields = [
    { id: "address_field",     label: "Address",     icon: "fa-map-marker", type: "text",   value: address,     setter: setAddress,     placeholder: "Enter your street address" },
    { id: "city_field",        label: "City",        icon: "fa-city",       type: "text",   value: city,        setter: setCity,        placeholder: "Enter your city" },
    { id: "phone_field",       label: "Phone No",    icon: "fa-phone",      type: "tel",    value: phoneNo,     setter: setPhoneNo,     placeholder: "+94 XX XXX XXXX" },
    { id: "postal_code_field", label: "Postal Code", icon: "fa-mail-bulk",  type: "number", value: postalCode,  setter: setPostalCode,  placeholder: "Enter postal code" },
    { id: "state_field",       label: "State",       icon: "fa-flag",       type: "text",   value: state,       setter: setState,       placeholder: "Enter your state / province" },
  ];

  return (
    <Fragment>
      <CheckoutSteps shipping />

      <div className="profile-wrapper">
        <div className="profile-box" style={{ padding: 0, overflow: "hidden", maxWidth: "600px" }}>

          {/* Header Banner */}
          <div style={{
            background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
            padding: "1.8rem 2rem",
            display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <i className="fa fa-shipping-fast" style={{ color: "#5ce1e6", fontSize: "18px" }} />
            </div>
            <div>
              <h2 style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: "20px" }}>
                Shipping Information
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", margin: 0, fontSize: "13px" }}>
                Tell us where to deliver your order
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: "2rem" }}>
            <form onSubmit={submitHandler}>

              {/* Mapped text/tel/number fields */}
              {fields.map(({ id, label, icon, type, value, setter, placeholder }) => (
                <div key={id} style={{ marginBottom: "1.2rem" }}>
                  <label htmlFor={id} style={labelStyle}>
                    <i className={`fa ${icon}`} style={{ marginRight: "6px", color: "#1b6ca8" }} />
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setter(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={e  => e.target.style.borderColor = "#1b6ca8"}
                    onBlur={e   => e.target.style.borderColor = "#e0e0e0"}
                  />
                </div>
              ))}

              {/* Country Dropdown */}
              <div style={{ marginBottom: "1.8rem" }}>
                <label htmlFor="country_field" style={labelStyle}>
                  <i className="fa fa-globe" style={{ marginRight: "6px", color: "#1b6ca8" }} />
                  Country
                </label>
                <select
                  id="country_field"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#1b6ca8"}
                  onBlur={e  => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="">Select Country</option>
                  {countryList.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 50%, #0d7377 100%)",
                  color: "#fff", border: "none",
                  padding: "13px", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 700,
                  cursor: "pointer", transition: "opacity 0.2s",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <i className="fa fa-arrow-right" />
                Continue to Confirm Order
              </button>

            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}