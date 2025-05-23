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

// function closeSidebar() {
//   const sidebar = document.getElementById("SideH");
//   if (sidebar) {
//     sidebar.style.display = "none "; // Hide the sidebar
//   }
// }
// function openSidebar() {
//   const sidebar = document.getElementById("SideH");
//   if (sidebar) {
//     sidebar.style.display = "flex "; // Hide the sidebar
//   }
// }

// function togglePopup(event) {
//   event.stopPropagation(); // Prevents closing when clicking the profile pic
//   const popup = document.getElementById("popup");
//   const popup1 = document.getElementById("popup1");
//   popup.style.display = popup.style.display === "flex" ? "none" : "flex";
//   popup1.style.display = popup1.style.display === "flex" ? "none" : "flex";
// }

// // Close pop-up when clicking anywhere outside of it
// document.addEventListener("click", function () {
//   const popup = document.getElementById("popup");
//   popup.style.display = "none";
//   const popup1 = document.getElementById("popup1");
//   popup1.style.display = "none";
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const closeButton2 = document.getElementById("close2");
//   const closeButton = document.getElementById("close");
//   const openButton = document.getElementById("open");

//   if (closeButton) {
//     closeButton.addEventListener("click", closeSidebar);
//   }

//   if (closeButton2) {
//     closeButton2.addEventListener("click", closeSidebar);
//   }
//   if (openButton) {
//     openButton.addEventListener("click", openSidebar);
//   }
// });
//
const serialNumber = localStorage.getItem("selectedSerial");
const bookurl = `https://a-z3tq.onrender.com/api/Books/${serialNumber}`;
const userId = sessionStorage.getItem("userId");
// const requestborrowurl = `https://a-z3tq.onrender.com/api/Books/request-borrow/${serialNumber}/${encodeURIComponent(
//   userId
// )}`;
// const borrowHistoryUrl = `https://a-z3tq.onrender.com/api/Books/borrow-history?UserId=${encodeURIComponent(
//   userId
// )}&serialnumber=${serialNumber}&IsReturned=false`;

document.addEventListener("DOMContentLoaded", async function () {
  // const borrowResponse = await authorizedFetch(borrowHistoryUrl);
  // const borrowData = await borrowResponse.json();
  // const isBorrowed = borrowData.totalNotReturned > 0;
  if (serialNumber) {
    console.log(userId);
    console.log("Serial Number:", serialNumber);
    // document.getElementById("serialDisplay").textContent = serialNumber; // Display it
  } else {
    console.log("No serial number found.");
  }
  try {
    const response = await authorizedFetch(bookurl);
    const book = await response.json();
    const imageUrl = `https://a-z3tq.onrender.com/api/Books/image/${serialNumber}`;
    const imgresponse = await authorizedFetch(imageUrl);
        const blob = await imgresponse.blob();
        let objectURL = null;
        if (blob.type.startsWith("image/")) {
          objectURL = URL.createObjectURL(blob);
        }
    console.log(book);
    document.getElementById("BName").innerText = truncateText(book.name, 7);
    document.getElementById("Image").src = objectURL|| "/BookImages/default.png";
    document.getElementById("SerialNumber").innerText = book.serialNumber;
    document.getElementById("Author").innerText = truncateText(book.name, 7);
    document.getElementById("Description").innerHTML = book.description;
    document.getElementById("Year").innerHTML = "Published: " + book.year;
    console.log(book.quantity);
    const Bbutton = document.getElementById("borrow");
    console.log(Bbutton);
    Bbutton.classList = "edit";
    Bbutton.innerHTML = "Edit Book";

    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Clicked!"); // Save serial number
        localStorage.setItem("savedLocation", window.location.href);
        window.location.href = "EditBook.html"; // Redirect to next page
      });
    });
  } catch (error) {
    console.error("Eroor fetching Book");
  }
});
function truncateText(text, wordCount) {
  let words = text.split(" ");
  return words.length > wordCount
    ? words.slice(0, wordCount).join(" ") + "..."
    : text;
}
