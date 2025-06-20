// cartActions.js
import { addToCart,removeFromCart } from "../reducers/cart";

// Add to cart thunk
export const addTocart = (data) => async (dispatch, getState) => {
  
  dispatch(addToCart(data));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// Remove from cart thunk
export const removeFromcart = (data) => async (dispatch, getState) => {
 
  dispatch(removeFromCart(data._id));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
 
};
