import Icon from "./Icon";

function SearchBar() {
  return (
    <div className="searchBar">
      <div className="searchBar-container">
        <input
          type="search"
          className="productSearch"
          placeholder="Search product"
        />
        <Icon type="search" />
        <div>
          <button type="button" className="product-search_btn">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
export default SearchBar;
