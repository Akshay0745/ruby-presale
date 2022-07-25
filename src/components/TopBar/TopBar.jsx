import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Box,  Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";
import RubyMenu from "./RubyMenu.jsx";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Box display="flex">
          <Link
            component={NavLink}
            className="nav-logo"
            to="/"
          >
            <img src="logo.png" width="130" heigh="150px" alt="logo"></img>
            <Typography className="presale-items" style={{marginLeft: "-14px", marginRight: "4px", fontSize: "40px"}}><span style={{color: "rgb(253 175 13)"}}>  Ruby</span></Typography>
          </Link>
        </Box>
        <Box display="flex">
          <Link
            component={NavLink}
            className="nav-link"
            to="/presale"
          >
            <Typography variant="h6" className="nav-link-text">
              Presale
            </Typography>
          </Link>
          <Link
            component={NavLink}
            className="nav-link"
            to="/claim"
          >
            <Typography variant="h6" className="nav-link-text">
              Claim
            </Typography>
          </Link>
          <Box display="flex">
          {!isVerySmallScreen && <RubyMenu />}
          <ConnectMenu theme={theme} />
        </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
