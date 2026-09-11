import { useCallback, useEffect, useState } from "react";

import {
  getProducts,
  getProduct,
} from "../services/productService";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts(params);

      setProducts(response.products || []);

      setPagination({
        page: response.pagination?.currentPage || 1,
        pages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalProducts || 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getProduct(id);

      setProduct(response.product || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};