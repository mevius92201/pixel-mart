import { NavLink } from "react-router";
import Icon from "./Icon";
import useAuthStore from "./store/auth-store";
const activeClass = ({ isActive }) => {
  return isActive ? "linkIsActive" : "";
};
export const Navbar = () => {
  const { user, logout, cart, isAuth } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    cart: state.cart,
    isAuth: state.isAuth,
  }));

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
    // user && (
    //   <div className="navbar-menu-items" key="logout"></div> ),
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
            <div className="navbar-menu-items">
              <div
                className="navbar-menu-txt"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  className="navbar-menu-userInfo-avatar"
                  src={user.avatar}
                  alt={user.email}
                />
                <div className="navbar-menu-userInfo-name">{user.email}</div>
                <Icon type="CP" />
                <div className="navbar-menu-userInfo-balance">
                  {user.balance}
                </div>
                <button className="navbar-menu-txt logout-btn" onClick={logout}>
                  登出
                </button>
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
