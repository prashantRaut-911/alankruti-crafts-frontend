import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Users,
  RefreshCw,
} from "lucide-react";

import {
  getCustomers,
} from "../../services/customerService";

const CustomerManagement = () => {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getCustomers({
          page: 1,
          limit: 100,
        });

      setCustomers(
        response.data?.customers ||
          response.customers ||
          []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers =
    customers.filter((customer) => {
      const query =
        search.toLowerCase();

      return (
        customer.name
          ?.toLowerCase()
          .includes(query) ||
        customer.phone
          ?.toLowerCase()
          .includes(query) ||
        customer.email
          ?.toLowerCase()
          .includes(query)
      );
    });

  return (
    <div className="admin-page">
      <div className="container">

        <section className="admin-page-header">

          <div>
            <span className="section-kicker">
              Customer records
            </span>

            <h1>
              Customers
            </h1>

            <p>
              View customer information and
              purchase-related details.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadCustomers}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </section>

        <div className="admin-toolbar">

          <div className="admin-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customers..."
            />
          </div>

          <span className="admin-count">
            {filteredCustomers.length} customers
          </span>

        </div>

        {error && (
          <div className="error-message">

            <h3>
              Unable to load customers
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadCustomers}
            >
              Try Again
            </button>

          </div>
        )}

        {loading && (
          <div className="admin-loading">
            Loading customers...
          </div>
        )}

        {!loading &&
          !error &&
          filteredCustomers.length > 0 && (
            <div className="admin-product-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Orders</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCustomers.map(
                    (customer, index) => (
                      <tr
                        key={
                          customer._id ||
                          customer.phone ||
                          index
                        }
                      >

                        <td>
                          <div className="admin-product-cell">

                            <div className="admin-customer-avatar">
                              {(
                                customer.name ||
                                "C"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {customer.name ||
                                  "Customer"}
                              </strong>

                              <span>
                                {customer._id
                                  ? `ID: ${customer._id}`
                                  : "Customer"}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {customer.phone ||
                            "—"}
                        </td>

                        <td>
                          {customer.email ||
                            "—"}
                        </td>

                        <td>
                          {customer.city ||
                            "—"}
                        </td>

                        <td>
                          {customer.orderCount ??
                            customer.orders?.length ??
                            0}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        {!loading &&
          !error &&
          filteredCustomers.length === 0 && (
            <div className="empty-state">

              <div className="empty-state-icon">
                <Users size={25} />
              </div>

              <h3>
                {search
                  ? "No customers found"
                  : "No customers yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Customer records will appear here after purchases."}
              </p>

            </div>
          )}

      </div>
    </div>
  );
};

export default CustomerManagement;