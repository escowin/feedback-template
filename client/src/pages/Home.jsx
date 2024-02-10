import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

function Home() {
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  console.log(loggedIn);

  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <>
      {loggedIn ? (
        <section>
          <h2>home page</h2>
        </section>
      ) : (
        <section>Log in</section>
      )}
    </>
  );
}

export default Home;
