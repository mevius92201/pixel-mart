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
        <input
          type="search"
          className="productSearch"
          placeholder="Search product"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
