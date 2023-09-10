import axios from "axios";
import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

type InStockProps = {
  id?: string;
  availability: boolean;
};

const InStock = ({ availability, id }: InStockProps) => {
  const [currentAvailability, setCurrentAvailability] =
    useState<boolean>(availability);
  const addToStock = async (): Promise<any> => {
    const newInStockValue = true;

    try {
      const response = await axios.post("api/availability/toggleStock", {
        id: id,
        inStock: newInStockValue,
      });
      setCurrentAvailability(true);
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const removeFromStock = async (): Promise<any> => {
    const newInStockValue = false;

    try {
      const response = await axios.post("api/availability/toggleStock", {
        id: id,
        inStock: newInStockValue,
      });
      setCurrentAvailability(false);
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex gap-4">
      <button
        className={`${
          currentAvailability ? "bg-white" : "bg-white/20"
        } rounded-full sm:p-4 p-2 ease-linear transition hover:scale-125`}
        onClick={addToStock}>
        <AiOutlineCheck className="text-black cursor-pointer" />
      </button>
      <button
        className={`${
          currentAvailability ? "bg-white/20" : "bg-white"
        } rounded-full sm:p-4 p-2 ease-linear transition hover:scale-125`}
        onClick={removeFromStock}>
        <AiOutlineClose className="text-black cursor-pointer" />
      </button>
    </div>
  );
};

export default InStock;
