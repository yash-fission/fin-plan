import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { getTransactionTable } from "../../parts/apiService";
import WrapperDiv from "../../main/components/WrapperDiv";
import { capitalize } from "../../main/baseApiService";
import { isSimilar } from "../reportService";
import { Transaction } from "./MonthlyReports";

const MonthlyBalance: React.FC = () => {
  const [data, setData] = useState([]);
  const [reportData, setReportData] = useState({});
  const [monthArray, setMonthArray] = useState([""]);
  let { partName }: { partName: string } = useParams();

  useEffect(() => {
    async function addData() {
      setData(await getTransactionTable(partName));
    }
    addData();
  }, [partName]);

  const summarizeData = () => {
    let json: any = {};
    let arr: Array<string> = [];
    data.forEach((row: Transaction) => {
      let month = row.date.split("-")[1];
      if (arr.indexOf(month) === -1) {
        arr.push(month);
      }
      let key = capitalize(row.particulars);
      if (!json[key]) {
        let res = Object.keys(json).find((item) => isSimilar(item, key));
        if (!res) {
          json[key] = 0;
        } else {
          key = res;
        }
      }
      json[key] += row.amount;
    });
    setMonthArray(arr);
    setReportData(json);
  };

  useEffect(summarizeData, [data]);

  const renderData = () => {
    return Object.keys(reportData).map((key) => {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>
            {
              //@ts-ignore
              reportData[key]
            }
          </td>
          <td>
            {
              //@ts-ignore
              parseInt(reportData[key] / monthArray.length)
            }
          </td>
        </tr>
      );
    });
  };

  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "My chart",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        data: Object.keys(reportData).map((key) => {
          //@ts-ignore
          return [key, reportData[key]];
        }),
      },
    ],
  };

  return (
    <WrapperDiv>
      <h1>{`${capitalize(partName)}`} Summary</h1>

      <HighchartsReact highcharts={Highcharts} options={options} />

      <table className="table-layout">
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>{data.length && renderData()}</tbody>
      </table>
    </WrapperDiv>
  );
};

export default MonthlyBalance;
