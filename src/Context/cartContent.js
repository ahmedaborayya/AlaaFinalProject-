import { createContext, useState } from "react";

export let CartContent = createContext();

export default function CartContentProvider(props) {
  const [cartItems, setCartItems] = useState([]);
  const [numOfCartItems, setNumOfCartItems] = useState(0);

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, count: item.count + 1, price: item.product.price * (item.count + 1) }
            : item
        );
      }
      return [...prev, { product, count: 1, price: product.price }];
    });
    setNumOfCartItems((n) => n + 1);
  }

  function getCart() {
    const totalCartPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.count,
      0
    );
    return Promise.resolve({
      data: {
        data: { products: cartItems, totalCartPrice },
        numOfCartItems,
      },
    });
  }

  function deleteProductFromCart(productId) {
    const item = cartItems.find((i) => i.product.id === productId);
    const removedCount = item ? item.count : 0;
    const updated = cartItems.filter((i) => i.product.id !== productId);
    setCartItems(updated);
    setNumOfCartItems((n) => n - removedCount);
    const totalCartPrice = updated.reduce(
      (sum, i) => sum + Number(i.product.price) * i.count,
      0
    );
    return Promise.resolve({
      data: {
        data: { products: updated, totalCartPrice },
        numOfCartItems: numOfCartItems - removedCount,
      },
    });
  }

  function updateProductQuantity(productId, count) {
    if (count < 1) return deleteProductFromCart(productId);
    const updated = cartItems.map((item) =>
      item.product.id === productId ? { ...item, count } : item
    );
    setCartItems(updated);
    const totalCartPrice = updated.reduce(
      (sum, i) => sum + Number(i.product.price) * i.count,
      0
    );
    return Promise.resolve({
      data: {
        data: { products: updated, totalCartPrice },
        numOfCartItems,
      },
    });
  }

  function clearCart() {
    setCartItems([]);
    setNumOfCartItems(0);
  }

  return (
    <CartContent.Provider
      value={{
        addToCart,
        getCart,
        deleteProductFromCart,
        updateProductQuantity,
        clearCart,
        numOfCartItems,
        setNumOfCartItems,
        cartItems,
      }}
    >
      {props.children}
    </CartContent.Provider>
  );
}