// import { QUERY_ME } from "./queries";
import { USER } from "./mutations"
import Auth from "./auth"

//  Client side form objects mirror server side model schema settings
export const form = {
  // Document mutation forms
  login: [
    { name: "username", type: "text", min: 1, max: 25 },
    { name: "password", type: "password", min: 5, max: 25 },
  ],
};

// Algorithmically returns GraphQL document schema object
export const docMutation = (doc, type) => {
  switch (doc) {
    case "user":
      switch (type) {
        case "sign-up":
          return USER.ADD_USER;
        case "login":
          return USER.LOGIN;
        default:
          console.log("invalid user mutation");
      }
      break;
    default:
      return console.error("invalid mutation");
  }
};

// Algorithmically computes & returns GraphQL mutation response
export const determineMutationResult = (doc, type, data) => {
  const dynamicKey = `${type}${doc}`;
  const { [dynamicKey]: result } = data;
  return result;
};

// Carries out conditional action following a succesful mutation from the client side
export const postMutation = (type, navigate, setEditSelected, data) => {
  if (type === "login" || type === "sign-up") {
    type === "login"
      ? Auth.login(data.login.token)
      : Auth.login(data.addUser.token);
  } else {
    type === "add" ? navigate("/") : setEditSelected(false);
  }
};

// Updates client side cache object to mirror updates in server side database
export const updateCache = {
  me: (cache, mutationData, virtuals, type) => {
    try {
      const queryData = cache.readQuery({ query: QUERY_ME });
      const me = queryData?.me;

      if (me) {
        const updatedJobs =
          type === "add" ? [mutationData, ...me.jobs] : me.jobs;
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobs: updatedJobs,
              totalCount: updatedJobs.length,
              rate: me.hiredCount / (updatedJobs.length + 1),
              // iterates through virtuals array to update corresponding cache key-values
              ...virtuals.reduce((counts, virtual) => {
                counts[`${virtual}Count`] = updatedJobs.filter(
                  (job) => job.status === virtual
                ).length;
                return counts;
              }, {}),
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
      console.warn("first job app submitted by user");
    }
  },
};