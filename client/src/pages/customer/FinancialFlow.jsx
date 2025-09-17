import React, { useState, useEffect } from "react";
import FullPayment from "./FullPayment";
import PaymentCalculator from "./PaymentCalculator";

import { useParams } from "react-router-dom";

const FinanceFlow = () => {
  const { carId, type } = useParams(); // now you have both

  if (type === "full") {
    return <FullPayment carId={carId} />;
  }

  return <PaymentCalculator carId={carId} />;
};

export default FinanceFlow;
