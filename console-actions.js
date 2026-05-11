/* =========================================
   PRIVATE FAMILY BANKING
   CONSOLE ACTIONS V1
========================================= */


/* =========================================
   CONSOLE AUTHORIZATION
========================================= */

const consoleSecurity = {

  authorized: false,

  operator: "Founder-Steward",

  clearance: "TREASURY_LEVEL_ALPHA"

};



/* =========================================
   AUTHORIZE CONSOLE
========================================= */

function authorizeConsole(password){

  const masterPassword = "PFB2026";

  if(password === masterPassword){

    consoleSecurity.authorized = true;

    console.log(
      "Treasury Console Authorized"
    );

    return true;

  }

  console.warn(
    "Unauthorized Treasury Access Attempt"
  );

  return false;

}



/* =========================================
   REQUIRE AUTHORIZATION
========================================= */

function requireAuthorization(){

  if(!consoleSecurity.authorized){

    alert(
      "Treasury authorization required."
    );

    return false;

  }

  return true;

}



/* =========================================
   ADD TREASURY DEPOSIT
========================================= */

function consoleDeposit(){

  if(!requireAuthorization()) return;

  const vault =
    prompt(
      "Enter vault name:\n\nstability\nexpansion\noperations\ncredit\nbigsharks\nmercyarm"
    );

  if(!vault) return;

  const amount =
    parseFloat(
      prompt("Enter deposit amount:")
    );

  if(!amount || amount <= 0){

    alert("Invalid amount.");
    return;

  }

  const description =
    prompt(
      "Deposit description:"
    ) || "Treasury Deposit";

  depositFunds(
    vault,
    amount,
    description
  );

  alert(
    `₦${amount.toLocaleString()} deposited into ${vault}.`
  );

}



/* =========================================
   GOVERNED WITHDRAWAL
========================================= */

function consoleWithdrawal(){

  if(!requireAuthorization()) return;

  const vault =
    prompt(
      "Withdraw from which vault?"
    );

  if(!vault) return;

  const amount =
    parseFloat(
      prompt("Withdrawal amount:")
    );

  if(!amount || amount <= 0){

    alert("Invalid amount.");
    return;

  }

  const purpose =
    prompt(
      "Purpose of withdrawal:"
    ) || "Governed Withdrawal";

  governedWithdrawal(
    vault,
    amount,
    purpose
  );

}



/* =========================================
   VAULT TRANSFER
========================================= */

function consoleTransfer(){

  if(!requireAuthorization()) return;

  const fromVault =
    prompt("Transfer FROM:");

  const toVault =
    prompt("Transfer TO:");

  const amount =
    parseFloat(
      prompt("Transfer amount:")
    );

  if(!amount || amount <= 0){

    alert("Invalid amount.");
    return;

  }

  const reason =
    prompt(
      "Transfer reason:"
    ) || "Governed Transfer";

  governedTransfer(

    fromVault,
    toVault,
    amount,
    reason

  );

}



/* =========================================
   CREATE CREDIT REQUEST
========================================= */

function consoleCreditRequest(){

  if(!requireAuthorization()) return;

  const amount =
    parseFloat(
      prompt("Credit request amount:")
    );

  if(!amount || amount <= 0){

    alert("Invalid amount.");
    return;

  }

  const purpose =
    prompt(
      "Purpose of credit:"
    ) || "Treasury Credit";

  requestCredit(
    amount,
    purpose
  );

  alert(
    "Credit request submitted."
  );

}



/* =========================================
   APPROVE CREDIT REQUEST
========================================= */

function consoleApproveCredit(){

  if(!requireAuthorization()) return;

  const transactionID =
    prompt(
      "Enter transaction ID to approve:"
    );

  if(!transactionID) return;

  approveCredit(transactionID);

  alert(
    `Credit ${transactionID} approved.`
  );

}



/* =========================================
   REJECT CREDIT REQUEST
========================================= */

function consoleRejectCredit(){

  if(!requireAuthorization()) return;

  const transactionID =
    prompt(
      "Enter transaction ID to reject:"
    );

  if(!transactionID) return;

  rejectCredit(transactionID);

  alert(
    `Credit ${transactionID} rejected.`
  );

}



/* =========================================
   MERCY ARM ALLOCATION
========================================= */

function consoleMercyAllocation(){

  if(!requireAuthorization()) return;

  const amount =
    parseFloat(
      prompt("Mercy allocation amount:")
    );

  if(!amount || amount <= 0){

    alert("Invalid amount.");
    return;

  }

  const beneficiary =
    prompt(
      "Beneficiary:"
    ) || "Anonymous";

  const purpose =
    prompt(
      "Mercy purpose:"
    ) || "Mercy Allocation";

  allocateMercyFund(

    amount,
    beneficiary,
    purpose

  );

  alert(
    "Mercy ARM allocation processed."
  );

}



/* =========================================
   LOCK TREASURY VAULT
========================================= */

function consoleLockVault(){

  if(!requireAuthorization()) return;

  const vault =
    prompt(
      "Enter vault to lock:"
    );

  if(!vault) return;

  lockVault(vault);

  alert(
    `${vault} vault locked.`
  );

}



/* =========================================
   UNLOCK TREASURY VAULT
========================================= */

function consoleUnlockVault(){

  if(!requireAuthorization()) return;

  const vault =
    prompt(
      "Enter vault to unlock:"
    );

  if(!vault) return;

  unlockVault(vault);

  alert(
    `${vault} vault unlocked.`
  );

}



/* =========================================
   RUN QUARTERLY REVIEW
========================================= */

function consoleQuarterlyReview(){

  if(!requireAuthorization()) return;

  quarterlyReview();

}



/* =========================================
   EXPORT TREASURY SYSTEM
========================================= */

function consoleExportSystem(){

  if(!requireAuthorization()) return;

  exportTreasuryData();

}



/* =========================================
   RESET SYSTEM
========================================= */

function consoleResetSystem(){

  if(!requireAuthorization()) return;

  const confirmReset =
    confirm(
      "Reset entire treasury system?"
    );

  if(!confirmReset) return;

  clearPFBSystem();

}



/* =========================================
   TREASURY SNAPSHOT
========================================= */

function consoleTreasurySnapshot(){

  if(!requireAuthorization()) return;

  const snapshot =
    generateTreasurySnapshot();

  console.table(snapshot.vaults);

  console.log(snapshot);

  alert(
    "Treasury snapshot printed to console."
  );

}



/* =========================================
   GOVERNANCE STATUS
========================================= */

function consoleGovernanceStatus(){

  if(!requireAuthorization()) return;

  const governance =
    governanceHealthCheck();

  console.log(governance);

  alert(
    `Reserve: ${governance.reserveProtection}\nCredit Exposure: ${governance.creditExposure}`
  );

}



/* =========================================
   LOAD TRANSACTIONS TABLE
========================================= */

function renderConsoleTransactions(){

  const table =
    document.getElementById(
      "transactionsTable"
    );

  if(!table) return;

  table.innerHTML = "";

  treasuryState.transactions
    .slice(0, 20)
    .forEach(transaction => {

      table.innerHTML += `

        <tr>

          <td>${transaction.id}</td>

          <td>${transaction.type}</td>

          <td>${transaction.vault}</td>

          <td>₦${transaction.amount.toLocaleString()}</td>

          <td>${transaction.status}</td>

          <td>${transaction.timestamp}</td>

        </tr>

      `;

    });

}



/* =========================================
   REFRESH CONSOLE
========================================= */

function refreshConsole(){

  refreshTreasuryUI();

  renderConsoleTransactions();

}



/* =========================================
   SYSTEM INITIALIZATION
========================================= */

window.addEventListener(

  "load",

  () => {

    refreshConsole();

  }

);
