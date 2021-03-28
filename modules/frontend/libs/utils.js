export const getEndpoint = () => {
  if (process.server) {
    return "http://localhost:3001";
  } else if (process.client) {
    if (process.env.NODE_ENV === "production") {
      return "https://museum.phanective.org";
    } else if (process.env.NODE_ENV === "staging") {
      return "https://museum-stg.phanective.org";
    } else {
      return "http://localhost:3000";
    }
  } else {
    throw new Error("Failed to initialize API endpoint.");
  }
};
