import React from "react";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

interface LoginInterface {
  id: string;
  part: string;
  annual: number;
  done_annual: number;
  month: number;
}

interface Props {
  tableData: Array<LoginInterface>;
}

const Login: React.FC<Props> = ({ tableData }: Props) => {
  //   const history = useHistory();

  // const openDetails = (index: string) => {
  //   history.push(`/${index}`);
  // };

  const tmp = (res: any) => {
    console.log(res);
  };

  return (
    <div>
      <button>Login</button>
      <GoogleLogin
        clientId="741271692104-ggefalp879l4hjjrjk4o4ea81mqprim2.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={tmp}
        onFailure={tmp}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default React.memo(Login);
