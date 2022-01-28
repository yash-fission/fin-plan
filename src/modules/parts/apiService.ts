import { graphQLAPI } from "../main/baseApiService";
import { TransactionInterface } from "./components/Entry";
import { PartData } from "./components/Details";

const updateMonthlyBal = async (
  id: string,
  obj: TransactionInterface,
  isDelete = false
) => {
  let monthIndex = new Date(obj.date).getMonth() - 3;
  monthIndex = monthIndex < 0 ? monthIndex + 12 : monthIndex;
  const amount = !isDelete ? obj.amount : -obj.amount;
  await graphQLAPI({
    query: `
    mutation {
      updateMonthlyBal(part: "${id}", monthIndex: ${monthIndex}, amount: ${amount}) {
        id
      }
    }
    `,
  });
};

const updateTargetData = async (
  data: PartData,
  obj: TransactionInterface,
  isDelete: boolean = false
) => {
  if (isDelete) {
    data.doneAnnual = data.doneAnnual - obj.amount;
  } else {
    data.doneAnnual = data.doneAnnual
      ? data.doneAnnual + obj.amount
      : obj.amount;
  }

  await graphQLAPI({
    query: `
    mutation {
      updatePart(id: "${data.id}", done_annual: ${data.doneAnnual}) {
        id
      }
    }
    `,
  });
};

export const getTargetData = async (id: string) => {
  let res = await graphQLAPI({
    query: `
      query {
        partBrief(id: "${id}") {
          id
          part
          annual
          month
          done_annual
        }
      }
      `,
  });
  res.partBrief.doneAnnual = res.partBrief.done_annual;
  return res.partBrief;
};

export const getTransactionTable = async (id: string) => {
  let res = await graphQLAPI({
    query: `
    query {
      transactions(part: "${id}") {
        id
        part
        date
        particulars
        amount
        ${id === "investments" ? "type" : ""}
      }
    }
    `,
  });
  return res.transactions;
};

export const addTransaction = async (
  id: string,
  obj: TransactionInterface,
  data: PartData
) => {
  await graphQLAPI({
    query: `
    mutation {
      addTransaction(part: "${id}", date: "${obj.date}", particulars: "${obj.particular}", amount: ${obj.amount}, type: "${obj.type}") {
        id
      }
    }
    `,
  });
  updateTargetData(data, obj);
  updateMonthlyBal(id, obj);
};

export const deleteTransaction = async (
  id: string,
  row: TransactionInterface,
  data: PartData
) => {
  await graphQLAPI({
    query: `
    mutation {
      deleteTransaction(id: "${row.id}") {
        id
      }
    }
    `,
  });
  updateMonthlyBal(id, row, true);
  updateTargetData(data, row, true);
};

export const getMonthBal = async (id: string) => {
  const today = new Date();
  let currentMonth = today.getMonth() - 3;
  currentMonth = currentMonth < 0 ? currentMonth + 12 : currentMonth;
  let res = await graphQLAPI({
    query: `
    query {
      monthlyBal(part: "${id}", monthIndex: ${currentMonth}) {
        id
        part
        month_index
        month
        balance
        done
      }
    }`,
  });
  return res.monthlyBal[0];
};
