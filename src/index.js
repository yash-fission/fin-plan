import "./wdyr";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import "./index.css";
import App from "./modules/main/App";
import reportWebVitals from "./reportWebVitals";
const Parts = React.lazy(() => import("./modules/parts/Parts"));
const MonthlyBalance = React.lazy(() =>
  import("./modules/reports/containers/MonthlyBalance")
);
const Reports = React.lazy(() => import("./modules/reports/Reports"));
const MonthlyReports = React.lazy(() =>
  import("./modules/reports/containers/MonthlyReports")
);
const SummaryReport = React.lazy(() =>
  import("./modules/reports/containers/SummaryReport")
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <nav className="nav-style">
        <Link to="/">Home</Link>
        <Link to="/savings">Savings</Link>
        <Link to="/investments">Investments</Link>
        <Link to="/spendings">Spendings</Link>
        <Link to="/reports">Reports</Link>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/reports" component={Reports} />
          <Route
            exact
            path="/reports/monthly/:partName"
            component={MonthlyReports}
          />
          <Route
            exact
            path="/reports/summary/:partName"
            component={SummaryReport}
          />
          <Route exact path="/:partName" component={Parts} />
          <Route path="/monthly-balance/:partName" component={MonthlyBalance} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
