import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Link
} from '@mui/material';
import Cookies from 'js-cookie';

import { CartContext } from '../../context';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems } = useContext(CartContext);

  useEffect(() => {
    if (!Cookies.get('direction')) {
      router.push('/checkout/address');
    }
  }, [router]);

  if (!shippingAddress) {
    return <></>;
  }

  const { firstName, lastName, address, address2, city, country, phone, zip } =
    shippingAddress;

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>
        Resumen de la orden
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({numberOfItems} producto{numberOfItems > 1 ? 's' : ''})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>

                <NextLink href='/checkout/address' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>{`${city}, ${zip}`}</Typography>
              <Typography>
                {countries.find((item) => item.code === country)?.name}
              </Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
