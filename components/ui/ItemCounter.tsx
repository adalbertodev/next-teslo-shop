import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  currentValue: number;
  maxValue: number;

  updatedQuantity: (newValue: number) => void;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  updatedQuantity
}) => {
  const onValueChange = (increment: number) => {
    const newValue = currentValue + increment;

    if (newValue >= 1 && newValue <= maxValue) {
      updatedQuantity(newValue);
    }
  };

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={() => onValueChange(-1)}>
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 30, textAlign: 'center' }}>
        {currentValue}
      </Typography>

      <IconButton onClick={() => onValueChange(1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
