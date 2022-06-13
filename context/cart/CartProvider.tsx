import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,

  shippingAddress: undefined
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookiesProducts: ICartProduct[] = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cookiesProducts
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: []
      });
    }
  }, []);

  useEffect(() => {
    const cookiesAddress: ShippingAddress =
      Cookie.get('direction') && JSON.parse(Cookie.get('direction')!);

    if (!cookiesAddress) {
      return;
    }

    dispatch({
      type: '[Cart] - LoadAddress from cookies',
      payload: cookiesAddress
    });
  }, []);

  useEffect(() => {
    if (state.cart.length === 0) return;

    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    };

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

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

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('direction', JSON.stringify(address));
    dispatch({ type: '[Cart] - Update Address', payload: address });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
