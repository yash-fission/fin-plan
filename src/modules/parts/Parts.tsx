import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Details from "./components/Details";
import Table from "./components/Table";
import WrapperDiv from "../main/components/WrapperDiv";
import {
  getTargetData,
  getTransactionTable,
  getMonthBal,
  addTransaction,
  deleteTransaction,
} from "./apiService";
import { TransactionInterface } from "./components/Entry";

interface Params {
  partName: string;
}

const Parts: React.FC = () => {
  const [data, setData] = useState({
    id: "",
    part: "",
    annual: 0,
    month: 0,
    doneAnnual: 0,
  });
  const [table, setTable] = useState([]);
  const [monthBal, setMonthBal] = useState({ balance: 0 });
  let { partName }: Params = useParams();

  useEffect(() => {
    populateData(partName);
  }, [partName]);

  const populateData = async (p?: string) => {
    setData(await getTargetData(partName));
    setTable(await getTransactionTable(partName));
    setMonthBal(await getMonthBal(partName));
  };

  const transactionAdded = (obj: TransactionInterface) => {
    addTransaction(data.id, obj, data);
    populateData();
  };

  const deleteRow = (obj: any) => {
    deleteTransaction(partName, obj, data);
    populateData();
  };

  return (
    <WrapperDiv>
      <h1>
        {`${partName.charAt(0).toUpperCase() + partName.slice(1)} Details`}
      </h1>
      <Details
        data={data}
        month-balance={monthBal.balance}
        transactionAdded={transactionAdded}
      />
      <Table data={table} deleteRow={deleteRow} />
    </WrapperDiv>
  );
};

export default Parts;
