import React from "react";
import Delete from "./../../../delete.svg";
import { TransactionInterface } from "./Entry";

interface Props {
  data: Array<TransactionInterface>;
  deleteRow: (row: TransactionInterface) => void;
}

const Table: React.FC<Props> = (props) => {
  let columns = ["Date", "Particulars", "Amount"];
  let columnKeys: Array<string> = [];

  const renderColumns = () => {
    if (props.data.length) {
      columnKeys = Object.keys(props.data[0]).slice(2);
      columns = columnKeys.map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      );
    }
    return columns.map((col, index) => <th key={index}>{col}</th>);
  };

  const renderData = () => {
    return props.data.map((row) => (
      <tr key={row.id}>
        {columnKeys.map((key, index) => (
          <td key={`${row.id}-${index}`}>
            {row[key as keyof TransactionInterface]}
          </td>
        ))}
        <td>
          <img
            alt="delete icon"
            src={Delete}
            onClick={() => props.deleteRow(row)}
          ></img>
        </td>
      </tr>
    ));
  };

  return (
    <table className="table-layout">
      <thead>
        <tr>
          {renderColumns()}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{renderData()}</tbody>
    </table>
  );
};

export default Table;
