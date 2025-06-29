import rewardData from "../../../data/productData.json";
import RewardBox from "./RewardBox";
import { useEffect, useState } from "react";
const getRandomRewards = (data, n = 3) => {
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

export default function RewardList() {
  const [randomRewards, setRandomRewards] = useState([]);

  useEffect(() => {
    setRandomRewards(getRandomRewards(rewardData));
  }, []);

  return (
    <div className="reward-list">
      {randomRewards.map((reward) => (
        <RewardBox key={reward.id} {...reward} />
      ))}
    </div>
  );
}
