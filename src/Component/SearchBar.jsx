import Icon from "./Icon";
import { useState } from "react";
function SearchBar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
      // setSearchValue("");
    }
  };
  return (
    <div className="searchBar">
      <div className="searchBar-container">
        <label htmlFor="productSearch" className="visually-hidden">
          Search Product
        </label>
        <input
          type="search"
          className="productSearch"
          placeholder="Search product"
          id="productSearch"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (e.target.value === "" && onSearch) {
              onSearch("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Icon type="search" />
        <div>
          <button
            type="button"
            className="product-search_btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
export default SearchBar;
