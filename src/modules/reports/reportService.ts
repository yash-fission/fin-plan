import { graphQLAPI } from "../main/baseApiService";

export const getAllMonthsReport = async (part: string) => {
  let res = await graphQLAPI({
    query: `
      query {
        monthlyReport(part: "${part}") {
          month
          monthTransactions {
            date
            particulars
            amount
          }
          done
          balance
        }
      }`,
  });
  return res.monthlyReport;
};

export const getAllMonthBalance = async (id: string) => {
  let res = await graphQLAPI({
    query: `
      query {
        monthlyBal(part: "${id}") {
          id
          month
          balance
          done
        }
      }`,
  });
  return res.monthlyBal;
};

export const isSimilar = (s1: string, s2: string) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength: number = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  let similarPercent =
    ((longerLength - editDistance(longer, shorter)) /
      parseFloat(longerLength + "")) *
    100;
  return similarPercent > 65;
};

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = [];
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
