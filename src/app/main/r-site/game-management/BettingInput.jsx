import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { locale } from '../../../configs/navigation-i18n';

function BettingInput({ data, onInputChange, defaultValue, resultBets, unique_id }) {
	const [selectedLang, setSelectedLang] = useState(locale.en);

  const [limit, setLimit] = useState(data?.limit);

  const handleInputChange = (newValue) => {
    setLimit(newValue);
    onInputChange(data.unique_id, newValue); // Pass the unique_id and new value to the parent component
  };

  useEffect(()=>{
      setLimit(data?.limit)
  },[data])

  const formatAmount = (amount) => {
    // Convert the amount to a number
    const numericAmount = Number(amount);

    // Check if the numericAmount is valid and not NaN
    if (!isNaN(numericAmount)) {
        // Use toLocaleString to format the amount with thousands separators
        return numericAmount.toLocaleString();
    } else {
        // If the amount is not a valid number, return the original value
        return amount;
    }
    };

  return (
    <FormControl>
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          border: '1px solid #cdcfd3',
          borderRadius: '4px',
          marginLeft: '8px',
          padding: '4px 10px',
          marginRight: '0px',
          fontSize: '12px',
        }}
        type="text"
        // defaultValue={(resultBets.find(item => item.unique_id == unique_id) || {}).limit}
        value={formatAmount(limit)}
        // onChange={handleInputChange}
        onChange={(e) => {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(
                /[^0-9.]/g,
                ''
            );
            const dotCount =
                inputValue.split('.').length - 1;
            if (dotCount > 1) {
                return;
            }
            // setGlobalLimit(inputValue);
            const numericValue =
                parseFloat(inputValue) || 0;
            const maxLimit = 100000000;
            if (
                numericValue <= maxLimit ||
                numericValue == ''
            ) {
                handleInputChange(numericValue);
            }
        }}
        inputProps={{
          'aria-label': selectedLang.casino_users,
        }}
      />
    </FormControl>
  );
}

export default BettingInput;
