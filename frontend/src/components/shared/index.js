import React, { useState } from 'react';
import { Menu, MenuItem, CircularProgress, Typography, Chip } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Link as DomLink, useNavigate } from 'react-router-dom';
import { Add as AddIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import CSVUploadModal from './fields/CSVUploadModal';
import DeleteModal from './DeleteModal';
import DropdownMenu from './DropdownMenu';
import SearchIcon from '@mui/icons-material/Search';

import { providerFormTypes } from '../../constants/provider_fields.js'

const useStyles = makeStyles((theme) => ({
  link: {
    color: 'inherit',
    textDecorationLine: 'none',
  },
  linkWithHover: {
    fontWeight: 500,
    // textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
      color: '#2f5ac7'
    }
  },
  progress: {
    margin: theme.spacing(2),
    marginTop: 50,
  },
  chipButton: {
    paddingLeft: 6,
    marginLeft: 6,
  }
}));

export function Link({className = '', colorWithHover, color,to, ...props}) {
  const classes = useStyles();
  return <DomLink {...props} to={process.env.PUBLIC_URL + to} className={colorWithHover ? classes.linkWithHover : classes.link + ' ' + className} color={color || 'inherit'}/>
}

/**
 * Used by DataTable. Add "add button" and "upload by CSV button"
 * @param onClick
 * @returns {*}
 * @constructor
 */
export function CustomToolbar({handleAdd, handleUpload, handleSearch, type}) {
  const navigate = useNavigate();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLink = link => () => {
    navigate(link);
  };

  return (
    <>
      {handleUpload && <Chip onClick={handleUpload}
            color="default"
            icon={<UploadIcon/>}
            label="Upload"
            variant="outlined"
            className={classes.chipButton}
      />}

      <Chip onClick={type === 'providers' ? handleClick : handleSearch}
            color="primary"
            icon={<SearchIcon/>}
            label="Advance Search"
            variant="outlined"
            className={classes.chipButton}
      />
      <Chip onClick={type === 'providers' ? handleClick : handleAdd}
            color="primary"
            icon={<AddIcon/>}
            label="Add"
            variant="outlined"
            className={classes.chipButton}
      />

      {/*For Providers */}
      {type === 'providers' &&
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {Object.entries(providerFormTypes).map(([value, formType]) =>
          <MenuItem disabled={formType !== 'Organization' && formType !== 'Volunteer'} key={formType} onClick={handleLink(`/providers/${value}/new`)}>
            {formType}
          </MenuItem>)
        }
      </Menu>
      }
    </>
  );
}

export function Loading({message = 'Loading Components...'}) {
  const classes = useStyles();
  return (
    <div style={{textAlign: 'center'}}>
      <CircularProgress className={classes.progress}/>
      <Typography variant="subtitle2" color={"textSecondary"}>
        {message}
      </Typography>
    </div>
  );
}


export {
  CSVUploadModal, DeleteModal, DropdownMenu,
}
export {EnhancedTable as DataTable} from './Table';
