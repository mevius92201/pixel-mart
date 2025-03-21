import { NavLink } from "react-router";
import Icon from "./Icon";
const activeClass = ({ isActive }) => {
  return isActive ? "linkIsActive" : "";
};
export const Navbar = () => {
  const cartIcon = <Icon type="shopping_cart" />;
  const navbarMenuItems = [
    { to: "", menu: "首頁" },
    { to: "/news", menu: "最新消息" },
    { to: "/products", menu: "商品" },
    { to: "/support", menu: "幫助中心" },
    { to: "/admin_login", menu: "註冊/登入" },
    { to: "/cart", menu: cartIcon },
  ];
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
        </div>
      </div>
    </nav>
  );
};
