import { FC, lazy, useEffect, useState } from "react";

import { getIncomeBreakdown, setMonthlyBal } from "./baseApiService";
import IncomeBreakdown from "./components/IncomeBreakdown/IncomeBreakdown";
import "./App.css";
import Login from "./components/Login/Login";

const preloadWhenLazy = (factory: any) => {
  let Component: any = lazy(factory);
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

const App: FC = () => {
  const [salary, setSalary] = useState(
    parseInt(localStorage.getItem("salary") + "") || 0
  );
  const [deduction, setDeduction] = useState(
    parseInt(localStorage.getItem("deduction") + "") || 0
  );
  const [tiat, setTiat] = useState(
    parseInt(localStorage.getItem("tiat") + "") || 0
  );
  const [tableData, setTableData] = useState([]);

  const [isCalculated, setIsCalculated] = useState(false);

  const [isMetro, setIsMetro] = useState(false);

  const [breakdownDetails, setBreakdownDetails] = useState({
    hra: 0,
    "80c": 150000,
    nps: 50000,
  });

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

  useEffect(() => {
    if (salary) {
      let hraPercent = isMetro ? 0.25 : 0.2;
      let hra = Math.round(salary * hraPercent);
      setBreakdownDetails({ ...breakdownDetails, hra });
    }
  }, [isMetro]);

  const calculate = () => {
    setIsCalculated(true);
    if (salary <= 500000) {
      setTiat(salary);
      setBreakdownDetails({ hra: 0, nps: 0, "80c": 0 });
      setDeduction(0);
      return;
    }
    let netSalary: number = salary - 21600 - 2500;
    let hraPercent = isMetro ? 0.25 : 0.2;
    let hra = Math.round(salary * hraPercent);
    let incomeAfterHRA: number = netSalary - hra;
    let tax = 0;
    if (incomeAfterHRA > 500000) {
      let taxableIncome: number =
        incomeAfterHRA - breakdownDetails["80c"] - breakdownDetails.nps - 50000;
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
    let cess = Math.round(tax * 0.04);
    let amount = netSalary - 21600 - Math.round(tax) - cess;
    setMonthlyBal(amount, tableData);
    populateData();
    setTiat(amount);
    setBreakdownDetails({ ...breakdownDetails, hra });
    localStorage.setItem("tiat", amount + "");
    localStorage.setItem("salary", salary + "");
    localStorage.setItem("deduction", deduction + "");
  };

  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <div className="app-heading">Your Financial Planner</div>
      <div className="container">
        <div className="left-panel">
          <div className="ctc">
            <div className="input-wrapper">
              <span className="label">Enter your CTC: </span>
              <div className="input-box">
                {
                  //@ts-ignore
                  <input
                    type="number"
                    value={salary}
                    name="ctc"
                    data-test="salary-input"
                    onChange={(e) => setSalary(parseInt(e.target.value))}
                  />
                }
                <span data-test="tiat-annual">Rs.</span>
              </div>
            </div>

            <div className="button-wrapper">
              <button
                disabled={salary ? false : true}
                data-test="calculate-button"
                className="success"
                onClick={calculate}
              >
                Calculate
              </button>
            </div>
          </div>
          {isCalculated && (
            <>
              <div className="input-wrapper">
                <span className="label">Total Income After Tax: </span>
                <span className="label" data-test="tiat-annual">
                  {tiat}Rs.
                </span>
              </div>
              <div className="input-wrapper">
                <span className="label">Monthly Income After Tax: </span>
                <span className="label" data-test="tiat-annual">
                  {Math.round(tiat / 12)}Rs.
                </span>
              </div>
              <Login tableData={tableData} />
              <IncomeBreakdown tableData={tableData} />
            </>
          )}
        </div>
        {isCalculated && (
          <div className="right-panel">
            <div className="input-wrapper">
              <span className="label">HRA: </span>
              <div className="hra">
                <div className="hra-radio-wrapper">
                  <div>
                    <input
                      type="radio"
                      id="metro"
                      checked={isMetro}
                      onChange={(e) => setIsMetro(e.target.checked)}
                    />
                    <label htmlFor="metro">Metro</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="non_metro"
                      checked={!isMetro}
                      onChange={(e) => setIsMetro(!e.target.checked)}
                    />
                    <label htmlFor="non_metro">Non-Metro</label>
                  </div>
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    value={breakdownDetails.hra}
                    onChange={(e) =>
                      setBreakdownDetails({
                        ...breakdownDetails,
                        hra: parseInt(e.target.value),
                      })
                    }
                  />
                  <span data-test="tiat-annual">Rs.</span>
                </div>
              </div>
            </div>
            <div className="input-wrapper">
              <span className="label">80C: </span>
              <div className="input-box">
                <input
                  type="text"
                  value={breakdownDetails["80c"]}
                  onChange={(e) =>
                    setBreakdownDetails({
                      ...breakdownDetails,
                      "80c": parseInt(e.target.value),
                    })
                  }
                />
                <span data-test="tiat-annual">Rs.</span>
              </div>
            </div>
            <div className="input-wrapper">
              <span className="label">NPS: </span>
              <div className="input-box">
                <input
                  type="text"
                  value={breakdownDetails.nps}
                  onChange={(e) =>
                    setBreakdownDetails({
                      ...breakdownDetails,
                      nps: parseInt(e.target.value),
                    })
                  }
                />
                <span data-test="tiat-annual">Rs.</span>
              </div>
            </div>
            <div className="input-wrapper">
              <span className="label">Extra Deductions: </span>
              <div className="input-box">
                <input
                  type="text"
                  value={deduction}
                  name="deduction"
                  data-test="extra-deduction"
                  onChange={(e) => setDeduction(parseInt(e.target.value))}
                />
                <span data-test="tiat-annual">Rs.</span>
              </div>
            </div>
            <div className="button-wrapper">
              <button
                disabled={salary ? false : true}
                data-test="calculate-button"
                className="primary"
                onClick={calculate}
              >
                Re-Calculate
              </button>
            </div>
          </div>
        )}
        {/* </header> */}
      </div>
    </div>
  );
};

export default App;
