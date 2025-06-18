import { useState, useRef } from "react";
import PropTypes from "prop-types";
import useCloseOutside from "../Hook/useCloseOutside";
import "../assets/sort.css";
function SortItems({ sortOptions, onChange, sort }) {
  const [listShow, setListShow] = useState(false);
  const dropdownRef = useRef(null);
  const handleListShow = () => {
    setListShow(!listShow);
  };
  const hideList = () => {
    setListShow(false);
  };
  useCloseOutside(dropdownRef, hideList);

  return (
    <div className="sort-items">
      <div className="sort-items-container">
        <button
          className="sort-items-dropdown"
          ref={dropdownRef}
          type="button"
          onClick={handleListShow}
        >
          <div className="sort-items-txt">排序</div>
          <div className="icon-arrow-rotate">
            <div className={`arrow-rotate ${!listShow ? "" : "rotate"}`}></div>
          </div>
        </button>
        {listShow && (
          <ul className="sort-dropdown-list">
            {sortOptions.map((option) => (
              <li>
                <div
                  key={option.value}
                  className={`sort-items-option ${
                    sort === option ? "active" : ""
                  }`}
                  onClick={() => {
                    if (onChange) {
                      onChange(option);
                    }
                    setListShow(false);
                  }}
                >
                  {option.label}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

SortItems.propTypes = {
  onSortChange: PropTypes.func,
};
export default SortItems;
