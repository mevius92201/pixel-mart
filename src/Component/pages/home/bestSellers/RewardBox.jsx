import Icon from "../../../Icon";
export default function RewardBox({ name, image, price }) {
  return (
    <div className="product-box">
      <img src={image} alt={name} />
      <p className="product-box-product-name">{name}</p>
      <div className="product-price-group">
        <Icon type="CP" />
        <p className="product-box-reward-price">{price}</p>
      </div>
    </div>
  );
}
