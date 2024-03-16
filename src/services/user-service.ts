export const fetchUserSession = () => {
  const userDetailsString = localStorage.getItem("userDetails");
  if (userDetailsString) {
    const userDetails = JSON.parse(userDetailsString);
    return userDetails;
  }
  return null;
};
