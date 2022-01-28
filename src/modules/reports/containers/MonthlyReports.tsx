import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import WrapperDiv from "../../main/components/WrapperDiv";
import { getAllMonthsReport } from "../reportService";
import "./../reports.css";

export interface Transaction {
  date: string;
  particulars: string;
  amount: number;
}

interface MonthlyReport {
  month: string;
  monthTransactions: Array<Transaction>;
  done: number;
  balance: number;
}

const MonthlyReports: React.FC = () => {
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  let { partName }: { partName: string } = useParams();

  useEffect(() => {
    async function settingData() {
      const res = await getAllMonthsReport(partName);
      setData(res);
      setXAxis(res.map((item: MonthlyReport) => item.month));
      setYAxis(res.map((item: MonthlyReport) => item.done));
    }
    settingData();
  }, [partName]);

  const renderAccordionButton = (monthDetails: MonthlyReport) => (
    <div className="accordion-button heading">
      <span>{monthDetails.month}</span>
      <span>{monthDetails.balance}</span>
      <span>{monthDetails.done}</span>
    </div>
  );

  const populateMonths = () => {
    return data.map((item: MonthlyReport, i: number) => (
      <AccordionItem key={i}>
        <AccordionItemHeading>
          <AccordionItemButton>
            {renderAccordionButton(item)}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          {item.monthTransactions.length && (
            <TableInAccordion
              key={item.monthTransactions.length}
              transactions={item.monthTransactions}
            />
          )}
        </AccordionItemPanel>
      </AccordionItem>
    ));
  };

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "My chart",
    },
    xAxis: {
      categories: xAxis,
    },
    series: [
      {
        data: yAxis,
      },
    ],
  };

  return (
    <WrapperDiv>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <Accordion allowZeroExpanded={true}>
        <div className="heading">
          <span>Month</span>
          <span>Expected</span>
          <span>Amount done</span>
        </div>
        {React.useMemo(populateMonths, [data])}
      </Accordion>
    </WrapperDiv>
  );
};

export default MonthlyReports;

interface Props {
  transactions: Array<Transaction>;
}

const TableInAccordion = ({ transactions }: Props) => {
  const renderTableRows = (rows: Array<Transaction>) => {
    return rows.map((row, index) => (
      <tr key={index}>
        {Object.keys(row).map((key, idx) => (
          <td key={`${idx}`}>{row[key as keyof Transaction]}</td>
        ))}
      </tr>
    ));
  };

  return (
    <table className="table-layout">
      <thead>
        <tr>
          <th>Date</th>
          <th>Particulars</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>{transactions.length && renderTableRows(transactions)}</tbody>
    </table>
  );
};
