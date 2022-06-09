import { FC, useReducer } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: []
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some(
      (item) => item._id === product._id && item.size === product.size
    );

    if (!productInCart) {
      return dispatch({
        type: '[Cart] - Update cart',
        payload: [...state.cart, product]
      });
    }

    const updatedProducts = state.cart.map((cartProduct) => {
      if (cartProduct._id !== product._id && cartProduct.size !== product.size)
        return cartProduct;

      cartProduct.quantity += product.quantity;
      return cartProduct;
    });

    dispatch({ type: '[Cart] - Update cart', payload: updatedProducts });
  };

  return (
    <CartContext.Provider value={{ ...state, addProductToCart }}>
      {children}
    </CartContext.Provider>
  );
};
