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


//
const serialNumber = localStorage.getItem("selectedSerial");
const bookurl = `https://a-z3tq.onrender.com/api/Books/${serialNumber}`;
const userId = sessionStorage.getItem("userId");

const requestborrowurl = `https://a-z3tq.onrender.com/api/Books/borrowOnline/${serialNumber}/${encodeURIComponent(
  userId
)}`;
const borrowHistoryUrl = `https://a-z3tq.onrender.com/api/Books/borrow-history?UserId=${encodeURIComponent(
  userId
)}&serialnumber=${serialNumber}&IsReturned=false&IsOnline=True`;

document.addEventListener("DOMContentLoaded", async function () {
  const borrowResponse = await authorizedFetch(borrowHistoryUrl);
  const borrowData = await borrowResponse.json();
  const isBorrowed = borrowData.totalNotReturned > 0;
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
    const pdf = book.pdfPath;
    const bookName = truncateText(book.name, 7);
    document.getElementById("BName").innerText = truncateText(book.name, 7);
    document.getElementById("SerialNumber").innerText = book.serialNumber;
    document.getElementById("Image").src = objectURL || "/BookImages/default.png";
    document.getElementById("Author").innerText = truncateText(book.name, 7);
    document.getElementById("Description").innerHTML = book.description;
    document.getElementById("Year").innerHTML = "Published: " + book.year;
    console.log(book.quantity);
    const Bbutton = document.getElementById("borrow");
    console.log(Bbutton);
    if (pdf == null) {
      Bbutton.className = "unavailable";
      Bbutton.innerHTML = "Unavailable";
    } else if (isBorrowed) {
      Bbutton.className = "borrowed";
      Bbutton.innerHTML = "Read";
    } else if (!isBorrowed && book.quantity >= 1) {
      Bbutton.className = "borrow";
      Bbutton.innerHTML = "Borrow";
    }

    document.querySelectorAll(".borrowed").forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Clicked!"); // Save serial number
        localStorage.setItem("savedLocation", window.location.href);
        localStorage.setItem("bookName", bookName);
        window.location.href = "ReadBook.html"; // Redirect to next page
      });
    });
    document.querySelectorAll(".borrow").forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Clicked!"); // Save serial number
        localStorage.setItem("bookName", bookName);
        localStorage.setItem("savedLocation", window.location.href);
        window.location.href = "RequestBorrow.html"; // Redirect to next page
      });
    });
  } catch (error) {
    console.error("Error fetching Book");
  }
});
function truncateText(text, wordCount) {
  let words = text.split(" ");
  return words.length > wordCount
    ? words.slice(0, wordCount).join(" ") + "..."
    : text;
}
