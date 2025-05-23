function authorizedFetch(url, options = {}) {
  const token = sessionStorage.getItem("token"); // Your JWT token
  const apiKey = "your-api-key"; // Replace with your actual API key

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("userId");
  authorizedFetch(
    `https://a-z3tq.onrender.com/api/user/${encodeURIComponent(userId)}`
  )
    .then((response1) => response1.json())
    .then((User) => {
      document.querySelector(".rCategory").innerHTML = User.rCategory;
      document.querySelector(".rating").innerHTML =
        parseInt(User.rating) + "/10";
      document.querySelector(".borrow").innerHTML =
        parseInt(User.borrowlimit) + "/10";
    });
  authorizedFetch(
    `https://a-z3tq.onrender.com/api/Books/borrow-history?UserId=${encodeURIComponent(
      userId
    )}`
  )
    .then((responsed) => responsed.json())
    .then((datar) => {
      console.log(userId);
      document.querySelector(".TLR").innerHTML = datar.totalLateReturn || 0;
      document.querySelector(".TER").innerHTML = datar.totalEarlyReturn || 0;
    })
    .catch((error) => console.error("Error fetching data:", error));
});
