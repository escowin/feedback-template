import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

function Home() {
  // Server data
  const loggedIn = Auth.loggedIn();
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};

  // State data
  const [display, setDisplay] = useState("");
  const [texts, setTexts] = useState("");
  console.log(texts);

  // UX functions
  const handleClick = (collection) => {
    setDisplay(collection);
  };

  const handleTemplate = (textsData) => {
    setTexts(textsData);
  };

  // UI Display
  if (loading) {
    return <section>Loading...</section>;
  }

  return (
    <>
      {loggedIn ? (
        <>
          <h2>home page</h2>
          <aside>
            <form>add collection</form>
            <ul>
              {user.collections.map((collection, i) => (
                <li key={i} onClick={() => handleClick(collection)}>
                  {collection.title}
                </li>
              ))}
            </ul>
          </aside>

          <section>
            {display ? (
              <>
                <ul>
                  {display.templates.map((template, i) => (
                    <li key={i} onClick={() => handleTemplate(template.texts)}>
                      {template.title}
                    </li>
                  ))}
                </ul>

                {texts ? (
                  <ul id="text-list">
                    {texts.map((text, j) => (
                      <li key={j}>
                        <h3>{text.type}</h3>
                        <p>{text.text}</p>
                        <button className="copy-btn">copy</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>select template</p>
                )}
              </>
            ) : (
              <p>click something</p>
            )}
          </section>
        </>
      ) : (
        <section>Log in</section>
      )}
    </>
  );
}

export default Home;
