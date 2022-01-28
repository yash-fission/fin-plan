import React from "react";
import { useHistory } from "react-router-dom";
import Entry, { TransactionInterface } from "./Entry";

export interface PartData {
  id: string;
  part: string;
  annual: number;
  month: number;
  doneAnnual: number;
}

interface Props {
  data: PartData;
  "month-balance": number;
  transactionAdded: (obj: TransactionInterface) => void;
}

const Details: React.FC<Props> = (props) => {
  const { data, "month-balance": monthBalance, transactionAdded } = props;

  const history = useHistory();

  const openBalance = () => {
    history.push(`/monthly-balance/${data.id}`);
  };

  return (
    <>
      <div>
        {data.id !== "spendings" ? "Goal" : "Limit"} for the year:{" "}
        <b>
          <span>{data.annual}</span>
        </b>
      </div>
      <div>
        {data.id !== "spendings"
          ? "Pending to acheive the goal"
          : "Limit remainig"}{" "}
        for the year:{" "}
        <b>
          <span>{data.annual - (data.doneAnnual ? data.doneAnnual : 0)}</span>
        </b>
      </div>
      <br />
      <div>
        {data.id !== "spendings"
          ? "Pending to acheive the goal"
          : "Limit remainig"}{" "}
        for the month:{" "}
        <b>
          <span>{monthBalance}</span>
        </b>
        <button onClick={openBalance}>Show Balance Report</button>
      </div>
      <br />
      <h3>Add Entry</h3>
      <Entry
        addEntry={transactionAdded}
        isInvestment={data.id === "investments"}
      />
    </>
  );
};

export default Details;
