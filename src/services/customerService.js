import api from "./api";

export const customerService = {

  async getCustomers(
    params = {}
  ) {

    const response =
      await api.get(
        "/customers",
        {
          params
        }
      );

    return response.data;
  }

};