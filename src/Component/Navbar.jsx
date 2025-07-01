import { NavLink } from "react-router";
import Icon from "./Icon";
import useAuthStore from "./store/auth-store";
import { useShallow } from "zustand/shallow";
import { useState, useRef } from "react";
import useCloseOutside from "../Hook/useCloseOutside";
import { resetBalance } from "../utils/firebaseApi";
import { toast } from "react-toastify";
import LoadingEffectV2 from "./LoadingEffectV2";
const activeClass = ({ isActive }) => {
  return isActive ? "linkIsActive" : "";
};
export const Navbar = () => {
  const { user, logout, cart, setUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
      cart: state.cart,
      setUser: state.setUser,
    }))
  );
  //另一種做法
  //   const user = useAuthStore((state) => state.user);
  // const logout = useAuthStore((state) => state.logout);
  // const cart = useAuthStore((state) => state.cart);
  // const isAuth = useAuthStore((state) => state.isAuth);
  const [loading, setLoading] = useState(false);
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

  const handleResetBalance = async () => {
    try {
      setLoading(true);
      const res = await resetBalance();
      toast.success("餘額重置成功", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      setUser({ ...user, balance: 9999 });
    } catch (error) {
      toast.error("餘額重置失敗", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="icon-arrow-rotate">
                    <div
                      className={`arrow-rotate ${!infoShow ? "" : "rotate"}`}
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
                    <li onClick={handleResetBalance}>
                      <div className="userInfo-reset-group">
                        <div className="reset-icon"></div>
                        <div className="reset-balance-txt">重置餘額</div>
                      </div>
                    </li>
                    <li onClick={logout}>
                      <div className="userInfo-logout-group">
                        <div className="logout-icon"></div>
                        <div className="logout-txt">登出</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <NavLink to="/auth" className="navbar-menu-items">
              <div className="navbar-menu-txt">註冊/登入</div>
            </NavLink>
          )}
        </div>
      </div>
      <div>
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </nav>
  );
};
