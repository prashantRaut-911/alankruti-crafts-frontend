import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const CustomerProfile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Please enter your name."
      );
      return;
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone)
    ) {
      toast.error(
        "Please enter a valid mobile number."
      );
      return;
    }

    if (
      form.pincode &&
      !/^\d{6}$/.test(form.pincode)
    ) {
      toast.error(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Customer profile API will be connected
       * after the backend customer authentication
       * module is completed.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      localStorage.setItem(
        "alankruti_customer",
        JSON.stringify(form)
      );

      toast.success(
        "Profile details saved."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">

      {/* ================= HEADER ================= */}
      <section className="page-header">
        <div className="container">

          <span className="section-kicker">
            Your details
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Save your contact and delivery details
            for a smoother shopping experience.
          </p>

        </div>
      </section>

      {/* ================= PROFILE ================= */}
      <section className="profile-section section">

        <div className="container profile-layout">

          {/* Intro Card */}
          <aside className="profile-intro">

            <div className="profile-icon">
              <User size={26} />
            </div>

            <span className="section-kicker">
              Customer
            </span>

            <h2>
              Your information,
              <br />
              kept simple.
            </h2>

            <p>
              Your saved details can make checkout
              faster the next time you shop with
              Alankruti Crafts.
            </p>

            <div className="profile-feature">

              <Phone size={18} />

              <span>
                Contact information
              </span>

            </div>

            <div className="profile-feature">

              <MapPin size={18} />

              <span>
                Delivery address
              </span>

            </div>

          </aside>

          {/* Form */}
          <div className="profile-form-card">

            <div className="profile-form-header">

              <div>
                <span className="section-kicker">
                  Personal details
                </span>

                <h2>
                  Contact information
                </h2>
              </div>

            </div>

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}
              <div className="form-group">

                <label htmlFor="profile-name">
                  Full Name
                </label>

                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>

              {/* Phone */}
              <div className="form-group">

                <label htmlFor="profile-phone">
                  Mobile Number
                </label>

                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />

              </div>

              <div className="profile-divider" />

              <div className="profile-address-heading">

                <MapPin size={19} />

                <div>
                  <h3>
                    Delivery address
                  </h3>

                  <p>
                    Where should we deliver your
                    orders?
                  </p>
                </div>

              </div>

              {/* Address */}
              <div className="form-group">

                <label htmlFor="profile-address">
                  Address
                </label>

                <textarea
                  id="profile-address"
                  name="address"
                  rows="4"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Street / Area"
                />

              </div>

              {/* City + State */}
              <div className="form-grid-2">

                <div className="form-group">

                  <label htmlFor="profile-city">
                    City
                  </label>

                  <input
                    id="profile-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="profile-state">
                    State
                  </label>

                  <input
                    id="profile-state"
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                </div>

              </div>

              {/* Pincode */}
              <div className="form-group">

                <label htmlFor="profile-pincode">
                  Pincode
                </label>

                <input
                  id="profile-pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                />

              </div>

              {/* Save */}
              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Details"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </section>

    </div>
  );
};

export default CustomerProfile;