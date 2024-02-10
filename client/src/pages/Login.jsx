// import { useEffect } from "react";
import DocForm from "../components/DocForm";
// import "../assets/css/login.css";

function Login() {
//   useEffect(() => setMain("login"), [setMain]);

  // dynamically renders ui elements & attributes with props & mapped array objects
  return <DocForm doc={"user"} type={"login"} className={"page"} />;
}

export default Login;
