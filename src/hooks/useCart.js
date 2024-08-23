import { db } from "../data/db";
import { useState, useEffect, useMemo } from "react";

const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart");
        return localStorageCart ? JSON.parse(localStorageCart) : [];
      };
    
      const [data, setData] = useState([]);
    
      const [cart, setCart] = useState(initialCart);
    
      const MAX_ITEMS = 5;
    
      const MIN_ITEMS = 1;
    
      function addToCart(item) {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    
        if (itemExists >= 0) {
          if (cart[itemExists].quantity >= MAX_ITEMS) return;
          const updatedCart = [...cart];
          updatedCart[itemExists].quantity++;
          setCart(updatedCart);
        } else {
          item.quantity = 1;
          setCart([...cart, item]);
        }
      }
    
      function removeFromCart(id) {
        setCart((prevCart) => prevCart.filter((guitar) => guitar.id != id));
      }
    
      function decreaseQuantity(id) {
        const updatedCart = cart.map((item) => {
          if (item.id === id && item.quantity > MIN_ITEMS) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
        setCart(updatedCart);
      }
    
      function increaseQuantity(id) {
        const updatedCart = cart.map((item) => {
          if (item.id === id && item.quantity < MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
        setCart(updatedCart);
      }
    
      function clearCart() {
        setCart([]);
      }
    
      useEffect(() => {
        setData(db);
      }, []);
    
      useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
      }, [cart]);

      const isEmpty = useMemo( () => cart.length === 0, [cart] )

      const cartTotal = useMemo ( () => cart.reduce( (total, item) => total + (item.quantity * item.price), 0), [cart])
    
    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
        
    }

}

export default useCart