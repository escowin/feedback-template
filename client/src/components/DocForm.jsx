import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  determineMutationResult,
  docMutation,
  form,
  postMutation,
} from "../utils/helpers";

function DocForm(props) {
  const navigate = useNavigate();
  const { initialValues, setEditSelected, doc, type, className } = props;
  const fields =
    type === "login" || type === "sign-up" ? form.login : form[doc];

  // Server-related variables
  // - Variable is a dynamically defined GraphQL schema object
  const [document, { error }] = useMutation(docMutation(doc, type), {
    // Updates client-side cache to reflect changes to server side data
    update(cache, { data }) {
      const mutationResult = determineMutationResult(doc, type, data);
      console.log(mutationResult)
    },
  });

  // sets up form state management
  const [formState, setFormState] = useState({});

  // populates form state with profile data when component mounts
  useEffect(() => {
    // filters 'profile' object based on the 'details' array
    const docFields = {};
    fields.forEach((field) => {
      if (field.type === "date") {
        const today = new Date()
          .toLocaleDateString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .join("/");
        docFields[field.name] = initialValues[field.name] || today;
      } else if (field.name === "username" || field.name === "password") {
        docFields[field.name] = "";
      } else {
        docFields[field.name] = initialValues[field.name] || "";
      }
    });
    // Sets the filtered 'profile' object as the initial 'formState'
    setFormState(docFields);
  }, [initialValues, fields]);

  // Handles changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Carries out client-server communication
    try {
      // Sets the object to mirror the GraphQL schema
      const mutation = {
        ...formState,
        ...(type === "edit" ? { id: initialValues._id } : {}),
      };
      console.log(mutation)

      // Conditionally determines mutation sequence
      if (type === "login" || type === "sign-up") {
        const { data } = await document({ variables: mutation });
        console.log(data)
        postMutation(type, navigate, setEditSelected, data);
      } else {
        await document({ variables: mutation });
        postMutation(type, navigate, setEditSelected);
      }
    } catch (err) {
      // Error handling
      console.error(err);
    }
  };

  // Conditionally determines attributes of form element
  const displayField = (field, i) => {
    switch (field.type) {
      case "radio":
        return <div>tbd on radio</div>;
      default:
        return (
          <label key={i} htmlFor={field.name}>
            {field.name}
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              minLength={field.min ? field.min : null}
              maxLength={field.max ? field.max : null}
              required={field.req ? field.req : null}
              value={formState[field.name] || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          </label>
        );
    }
  };

  // Dynamically renders scalable UI elements & attributes
  return (
    <section
      className={`${className} form-section`}
      id={`${type}-${doc}-section`}
    >
      <form
        className={`${doc}-form`}
        id={`${type}-${doc}`}
        onSubmit={handleFormSubmit}
      >
        <h2>{type}</h2>
        {fields.map((field, i) => displayField(field, i))}
        <button type="submit">
          {type !== "login" && type !== "sign-up" ? "save" : "submit"}
        </button>
        {error && <span>{type} failed</span>}
      </form>
    </section>
  );
}

export default DocForm;
