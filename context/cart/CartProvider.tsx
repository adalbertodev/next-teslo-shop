import { FC, useEffect, useReducer, useMemo, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
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
  const [isFirstRefresh, setIsFirstRefresh] = useState(true);

  useEffect(() => {
    if (isFirstRefresh) return;

    Cookie.set('cart', JSON.stringify(state.cart));
  }, [isFirstRefresh, state.cart]);

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
    setIsFirstRefresh(false);
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

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error('No hay dirección de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map((product) => ({
        ...product,
        size: product.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    };

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: '[Cart] - Order complete' });

      return {
        hasError: false,
        message: data._id!
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error as any).response?.data.message
        };
      }

      return {
        hasError: true,
        message: 'Error no controlado'
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
