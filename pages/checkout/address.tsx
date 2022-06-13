// import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
// import { jwt } from '../../utils';
import { useContext, useMemo, useEffect, useState } from 'react';
import { CartContext } from '../../context';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  const address: FormData | undefined = Cookies.get('direction')
    ? JSON.parse(Cookies.get('direction')!)
    : undefined;

  return {
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    address: address?.address || '',
    address2: address?.address2 || '',
    zip: address?.zip || '',
    city: address?.city || '',
    country: address?.country || '',
    phone: address?.phone || ''
  };
};

const AdressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies()
  });
  const [defaultCountry, setDefaultCountry] = useState<string | undefined>(
    undefined
  );

  const onSubmitAddress = (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  useEffect(() => {
    setDefaultCountry(getValues('country'));
  }, [getValues]);

  return (
    <ShopLayout
      title='Dirección'
      pageDescription='Confirmar dirección del destino'
    >
      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <Typography variant='h1' component='h1'>
          Dirección
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Nombre'
              variant='filled'
              fullWidth
              {...register('firstName', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Apellido'
              variant='filled'
              fullWidth
              {...register('lastName', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Dirección'
              variant='filled'
              fullWidth
              {...register('address', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Dirección 2 (opcional)'
              variant='filled'
              fullWidth
              {...register('address2')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Codigo Postal'
              variant='filled'
              fullWidth
              {...register('zip', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Ciudad'
              variant='filled'
              fullWidth
              {...register('city', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant='filled'
                label='País'
                value={defaultCountry || countries[0].code}
                {...register('country', {
                  required: 'Este campo es requerido'
                })}
                error={!!errors.country}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label='Teléfono'
              variant='filled'
              fullWidth
              {...register('phone', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, mr: 2 }} display='flex' justifyContent='end'>
          <Button
            type='submit'
            color='secondary'
            className='circular-btn'
            size='large'
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken(token);
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     };
//   }

//   return {
//     props: {}
//   };
// };

export default AdressPage;
