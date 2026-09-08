import {
  Package,
  ShoppingBag,
  Users,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { admin } = useAuth();

  const stats = [
    {
      label: "Products",
      value: "Manage",
      description: "Add, edit and remove products.",
      icon: Package,
      link: "/admin/products",
    },
    {
      label: "Orders",
      value: "Manage",
      description: "View and update customer orders.",
      icon: ShoppingBag,
      link: "/admin/orders",
    },
    {
      label: "Customers",
      value: "Manage",
      description: "View customer information.",
      icon: Users,
      link: "/admin/customers",
    },
  ];

  return (
    <div className="admin-page">
      <div className="container">

        {/* Header */}
        <section className="admin-page-header">

          <div>
            <span className="section-kicker">
              Alankruti Crafts
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome back
              {admin?.name
                ? `, ${admin.name}`
                : ""}.
              Manage your store from here.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/admin/products/new"
              className="btn btn-primary"
            >
              <Plus size={17} />
              Add Product
            </Link>
          </div>

        </section>

        {/* Overview */}
        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <span className="section-kicker">
                Overview
              </span>

              <h2>
                Store management
              </h2>
            </div>

            <LayoutDashboard size={22} />

          </div>

          <div className="admin-stat-grid">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  to={stat.link}
                  className="admin-stat-card"
                >
                  <div className="admin-stat-icon">
                    <Icon size={22} />
                  </div>

                  <div className="admin-stat-content">
                    <span>
                      {stat.label}
                    </span>

                    <strong>
                      {stat.value}
                    </strong>

                    <p>
                      {stat.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="admin-stat-arrow"
                  />
                </Link>
              );
            })}

          </div>

        </section>

        {/* Quick Actions */}
        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <span className="section-kicker">
                Quick actions
              </span>

              <h2>
                Get started
              </h2>
            </div>
          </div>

          <div className="admin-quick-actions">

            <Link
              to="/admin/products"
              className="admin-action-card"
            >
              <Package size={20} />

              <div>
                <strong>
                  Product Management
                </strong>

                <span>
                  Manage your catalogue
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>

            <Link
              to="/admin/orders"
              className="admin-action-card"
            >
              <ShoppingBag size={20} />

              <div>
                <strong>
                  Order Management
                </strong>

                <span>
                  Review customer orders
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>

            <Link
              to="/admin/customers"
              className="admin-action-card"
            >
              <Users size={20} />

              <div>
                <strong>
                  Customers
                </strong>

                <span>
                  View customer records
                </span>
              </div>

              <ArrowRight size={17} />
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;