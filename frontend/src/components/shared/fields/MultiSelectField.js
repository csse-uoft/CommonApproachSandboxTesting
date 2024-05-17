import React, { useCallback} from "react";
import { Autocomplete, TextField } from "@mui/material";
import {Help as HelpIcon} from "@mui/icons-material";

export default function Dropdown(props) {
  // options is {labelValue1: label1, labelValue2: label2, ...}
  const {options, label, value, onChange, helperText, required, error, onBlur, disabled, questionMarkOnClick, minWidth, fullWidth, chooseAll} = props;

  const handleChange = useCallback((e, value) => {
    if (value.includes('Choose All') && chooseAll) {
      onChange({target: {value: Object.keys(options)}});
    } else {
      onChange({target: {value}});
    }

  }, [onChange]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        sx={{mt: '16px',}}
        multiple
        options={chooseAll? ['Choose All', ...Object.keys(options)]: Object.keys(options)}
        onChange={handleChange}
        getOptionLabel={ labelValue=> options[labelValue] || 'Choose All'}
        defaultValue={value}
        value={value}
        onBlur={onBlur}
        fullWidth={fullWidth}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            label={label}
            sx={{minWidth: minWidth || 350}}
            fullWidth={fullWidth}
            helperText={helperText}
            error={error}
          />
        )}
      />
      {questionMarkOnClick?<HelpIcon
        cursor={'pointer'}
        onClick={questionMarkOnClick}
        sx={{mt: '25px'}}
        color={"primary"}
      />:<div/>}


    </div>

  )
}
