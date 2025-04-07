import { NavLink } from "react-router";
import Icon from "./Icon";
import useAuthStore from "./store/auth-store";
import { useShallow } from "zustand/shallow";
import { useState, useRef } from "react";
import useCloseOutside from "../Hook/useCloseOutside";
const activeClass = ({ isActive }) => {
  return isActive ? "linkIsActive" : "";
};
export const Navbar = () => {
  const { user, logout, cart } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
      cart: state.cart,
    }))
  );
  //另一種做法
  //   const user = useAuthStore((state) => state.user);
  // const logout = useAuthStore((state) => state.logout);
  // const cart = useAuthStore((state) => state.cart);
  // const isAuth = useAuthStore((state) => state.isAuth);

  const [infoShow, setInfoShow] = useState(false);
  const handleInfoShow = () => {
    setInfoShow(!infoShow);
  };
  const dropdownRef = useRef(null);
  const hideInfo = () => {
    setInfoShow(false);
  };
  useCloseOutside(dropdownRef, hideInfo);

  const cartIcon = <Icon type="shopping_cart" />;
  const navbarMenuItems = [
    { to: "", menu: "首頁" },
    { to: "/news", menu: "最新消息" },
    { to: "/products", menu: "商品" },
    { to: "/support", menu: "幫助中心" },
    {
      to: "/cart",
      menu: cart.length > 0 ? `${cartIcon}(${cart.length})` : cartIcon,
    },
  ];
  console.log(user);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left-group">
          <Icon type="logo" />
          <div className="download-btns-container">
            <Icon type="btn_appStore" />
            <Icon type="btn_googlePlay" />
          </div>
        </div>
        <div className="navbar-menu">
          {navbarMenuItems.map((navbarMenuItem) => (
            <div className="navbar-menu-items" key={navbarMenuItem.to}>
              <div className="navbar-menu-txt">
                <NavLink to={navbarMenuItem.to} className={activeClass}>
                  {navbarMenuItem.menu}
                </NavLink>
              </div>
            </div>
          ))}
          {user ? (
            <div className="navbar-menu-items" ref={dropdownRef}>
              <div className="navbar-menu-txt" onClick={handleInfoShow}>
                <img
                  className="navbar-menu-userInfo-avatar"
                  src={user.avatar}
                  alt={user.email}
                />
                <div className="navbar-menu-userInfo">
                  <div
                    className={`navbar-menu-userInfo-name ${
                      !infoShow ? "" : "rotate"
                    }`}
                  >
                    {user.email}
                  </div>
                  <div className="navbar-menu-userInfo-btn_group">
                    <div
                      className={`navbar-menu-userInfo-btn ${
                        !infoShow ? "" : "rotate"
                      }`}
                    ></div>
                  </div>
                </div>
                <div className={`userInfo-dropdown ${!infoShow ? "" : "show"}`}>
                  <ul className="userInfo-dropdown-list">
                    <li>
                      <div className="userInfo-CP-group">
                        <Icon type="CP" />
                        <span className="navbar-menu-userInfo-balance">
                          {user.balance}{" "}
                        </span>
                      </div>
                    </li>
                    <li>
                      <button
                        className="navbar-menu-txt logout-btn"
                        onClick={logout}
                      >
                        登出
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <NavLink to="/auth" className="navbar-menu-items">
              註冊/登入
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};
