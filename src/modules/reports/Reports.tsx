import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import WrapperDiv from "../main/components/WrapperDiv";

const Reports: React.FC = () => {
  const [selectPart, setSelectPart] = useState("savings");

  const handleChange = (event: any) => setSelectPart(event.target.value);

  const history = useHistory();
  return (
    <WrapperDiv>
      <select value={selectPart} onChange={handleChange}>
        <option value="savings">Savings</option>
        <option value="investments">Investments</option>
        <option value="spendings">Spendings</option>
      </select>
      <button onClick={() => history.push(`/reports/monthly/${selectPart}`)}>
        Monthly Reports
      </button>
      <br />

      <button onClick={() => history.push(`/reports/summary/${selectPart}`)}>
        Summary
      </button>
    </WrapperDiv>
  );
};

export default Reports;
