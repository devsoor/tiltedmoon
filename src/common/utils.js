const isAdmin = (username, email) => {
    if ((username === "devsoor" && email === "dev@devsoor.com") ||
        (username === "zackforbes" && email === "zack@gifcolors.com")) {
      return true;
    } else {
      return false
    }
  }

export default isAdmin;