/* =========================================================
   PFB REQUEST ENGINE
   request-engine.js
   ---------------------------------------------------------
   PURPOSE:
   Handles all institutional request operations:
   - Deposits
   - Withdrawals
   - Loan Applications
   - Support Tickets
   - Approval Queue
   - Request Status Tracking
   - Console Synchronization

   CONNECTS TO:
   - database.js
   - storage.js
   - governance-engine.js
   - vault-manager.js
   ========================================================= */

const RequestEngine = (() => {

  /* =========================================
     DATABASE KEYS
     ========================================= */

  const REQUEST_KEY = "pfb_requests";
  const SUPPORT_KEY = "pfb_support_tickets";

  /* =========================================
     LOAD REQUESTS
     ========================================= */

  function loadRequests() {

    return JSON.parse(
      localStorage.getItem(REQUEST_KEY)
    ) || [];

  }

  /* =========================================
     SAVE REQUESTS
     ========================================= */

  function saveRequests(requests) {

    localStorage.setItem(
      REQUEST_KEY,
      JSON.stringify(requests)
    );

  }

  /* =========================================
     LOAD SUPPORT TICKETS
     ========================================= */

  function loadSupportTickets() {

    return JSON.parse(
      localStorage.getItem(SUPPORT_KEY)
    ) || [];

  }

  /* =========================================
     SAVE SUPPORT TICKETS
     ========================================= */

  function saveSupportTickets(tickets) {

    localStorage.setItem(
      SUPPORT_KEY,
      JSON.stringify(tickets)
    );

  }

  /* =========================================
     GENERATE REQUEST ID
     ========================================= */

  function generateID(prefix = "REQ") {

    return `
      ${prefix}-${Date.now()}-${Math.floor(Math.random() * 999)}
    `.replace(/\s/g, "");

  }

  /* =========================================
     CREATE REQUEST
     ========================================= */

  function createRequest(data) {

    const requests = loadRequests();

    const request = {

      id:
        data.id || generateID(data.prefix),

      type:
        data.type || "General",

      category:
        data.category || "Treasury",

      vault:
        data.vault || "Operations Vault",

      amount:
        Number(data.amount || 0),

      applicant:
        data.applicant || "Anonymous",

      note:
        data.note || "",

      status:
        "Pending",

      governance:
        "Awaiting Review",

      createdAt:
        new Date().toISOString(),

      approvedAt:
        null,

      rejectedAt:
        null

    };

    requests.unshift(request);

    saveRequests(requests);

    console.log(
      "Request Created:",
      request.id
    );

    return request;

  }

  /* =========================================
     CREATE DEPOSIT REQUEST
     ========================================= */

  function createDepositRequest(data) {

    return createRequest({

      prefix: "DEP",
      type: "Deposit",
      category: "Treasury Inflow",
      vault: data.vault,
      amount: data.amount,
      applicant: data.applicant,
      note: data.note

    });

  }

  /* =========================================
     CREATE WITHDRAWAL REQUEST
     ========================================= */

  function createWithdrawalRequest(data) {

    return createRequest({

      prefix: "WDL",
      type: "Withdrawal",
      category: "Treasury Outflow",
      vault: data.vault,
      amount: data.amount,
      applicant: data.applicant,
      note: data.note

    });

  }

  /* =========================================
     CREATE LOAN APPLICATION
     ========================================= */

  function createLoanRequest(data) {

    return createRequest({

      prefix: "LOAN",
      type: "Loan Application",
      category: "Internal Credit",
      vault: "Credit Vault",
      amount: data.amount,
      applicant: data.applicant,
      note: data.note

    });

  }

  /* =========================================
     CREATE SUPPORT TICKET
     ========================================= */

  function createSupportTicket(data) {

    const tickets = loadSupportTickets();

    const ticket = {

      id:
        generateID("SUP"),

      subject:
        data.subject || "Support Request",

      sender:
        data.sender || "Unknown",

      message:
        data.message || "",

      status:
        "Open",

      createdAt:
        new Date().toISOString()

    };

    tickets.unshift(ticket);

    saveSupportTickets(tickets);

    console.log(
      "Support Ticket Created:",
      ticket.id
    );

    return ticket;

  }

  /* =========================================
     APPROVE REQUEST
     ========================================= */

  function approveRequest(id) {

    const requests = loadRequests();

    const request =
      requests.find(r => r.id === id);

    if(!request){

      console.warn("Request not found.");
      return;

    }

    request.status = "Approved";
    request.governance = "Governed";
    request.approvedAt = new Date().toISOString();

    /* =========================
       APPLY TREASURY EFFECT
       ========================= */

    if(request.type === "Deposit"){

      VaultManager.deposit(
        request.vault,
        request.amount
      );

    }

    if(request.type === "Withdrawal"){

      VaultManager.withdraw(
        request.vault,
        request.amount
      );

    }

    if(request.type === "Loan Application"){

      VaultManager.withdraw(
        "Credit Vault",
        request.amount
      );

    }

    saveRequests(requests);

    console.log(
      "Approved:",
      request.id
    );

    refreshConsole();

  }

  /* =========================================
     REJECT REQUEST
     ========================================= */

  function rejectRequest(id) {

    const requests = loadRequests();

    const request =
      requests.find(r => r.id === id);

    if(!request){

      console.warn("Request not found.");
      return;

    }

    request.status = "Rejected";
    request.governance = "Declined";
    request.rejectedAt = new Date().toISOString();

    saveRequests(requests);

    console.log(
      "Rejected:",
      request.id
    );

    refreshConsole();

  }

  /* =========================================
     GET REQUESTS
     ========================================= */

  function getRequests() {

    return loadRequests();

  }

  /* =========================================
     GET PENDING REQUESTS
     ========================================= */

  function getPendingRequests() {

    return loadRequests().filter(
      req => req.status === "Pending"
    );

  }

  /* =========================================
     GET APPROVED REQUESTS
     ========================================= */

  function getApprovedRequests() {

    return loadRequests().filter(
      req => req.status === "Approved"
    );

  }

  /* =========================================
     GET REJECTED REQUESTS
     ========================================= */

  function getRejectedRequests() {

    return loadRequests().filter(
      req => req.status === "Rejected"
    );

  }

  /* =========================================
     GET SUPPORT TICKETS
     ========================================= */

  function getSupportTickets() {

    return loadSupportTickets();

  }

  /* =========================================
     REFRESH CONSOLE UI
     ========================================= */

  function refreshConsole() {

    if(typeof renderRequestTable === "function"){

      renderRequestTable();

    }

    if(typeof renderTreasuryMetrics === "function"){

      renderTreasuryMetrics();

    }

  }

  /* =========================================
     AUTO RENDER TABLE
     ========================================= */

  function renderRequestTable() {

    const table =
      document.getElementById("requestTable");

    if(!table) return;

    const requests = loadRequests();

    table.innerHTML = "";

    requests.forEach(req => {

      table.innerHTML += `

        <tr>

          <td>${req.id}</td>

          <td>${req.type}</td>

          <td>${req.vault}</td>

          <td>₦${Number(req.amount).toLocaleString()}</td>

          <td>${req.status}</td>

          <td>

            ${
              req.status === "Pending"

              ? `

              <button
                onclick="RequestEngine.approveRequest('${req.id}')"
                class="approve-btn">
                Approve
              </button>

              <button
                onclick="RequestEngine.rejectRequest('${req.id}')"
                class="reject-btn">
                Reject
              </button>

              `

              :

              `<span>${req.governance}</span>`
            }

          </td>

        </tr>

      `;

    });

  }

  /* =========================================
     PUBLIC API
     ========================================= */

  return {

    createRequest,
    createDepositRequest,
    createWithdrawalRequest,
    createLoanRequest,
    createSupportTicket,

    approveRequest,
    rejectRequest,

    getRequests,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getSupportTickets,

    renderRequestTable

  };

})();

/* =========================================================
   AUTO START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if(typeof RequestEngine !== "undefined"){

      RequestEngine.renderRequestTable();

    }

  }
);
