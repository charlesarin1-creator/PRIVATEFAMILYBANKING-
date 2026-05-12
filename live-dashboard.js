// ========================================
// PRIVATE FAMILY BANKING
// LIVE DASHBOARD ENGINE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  initializeDashboard();

});

// ========================================
// INITIALIZE DASHBOARD
// ========================================

function initializeDashboard(){

  loadTreasuryTotals();

  loadVaultBalances();

  loadTransactionTable();

  loadGovernanceStatus();

}

// ========================================
// LOAD TOTAL TREASURY
// ========================================

function loadTreasuryTotals(){

  const treasury = PFB_DATABASE.getTreasury();

  const totalElement = document.getElementById("totalTreasury");

  if(totalElement){

    totalElement.innerText =
      "₦" + treasury.total.toLocaleString();

  }

}

// ========================================
// LOAD VAULT BALANCES
// ========================================

function loadVaultBalances(){

  const vaults = PFB_DATABASE.getVaults();

  updateBalance("stabilityBalance", vaults.stability);
  updateBalance("expansionBalance", vaults.expansion);
  updateBalance("operationsBalance", vaults.operations);
  updateBalance("creditBalance", vaults.credit);
  updateBalance("mercyBalance", vaults.mercy);

}

// ========================================
// UPDATE SINGLE BALANCE
// ========================================

function updateBalance(id, amount){

  const element = document.getElementById(id);

  if(element){

    element.innerText =
      "₦" + amount.toLocaleString();

  }

}

// ========================================
// LOAD TRANSACTION TABLE
// ========================================

function loadTransactionTable(){

  const transactions =
    PFB_DATABASE.getTransactions();

  const table =
    document.getElementById("transactionsTable");

  if(!table) return;

  table.innerHTML = "";

  transactions
    .slice()
    .reverse()
    .forEach(transaction => {

      const row = document.createElement("tr");

      row.innerHTML = `

        <td>${transaction.reference}</td>
        <td>${transaction.date}</td>
        <td>${transaction.vault}</td>
        <td>${transaction.type}</td>
        <td>₦${Number(transaction.amount).toLocaleString()}</td>
        <td>${transaction.status}</td>

      `;

      table.appendChild(row);

    });

}

// ========================================
// LOAD GOVERNANCE STATUS
// ========================================

function loadGovernanceStatus(){

  setStatus(
    "governanceStatus",
    "ACTIVE"
  );

  setStatus(
    "reviewStatus",
    "SCHEDULED"
  );

  setStatus(
    "creditExposure",
    calculateCreditExposure() + "%"
  );

  setStatus(
    "mercyStatus",
    "PROTECTED"
  );

}

// ========================================
// STATUS HELPER
// ========================================

function setStatus(id, value){

  const element = document.getElementById(id);

  if(element){

    element.innerText = value;

  }

}

// ========================================
// CREDIT EXPOSURE
// ========================================

function calculateCreditExposure(){

  const vaults =
    PFB_DATABASE.getVaults();

  const transactions =
    PFB_DATABASE.getTransactions();

  let activeLoans = 0;

  transactions.forEach(tx => {

    if(
      tx.type === "Loan Disbursement"
      &&
      tx.status === "Approved"
    ){

      activeLoans += Number(tx.amount);

    }

  });

  if(vaults.credit <= 0){

    return 0;

  }

  const exposure =
    (activeLoans / vaults.credit) * 100;

  return exposure.toFixed(0);

}

// ========================================
// LIVE REFRESH
// ========================================

setInterval(() => {

  initializeDashboard();

}, 5000);
