import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Dashboard from "@mui/icons-material/Dashboard";
import Home from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";

import { BsFillPeopleFill } from "react-icons/bs";
import { RiAdvertisementFill } from "react-icons/ri";
import { AiFillProfile } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import MyListItem from "../components/MyListItem";
import useAppStore from "../store/app";
import { ucfirst } from "../libs/utils";
import SubHeader from "../components/typography/SubHeader";
import { useNavigate } from "react-router-dom";
import MySnackbar from "../components/prompts/MySnackbar";
import MyAlert from "../components/prompts/MyAlert";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout() {
  const { username, isManager } = useAppStore((state) => state.userProfile);
  const resetUserJWTToken = useAppStore((state) => state.resetUserJWTToken);
  const resetUserProfile = useAppStore((state) => state.resetUserProfile);
  const openSnackbar = useAppStore((state) => state.openSnackbar);
  const resetSnackbar = useAppStore((state) => state.resetSnackbar);
  const openAlert = useAppStore((state) => state.openAlert);
  const resetAlert = useAppStore((state) => state.resetAlert);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    openSnackbar(
      "Logging out.",
      () => {
        resetSnackbar();
      },
      () => {
        openAlert(
          "Logged out.",
          () => {
            resetUserJWTToken();
            resetUserProfile();
            navigate("/");
            resetAlert();
            resetSnackbar();
          },
          "success"
        );
      }
    );
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const listGenerator = (isManager: boolean | undefined) => {
    return isManager
      ? ["Dashboard", "My Marketers", "My Adverts", "My Details"]
      : ["Dashboard", "My Adverts", "My Details"];
  };
  const firstListIconsGen = (isManager: boolean | undefined) => {
    return isManager
      ? [
          <Dashboard />,
          <BsFillPeopleFill size={24} />,
          <RiAdvertisementFill size={24} />,
          <AiFillProfile size={24} />,
        ]
      : [
          <Dashboard />,
          <RiAdvertisementFill size={24} />,
          <AiFillProfile size={24} />,
        ];
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ backgroundColor: "white" }}>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
                color: "rgba(103, 99, 59)",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography color="rgba(103, 99, 59)" noWrap component="div">
              <Typography variant="caption">Welcome Back!</Typography>
              <SubHeader sx={{ mt: -1 }}>{ucfirst(username)}</SubHeader>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {listGenerator(isManager as boolean).map((text, index) => (
              <MyListItem
                uniqueText={text}
                key={text}
                open={open}
                ListItemMainIcon={
                  firstListIconsGen(isManager as boolean)[index]
                }
              />
            ))}
          </List>
          <Divider />
          <List>
            <MyListItem
              uniqueText="Home"
              open={open}
              ListItemMainIcon={<Home />}
            />
            <MyListItem
              uniqueText="Logout"
              open={open}
              ListItemMainIcon={<Logout />}
              notNav={true}
              handleClick={handleLogout}
              color="gray"
            />
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Box sx={{ position: "relative" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <MySnackbar />
      <MyAlert />
    </>
  );
}
