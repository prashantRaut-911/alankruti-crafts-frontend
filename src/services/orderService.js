import api from "./api";

export const createOrder = async (order) => {
  const response = await api.post("/orders", order);

  return response.data;
};

export const getMyOrders = async (phone) => {
  const response = await api.get("/orders/mine", {
    params: {
      phone,
    },
  });

  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/orders/admin", {
    params,
  });

  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, {
    orderStatus: status,
  });

  return response.data;
};