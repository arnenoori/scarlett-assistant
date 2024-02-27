import { MdSentimentNeutral, MdCancel, MdCheckCircle } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

const InsightCard = ({
  color,
  text,
  width = "w-64",
  height = "h-8",
  size = 20,
}: {
  color: "positive" | "negative" | "neutral";
  text: string;
  width?: string;
  height?: string;
  size?: number;
}) => {
  const color_dict = {
    positive: "bg-green-200",
    negative: "bg-amber-200",
    neutral: "bg-gray-200",
  };
  return (
    <div
      className={`rounded-lg ${width} ${height} h-fit border boder-solid border-black px-2 flex flex-row items-center ${color_dict[color]} justify-evenly gap-2`}
    >
      <p className="align-middle text-center flex-1 text-ellipsis line-clamp-2">
        {text}
      </p>
      <div className="flex">
        {color == "negative" ? (
          <RiErrorWarningFill color="orange" size={size} />
        ) : color == "positive" ? (
          <MdCheckCircle color="green" size={size} />
        ) : (
          <MdSentimentNeutral size={size} />
        )}
      </div>
    </div>
  );
};

export default InsightCard;
