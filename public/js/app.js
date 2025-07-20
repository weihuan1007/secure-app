let authToken = null;
let pendingUsername = null;
let pendingPassword = null;

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    alert("Login success!");
    authToken = data.token;
    document.getElementById("transactionForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("userInfo").style.display = "block";
    document.getElementById("userName").textContent = "Username: " + data.username;
    document.getElementById("userEmail").textContent = "Email: " + data.email;
    document.getElementById("logoutBtn").style.display = "block";
    fetchTransactions(); // Only called after login
  } else {
    const errorText = await response.text();
    alert(errorText);
  }
});

document.getElementById("transactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;

  const response = await fetch("http://localhost:8080/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    body: JSON.stringify({ recipient, amount }),
  });

  // After successful transaction
  const result = await response.text();
  alert(result);
  fetchTransactions();
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const email = document.getElementById("regEmail").value;

  const response = await fetch("http://localhost:8080/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  const result = await response.text();
  alert(result);

  // Clear input fields after registration
  document.getElementById("regUsername").value = "";
  document.getElementById("regPassword").value = "";
  document.getElementById("regEmail").value = "";

  // If registration was successful, log in automatically and show user info
  if (result === "Registration successful") {
    const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      alert("Login success!");
      authToken = data.token;
      document.getElementById("transactionForm").style.display = "block";
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("userInfo").style.display = "block";
      document.getElementById("userName").textContent = "Username: " + data.username;
      document.getElementById("userEmail").textContent = "Email: " + data.email;
      document.getElementById("logoutBtn").style.display = "block"; // Show logout button
      fetchUserDetails();
      fetchTransactions();
    }
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  authToken = null;
  pendingUsername = null;
  pendingPassword = null;
  // Hide all protected UI
  document.getElementById("transactionForm").style.display = "none";
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("transactionsContainer").style.display = "none"; // <-- Add this line
  // Show login and register forms
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "block";
  // Optionally clear transaction fields
  document.getElementById("recipient").value = "";
  document.getElementById("amount").value = "";
  // Optionally clear user info
  document.getElementById("userName").textContent = "";
  document.getElementById("userEmail").textContent = "";
  alert("You have been logged out.");
});

async function fetchUserDetails() {
  if (!authToken) return;
  const response = await fetch("http://localhost:8080/api/auth/user", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + authToken
    }
  });
  if (response.ok) {
    const data = await response.json();
    document.getElementById("userInfo").style.display = "block";
    document.getElementById("userName").textContent = "Username: " + data.username;
    document.getElementById("userEmail").textContent = "Email: " + data.email;
  }
}

async function fetchTransactions() {
  if (!authToken) return;
  const response = await fetch("http://localhost:8080/api/transaction", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + authToken
    }
  });
  if (response.ok) {
    const transactions = await response.json();
    const list = document.getElementById("transactionsList");
    list.innerHTML = "";
    transactions.forEach(tx => {
      const item = document.createElement("li");
      item.textContent = `To: ${tx.recipient}, Amount: ${tx.amount}, Date: ${tx.created_at ? new Date(tx.created_at).toLocaleString() : ""}`;
      list.appendChild(item);
    });
    document.getElementById("transactionsContainer").style.display = "block";
  }
}
