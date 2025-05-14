const Icon = ({ type, style }) => {
  return (
    <div
      className={`icon icon-${type}`}
      style={style}
      // style={{
      //   backgroundImage: `url("/src/assets/icons/${type}.png")`,
      // }}
    />
  );
};

export default Icon;
