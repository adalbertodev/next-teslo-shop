import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';

const HomePage: NextPage = () => {
  return (
    <ShopLayout
      title='Teslo Shop - Home'
      pageDescription='Encuentra los mejores productos de Teslo aquí'
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>

      <Typography variant='h2'>Todos los productos</Typography>
    </ShopLayout>
  );
};

export default HomePage;
