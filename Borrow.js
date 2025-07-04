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

// const search = document.getElementById("search").value.trim();
// console.log(serialNumber);
const scannedSerialNumber = localStorage.getItem("scannedSerialNumber");

if (scannedSerialNumber) {
  // Set the value of the serial number input field
  document.getElementById("serialnumber").value = scannedSerialNumber;
} else {
  // If no serial number is found, alert the user or handle it accordingly
  document.getElementById("serialnumber").value = "";
}
const ErrorMessage = document.getElementById("error_message");
function geterror() {
  ErrorMessage.style.display = "block";
  setTimeout(() => {
    ErrorMessage.innerText = "";
    ErrorMessage.style.display = "none";
  }, 2000);
}

const Enter = document.getElementById("Enter");
Enter.addEventListener("click", async () => {
  Enter.innerHTML = "Processing...";
  Enter.disabled = true; // Disable the button to prevent multiple clicks
  try {
    const userId = sessionStorage.getItem("userId");
    const serialNumber = document.getElementById("serialnumber").value.trim();
    const borrowHistoryUrl = `https://a-z3tq.onrender.com/api/Books/borrow-history?UserId=${encodeURIComponent(
      userId
    )}&serialnumber=${serialNumber}&IsReturned=false`;

    // Check if the book has been borrowed
    const borrowResponse = await authorizedFetch(borrowHistoryUrl);
    const borrowData = await borrowResponse.json();
    const isBorrowed = borrowData.totalNotReturned > 0;
    console.log(isBorrowed);
    const bookurl = `https://a-z3tq.onrender.com/api/Books/${serialNumber}`;
    const response = await authorizedFetch(bookurl);
    const bookresponse = await response.json();

    if (!serialNumber) {
      console.error("Input a serial number");
      ErrorMessage.innerHTML = "Input Serial Number";
      geterror();
    } else if (!isBorrowed) {
      if (response.status === 200 && bookresponse.quantity > 0) {
        localStorage.setItem("selectedSerial", serialNumber);
        localStorage.setItem("savedLocation", window.location.href);
        localStorage.setItem("scannedSerialNumber", "");
        window.location.href = "RequestBorrow.html";
      }
      if (bookresponse.quantity <= 0) {
        ErrorMessage.innerHTML = "Book is Unavailable";
        geterror();
      }
    } else if (isBorrowed && bookresponse.name) {
      console.log(bookurl);
      ErrorMessage.innerText = "Book is borrowed by you";
      geterror();
      console.error("Book is borrowed");
    } else {
      ErrorMessage.innerText = "BOOK NOT FOUND";
      geterror();
      console.error("BOOK NOT FOUND");
    }
  } catch (error) {
    ErrorMessage.innerHTML = "Book not Found";
    ErrorMessage.style.display = "block";
    geterror();
    console.error("Error Getting book", error);
  }
  finally {
    Enter.innerHTML = "Enter";
    Enter.disabled = false; // Re-enable the button after processing
  }
});
