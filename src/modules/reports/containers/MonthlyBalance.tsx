import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getAllMonthBalance } from "../reportService";
import WrapperDiv from "../../main/components/WrapperDiv";

interface MonthBalanceInterface {
  id: number;
  month: string;
  balance: number;
  done: number;
}

const MonthlyBalance: React.FC = () => {
  const [data, setData] = useState([]);
  let { partName }: { partName: string } = useParams();

  const populateData = useCallback(async () => {
    setData(await getAllMonthBalance(partName));
  }, [partName]);

  useEffect(() => {
    populateData();
  }, [populateData]);

  const renderData = () => {
    const columnKeys = Object.keys(data[0]).slice(1);
    return data.map((row: MonthBalanceInterface) => (
      <tr key={row.id}>
        {columnKeys.map((key, index) => (
          <td key={`${row.id}-${index}`}>
            {row[key as keyof MonthBalanceInterface]}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <WrapperDiv>
      <h1>
        {`${partName.charAt(0).toUpperCase() + partName.slice(1)}`} Monthly
        Balance
      </h1>
      <table className="table-layout">
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>{data.length && renderData()}</tbody>
      </table>
    </WrapperDiv>
  );
};

export default MonthlyBalance;
