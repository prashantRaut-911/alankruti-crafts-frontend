import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {

  const [items, setItems] = useState(() => {

    try {

      const storedCart =
        localStorage.getItem(
          "alankruti_cart"
        );

      return storedCart
        ? JSON.parse(storedCart)
        : [];

    } catch {

      return [];

    }

  });

  function saveCart(nextItems) {

    setItems(nextItems);

    localStorage.setItem(
      "alankruti_cart",
      JSON.stringify(nextItems)
    );
  }

  function addToCart(product, quantity = 1) {

    const existing =
      items.find(
        item =>
          item.productId === product._id
      );

    let nextItems;

    if (existing) {

      nextItems = items.map(item => {

        if (
          item.productId !== product._id
        ) {
          return item;
        }

        return {
          ...item,

          quantity: Math.min(
            item.quantity + quantity,
            product.stock || 99
          )
        };

      });

    } else {

      nextItems = [
        ...items,

        {
          productId: product._id,

          name: product.name,

          price: product.price,

          image:
            product.images?.[0] || "",

          quantity,

          stock:
            product.stock || 99
        }
      ];

    }

    saveCart(nextItems);
  }

  function updateQuantity(
    productId,
    quantity
  ) {

    const nextItems = items
      .map(item => {

        if (
          item.productId !== productId
        ) {
          return item;
        }

        return {
          ...item,

          quantity: Math.max(
            1,
            Math.min(
              quantity,
              item.stock || 99
            )
          )
        };

      });

    saveCart(nextItems);
  }

  function removeFromCart(productId) {

    const nextItems =
      items.filter(
        item =>
          item.productId !== productId
      );

    saveCart(nextItems);
  }

  function clearCart() {

    saveCart([]);

  }

  const count =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const value = useMemo(
    () => ({
      items,

      count,

      subtotal,

      addToCart,

      updateQuantity,

      removeFromCart,

      clearCart
    }),
    [items, count, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}