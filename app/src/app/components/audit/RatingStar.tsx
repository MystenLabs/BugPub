import { Rating } from "flowbite-react";
import React from "react";

interface Props {
  stars: number;
}

export const RatingStar = ({ stars }: Props) => {
  let str: string;
  let filledStars = [];
  let emptyStars = [];

  if (!stars || stars == 0) {
    str = "0";
  } else {
    str = stars.toFixed(2);
  }
  let numOfStars = Math.floor(stars);

  let count = 0;
  for (let i = 0; i < numOfStars; i++) {
    filledStars.push(<Rating.Star key={count++} />);
  }
  for (let i = 0; i < 5 - numOfStars; i++) {
    emptyStars.push(<Rating.Star key={count++} filled={false} />);
  }

  return (
    <Rating>
      {filledStars}
      {emptyStars}
      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {str} out of 5
      </p>
    </Rating>
  );
};
