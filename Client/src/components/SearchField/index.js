import React from 'react';
import { TextField } from '@mui/material';

const SearchField = ({ onSearchChange, label, className }) => {
   return (
      <TextField
         label={label}
         variant='outlined'
         fullWidth
         onChange={(e) => onSearchChange(e.target.value)} // Обновляем searchQuery в родительском компоненте
         className={className}
      />
   );
};

export default SearchField;
