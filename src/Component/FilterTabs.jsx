import PropTypes from "prop-types";
const FilterTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="category-tabs">
      <div className="category-container">
        <div className="category-list">
          {tabs.map((category) => (
            <div
              key={category}
              className={`category-item ${
                activeTab === category ? "active" : ""
              }`}
              onClick={() => onChange(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
FilterTabs.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
export default FilterTabs;
