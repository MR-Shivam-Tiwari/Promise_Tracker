import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useColorScheme } from '@mui/joy/styles';
import IconButton from '@mui/joy/IconButton';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

function ColorSchemeToggle({ onClick, sx, ...other }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        {...other}
        sx={sx}
        disabled
      />
    );
  }

  const handleClick = (event) => {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
    onClick?.(event);
  };

  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...other}
      onClick={handleClick}
      sx={[
        {
          '& > *:first-of-type': {
            display: mode === 'dark' ? 'none' : 'initial',
          },
          '& > *:last-child': {
            display: mode === 'light' ? 'none' : 'initial',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRoundedIcon style={{ display: mode === 'light' ? 'none' : 'initial' }} />
      <LightModeIcon style={{ display: mode === 'dark' ? 'none' : 'initial' }} />
    </IconButton>
  );
}

ColorSchemeToggle.propTypes = {
  onClick: PropTypes.func,
  sx: PropTypes.object,
};

export default ColorSchemeToggle;
