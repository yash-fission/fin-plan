interface APIBody {
  query: string;
  variables?: any;
}

export const graphQLAPI = async (body: APIBody) => {
  let res = await fetch("http://localhost:5015/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = `An error has occured: ${res.status}`;
    throw new Error(message);
  }
  let data = await res.json();
  return data.data;
};

export const setMonthlyBal = async (amount: number, oldData: any) => {
  await graphQLAPI({
    query: `
    mutation UpdateNewSalary($amount: Int!, $oldData: [breakdownInput]){
      updateNewSalary(amount: $amount, oldData: $oldData) {
        id
      }
    }
    `,
    variables: {
      amount,
      oldData,
    },
  });
};

export const getIncomeBreakdown = async () => {
  return await graphQLAPI({
    query: `
      query {
        incomeBreakdown {
          id
          part
          annual
          month
        }
      }
      `,
  });
};

export const capitalize = (str: string): string => {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};
