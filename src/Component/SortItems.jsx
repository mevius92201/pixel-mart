import { useState, useRef } from "react";
import PropTypes from "prop-types";
import useCloseOutside from "../Hook/useCloseOutside";
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
          type="button"
          className="sort-items-btn"
          onClick={handleListShow}
        >
          排序
        </button>
        {listShow && (
          <div className="sort-items-dropdown" ref={dropdownRef}>
            <ul className="sort-items-list">
              {sortOptions.map((option) => (
                <li>
                  <div
                    key={option}
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
                    {option}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

SortItems.propTypes = {
  onSortChange: PropTypes.func,
};
export default SortItems;
