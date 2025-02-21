import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const ListingSkeleton = () => {
  const [skeletonCount, setSkeletonCount] = useState(4);

  useEffect(() => {
    if (Number(window.innerWidth) >= 1800) {
      setSkeletonCount(5);
    } else {
      setSkeletonCount(4);
    }
  }, []);

  return (
    <>
      <div className="p-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          {new Array(skeletonCount).fill(<Skeleton width={270} height={30} />).map((val, i) => (
            <React.Fragment key={i + 1}>{val}</React.Fragment>
          ))}
        </div>
        <Skeleton count={5} height={25} />
      </div>
    </>
  );
};

export default ListingSkeleton;
