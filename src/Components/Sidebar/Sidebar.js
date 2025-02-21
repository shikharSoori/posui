import { useState } from "react";
import { IoMenu } from "react-icons/io5";

import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { logout } from "../../Redux/Auth/thunk";
import { setCollapsed } from "../../Redux/Layout/layoutSlice";
import { setSystemSelected } from "../../Redux/SystemSelection/systemSelectionSlice";
import getCookie from "../../Utils/Cookies/getCookie";
import logo from "../../assets/nmb-logo.webp";
import { errorFunction, successFunction } from "../Alert/Alert";
import { admin, sidebarData } from "./SidebarData";
import "./sidebar.css";

const CrmSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);
  const { collapsed } = useSelector((state) => state.layout);

  const [toggled] = useState(false);
  const [disablePointerEvents, setDisablePointerEvents] = useState(false);
  const userName = useSelector((state) => state.auth.userName);
  const capitalizedUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);
  const photo = useSelector((state) => state.auth.photo);
  const [open, setOpen] = useState();
  const [childMenuOpen, setChildMenuOpen] = useState();

  const handleOpenSubMenu = (key) => {
    if (open === key) {
      setOpen(undefined);
    } else {
      setOpen(key);
    }
  };
  const handleChildMenuOpen = (key) => {
    if (childMenuOpen === key) {
      setChildMenuOpen(undefined);
    } else {
      setChildMenuOpen(key);
    }
  };
  const handleMenuClick = () => {
    // Disable pointer events
    setDisablePointerEvents(true);
    // Enable pointer events after 750 milliseconds
    setTimeout(() => {
      setDisablePointerEvents(false);
    }, 750);
    // Your existing logic for handling menu click
    // ...userPermissions
  };
  const dispatch = useDispatch();
  const permissionApi = useSelector((state) => state.auth.permissions);
  const menuItemStyles = {
    root: {
      fontSize: "14px",
      fontWeight: 400,
      transition: "all 0.3s ease-out",
    },
    icon: {
      margin: "0px",
    },

    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },

    button: ({ level }) => {
      if (level === 0)
        return {
          padding: "0px 10px 0 0 ",
          "&:hover": {
            backgroundColor: "var(--blue-primary)",
            color: "white !important",
            borderRadius: "10px",
            transition: "all 0.3s ease-in",
          },
        };
      if (level === 1)
        return {
          color: "rgba(36, 34, 32, 0.86)",
          height: "max-content",
          "&:hover": {
            backgroundColor: "var(--blue-primary)",
            color: "white !important",
            marginLeft: collapsed ? "0px" : "20px",
            borderRadius: collapsed ? "5px" : "10px",
            transition: "all 0.3s ease-in",
          },
        };
      if (level === 2)
        return {
          color: "rgba(36, 34, 32, 0.56)",
          marginLeft: "10px",
          height: "50px",
          "&:hover": {
            backgroundColor: "var(--blue-primary)",
            color: "white !important",
            marginLeft: collapsed ? "0px" : "20px",
            borderRadius: collapsed ? "5px" : "10px",
            transition: "all 0.3s ease-in",
          },
        };
    },

    label: ({ level }) => {
      if (level === 0)
        return {
          padding: "15px",
        };
      if (level === 1)
        return {
          padding: collapsed ? "10px 5px" : " 10px 20px",
          "&:hover": {
            padding: collapsed ? "10px 0px" : "10px 0px",
          },
        };
    },
  };
  return (
    <>
      <div className="d-flex flex-column" style={{ position: "relative", height: "100vh" }}>
        <div className="sidebar-header d-flex justify-content-between">
          <Link to="/">{collapsed ? "" : <img alt="logo" src={logo} width={95} style={{ position: "relative" }} />}</Link>
          <button
            className={"collapse-btn"}
            onClick={() => {
              dispatch(setCollapsed());
            }}
          >
            <IoMenu size={25} />
          </button>
        </div>

        <Sidebar
          collapsedWidth="20px"
          className="sidebar h-100"
          collapsed={collapsed}
          toggled={toggled}
          breakPoint="md"
          transitionDuration={500}
          rootStyles={{
            overflow: "auto",
            backgroundColor: "white",
            padding: "10px",
            [`.ps-sidebar-container`]: {
              backgroundColor: "white",
            },
          }}
        >
          <div className="d-flex flex-column h-100 justify-content-between ">
            <div className="">
              <div className={`sidebar-section-title ${collapsed ? "text-center" : "text-left"}`}>Main</div>
              <Menu menuItemStyles={menuItemStyles} transitionDuration={750}>
                {sidebarData.map((side) => {
                  const { menu, sub_menu, icon, link, permissions } = side;
                  const showMenu = permissions?.some((element) => permissionApi?.indexOf(element) !== -1);

                  return sub_menu ? (
                    <SubMenu key={menu} label={menu} icon={icon}>
                      {sub_menu.map((sub) => {
                        const { link, name, permissions } = sub;
                        const showMenu = permissions?.some((element) => permissionApi?.indexOf(element) !== -1);
                        return showMenu || isSuperuser ? (
                          <MenuItem active={location?.pathname === link} component={<Link to={link} />} key={name}>
                            {name}
                          </MenuItem>
                        ) : null;
                      })}
                    </SubMenu>
                  ) : showMenu || isSuperuser ? (
                    <MenuItem active={location?.pathname === link} component={<Link to={link} />} key={menu} icon={icon}>
                      {menu}
                    </MenuItem>
                  ) : null;
                })}
              </Menu>
            </div>

            <div>
              <div className={`sidebar-section-title ${collapsed ? "text-center" : "text-left"}`}>Setup</div>

              <Menu menuItemStyles={menuItemStyles} onClick={handleMenuClick} transitionDuration={750}>
                {admin?.map((side, i) => {
                  const { menu, sub_menu, icon, link, permission } = side;
                  const showMenu = permission?.some((element) => permissionApi?.indexOf(element) !== -1);
                  return (
                    <div key={i}>
                      <>
                        {sub_menu || isSuperuser ? (
                          <>
                            {
                              <SubMenu onClick={() => handleOpenSubMenu("hello")} open={open === "hello"} key={i + 1} label={menu} icon={icon}>
                                {sub_menu.map((sub, j) => {
                                  const { link, name, permissions, child_menu, key } = sub;
                                  const showSubMenu = permissions?.some((element) => permissionApi?.indexOf(element) !== -1);
                                  const settingPermission = showSubMenu || isSuperuser;
                                  return child_menu
                                    ? settingPermission && (
                                        <SubMenu onClick={() => handleChildMenuOpen(key)} open={childMenuOpen === key} label={name} key={j + 1}>
                                          {child_menu.map((child, k) => {
                                            const { link, name, permissions } = child;
                                            const showChildMenu = permissions?.some((element) => permissionApi?.indexOf(element) !== -1);
                                            return showChildMenu || isSuperuser ? (
                                              <MenuItem active={location?.pathname === link} component={<Link to={link} />} key={k}>
                                                {name}
                                              </MenuItem>
                                            ) : null;
                                          })}
                                        </SubMenu>
                                      )
                                    : settingPermission && (
                                        <MenuItem active={location?.pathname === link} component={<Link to={link} />} key={j + 1}>
                                          {name}
                                        </MenuItem>
                                      );
                                })}
                              </SubMenu>
                            }
                          </>
                        ) : showMenu || isSuperuser ? (
                          <MenuItem active={location?.pathname === link} component={<Link to={link} />} key={menu} icon={icon}>
                            {menu}
                          </MenuItem>
                        ) : null}
                      </>
                    </div>
                  );
                })}
              </Menu>

              <Menu menuItemStyles={menuItemStyles} onClick={handleMenuClick} transitionDuration={750}>
                {!collapsed && (
                  <SubMenu onClick={() => handleOpenSubMenu("user")} open={open === "user"} label={capitalizedUserName} icon={photo ? <img src={photo} height={20} /> : ""}>
                    <MenuItem
                      style={{
                        pointerEvents: disablePointerEvents ? "none" : "auto",
                      }}
                      onClick={() => {
                        const token = getCookie("refreshToken");
                        if (token) {
                          dispatch(logout(token))
                            .unwrap()
                            .then(() => {
                              successFunction("Logged out successfully.");
                              dispatch(setSystemSelected(""));

                              history.push("/");
                            })
                            .catch(() => errorFunction("Failed to logout."));
                        }
                      }}
                    >
                      Logout
                    </MenuItem>
                  </SubMenu>
                )}
              </Menu>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
};

export default CrmSidebar;
