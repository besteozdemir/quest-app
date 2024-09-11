import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { LockOpen } from "@mui/icons-material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  link: {
    color: 'white',
    textDecoration: 'none',
    marginRight: '15px',
    fontSize: '18px',
  },
  menuButton: {
    color: 'white',
    fontSize: '24px',
    marginLeft: 'auto',
  },
  title: {
    flexGrow: 1,
    color: 'white',
    textAlign: 'left', // Home Page yazısını sola hizalar
  },
});

function NavBar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser"));

  const onClick = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userName");
    setCurrentUser(null);
    setIsLoggedOut(true);
    navigate("/"); // Hemen Home sayfasına yönlendir
  };

  const handleClose = () => {
    setIsLoggedOut(false);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" className={classes.title}>
              <Link className={classes.link} to="/">Home Page</Link>
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="h6" component="div">
              {!currentUser ? (
                <Link className={classes.link} to="/auth">Login/Register</Link>
              ) : (
                <div>
                  <IconButton className={classes.menuButton} onClick={onClick}>
                    <LockOpen />
                  </IconButton>
                  <Link className={classes.link} to={`/users/${currentUser}`}>Profile</Link>
                </div>
              )}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Çıkış sonrası mesaj için kırmızı (error) Snackbar */}
      <Snackbar
        open={isLoggedOut}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          You are successfully logged out!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default NavBar;
