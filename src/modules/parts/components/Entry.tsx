import React, { useState } from "react";

interface Props {
  isInvestment: boolean;
  addEntry: (obj: TransactionInterface) => void;
}

export interface TransactionInterface {
  id?: string;
  date: string;
  particular: string;
  amount: number;
  type?: string;
}

const Entry: React.FC<Props> = (props) => {
  const [particular, setParticular] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("");

  const addEntry = (event: React.FormEvent) => {
    event.preventDefault();
    let obj: TransactionInterface = {
      date,
      particular,
      amount,
    };
    if (props.isInvestment) {
      obj.type = type;
    }
    props.addEntry(obj);
    setParticular("");
    setAmount(0);
  };

  return (
    <form onSubmit={addEntry}>
      <label>Date: </label>
      <input
        data-test="date-input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label>Particular: </label>
      <input
        data-test="particular-input"
        type="text"
        value={particular}
        onChange={(e) => setParticular(e.target.value)}
      />
      <label>Amount: </label>
      <input
        data-test="amount-input"
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      {props.isInvestment && <label>Type: </label>}
      {props.isInvestment && (
        <select
          style={{ marginRight: "20px" }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Short-Term">Short Term</option>
          <option value="Medium-Term">Medium Term</option>
          <option value="Long-Term">Long Term</option>
        </select>
      )}
      <button type="submit">Add</button>
    </form>
  );
};

export default Entry;
