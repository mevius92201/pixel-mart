import "../assets/icons/age_limit.png";
const Icon = ({ type }) => {
  return (
    <div
      className={`icon icon-${type}`}
      // style={{
      //   backgroundImage: `url("/src/assets/icons/${type}.png")`,
      // }}
    />
  );
};

export default Icon;
