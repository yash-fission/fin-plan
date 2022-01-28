import React, { useEffect } from "react";

import { getIncomeBreakdown, setMonthlyBal } from "./baseApiService";
import IncomeBreakdown from "./components/income-breakdown";
import "./App.css";

const preloadWhenLazy = (factory: any) => {
  let Component: any = React.lazy(factory);
  Component.preload = factory;
  return Component;
};

const Parts = preloadWhenLazy(() => import("../parts/Parts"));
const MonthlyBalance = preloadWhenLazy(
  () => import("../reports/containers/MonthlyBalance")
);
const Reports = preloadWhenLazy(() => import("../reports/Reports"));
const MonthlyReports = preloadWhenLazy(
  () => import("../reports/containers/MonthlyReports")
);
const SummaryReport = preloadWhenLazy(
  () => import("../reports/containers/SummaryReport")
);

const App: React.FC = () => {
  const [salary, setSalary] = React.useState(
    parseInt(localStorage.getItem("salary") + "") || 0
  );
  const [deduction, setDeduction] = React.useState(
    parseInt(localStorage.getItem("deduction") + "") || 0
  );
  const [tiat, setTiat] = React.useState(
    parseInt(localStorage.getItem("tiat") + "") || 0
  );
  const [tableData, setTableData] = React.useState([]);

  const populateData = async () => {
    const target = await getIncomeBreakdown();
    setTableData(target.incomeBreakdown);
  };

  useEffect(() => {
    setTimeout(() => {
      Parts.preload();
      Reports.preload();
      MonthlyBalance.preload();
      MonthlyReports.preload();
      SummaryReport.preload();
    }, 5000);
    populateData();
  }, []);

  const calculate = () => {
    let netSalary: number = salary - 21600 - 2500;
    let incomeAfterHRA: number = Math.round(netSalary * 0.84);
    let tax = 0;
    if (incomeAfterHRA > 500000) {
      let taxableIncome: number = incomeAfterHRA - 200000;
      taxableIncome -= deduction;
      tax += 12500;
      if (taxableIncome > 500000) {
        let slab = taxableIncome - 500000;
        slab = slab > 500000 ? 500000 : slab;
        tax += slab * 0.2;
      }
      if (taxableIncome > 1000000) {
        let slab = taxableIncome - 1000000;
        tax += slab * 0.3;
      }
    }
    let amount = netSalary - Math.round(tax);
    setMonthlyBal(amount, tableData);
    populateData();
    setTiat(amount);
    localStorage.setItem("tiat", amount + "");
    localStorage.setItem("salary", salary + "");
    localStorage.setItem("deduction", deduction + "");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <span>Total CTC: </span>
          {
            //@ts-ignore
            <input
              type="text"
              value={salary}
              name="ctc"
              data-test="salary-input"
              onChange={(e) => setSalary(parseInt(e.target.value))}
            />
          }
        </div>
        <div>
          <span>Extra Deductions: </span>
          <input
            value={deduction}
            name="deduction"
            data-test="extra-deduction"
            onChange={(e) => setDeduction(parseInt(e.target.value))}
          />
        </div>
        <button
          disabled={salary ? false : true}
          data-test="calculate-button"
          onClick={calculate}
        >
          Calculate
        </button>
        <div>
          <span>Total Income After Tax: </span>
          <span data-test="tiat-annual">{tiat}Rs.</span>
        </div>
        <div>
          <span>Total Income After Tax: </span>
          <span data-test="tiat-month">{Math.round(tiat / 12)}Rs.</span>/months
        </div>
        <IncomeBreakdown tableData={tableData} />
      </header>
    </div>
  );
};

export default App;
