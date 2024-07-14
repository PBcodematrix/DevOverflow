import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
interface Props {
  _id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  // const [Ishovering, setIshovering] = useState(false);
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
      <Badge
        className="subtle-medium  text-light400_light500 relative rounded-md border-none px-4 py-2 uppercase"
        // onMouseEnter={() => {
        //   setIshovering(true);
        // }}
        // onMouseLeave={() => {
        //   setIshovering(false);
        // }}
      >
        {/* <motion.div
          className="background-light500_dark400 absolute  inset-0  z-[-1] rounded-md border-none"
          initial={false}
          animate={{
            opacity:Ishovering?0.4:0.2,
            scale: Ishovering ? 1.06 : 0.99,
          }}
        ></motion.div> */}
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
};

export default RenderTag;
