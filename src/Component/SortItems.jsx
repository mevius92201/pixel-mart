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
        <div className={`sort-dropdown ${!listShow ? "" : "show"}`}>
          <ul className="sort-dropdown-list">
            {sortOptions.map((option) => (
              <li
                className={`sort-item-row ${
                  sort === option.value ? "active" : ""
                }`}
                key={option.value}
                onClick={() => {
                  console.log("你點了排序項目：", option.value);
                  onChange(option.value);
                  setListShow(false);
                }}
              >
                <div className="sort-items-option">{option.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

SortItems.propTypes = {
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default SortItems;
