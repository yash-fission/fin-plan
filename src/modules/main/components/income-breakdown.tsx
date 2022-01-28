import React from "react";
import { useHistory } from "react-router-dom";

interface IncomeBreakdownInterface {
  id: string;
  part: string;
  annual: number;
  done_annual: number;
  month: number;
}

interface Props {
  tableData: Array<IncomeBreakdownInterface>;
}

const IncomeBreakdown: React.FC<Props> = ({ tableData }: Props) => {
  const history = useHistory();

  const openDetails = (index: string) => {
    history.push(`/${index}`);
  };

  return (
    <div>
      <h3>Distribution of the Salary</h3>
      <table data-test="table">
        <thead>
          <tr>
            <th>Parts</th>
            <th>Annual</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody data-test="tbody">
          {tableData.map((data: IncomeBreakdownInterface) => (
            <tr key={data.id} onClick={() => openDetails(data.id)}>
              <td>{data.part}</td>
              <td>{data.annual}</td>
              <td>{data.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(IncomeBreakdown);
