import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillXCircleFill } from "react-icons/bs";

const Status = ({ active }) => {
  return (
    <div>
      {active ? (
        <FaCheckCircle style={{ color: "#198754", fontSize: "1.2rem" }} />
      ) : (
        <BsFillXCircleFill
          style={{
            color: "#BF202F",
            fontSize: "1.2rem",
          }}
        />
      )}
    </div>
  );
};

export default Status;
