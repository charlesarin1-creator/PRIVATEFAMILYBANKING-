/* =========================================
   PRIVATE FAMILY BANKING
   TRANSACTIONS ENGINE V1
========================================= */


/* =========================================
   TREASURY STATE
========================================= */

const treasuryState = {

  totalBalance: 115320,

  vaults: {

    stability: 35000,

    expansion: 20000,

    operations: 25000,

    credit: 15000,

    bigsharks: 5000,

    mercyarm: 15320

  },

  transactions: []

};



/* =========================================
   STORAGE INITIALIZATION
========================================= */

function initializeTreasury(){

  const savedState =
    localStorage.getItem("pfbTreasury");

  if(savedState){

    const parsed =
      JSON.parse(savedState);

    Object.assign(treasuryState, parsed);

  } else {

    saveTreasury();

  }

}



/* =========================================
   SAVE TREASURY
========================================= */

function saveTreasury(){

  localStorage.setItem(
    "pfbTreasury",
    JSON.stringify(treasuryState)
  );

}



/* =========================================
   GENERATE TRANSACTION ID
========================================= */

function generateTransactionID(){

  const now = new Date();

  const year = now.getFullYear();

  const random =
    Math.floor(Math.random() * 9000) + 1000;

  return `PFB-${year}-${random}`;

}



/* =========================================
   CREATE TRANSACTION
========================================= */

function createTransaction({

  type,
  vault,
  amount,
  description,
  status = "APPROVED"

}){

  const transaction = {

    id: generateTransactionID(),

    type,
    vault,
    amount,
    description,
    status,

    timestamp:
      new Date().toLocaleString()

  };

  treasuryState.transactions.unshift(transaction);

  saveTreasury();

  return transaction;

}



/* =========================================
   DEPOSIT FUNCTION
========================================= */

function depositFunds(vault, amount, description){

  if(!treasuryState.vaults[vault]){

    alert("Invalid vault.");
    return;

  }

  treasuryState.vaults[vault] += amount;

  treasuryState.totalBalance += amount;

  createTransaction({

    type: "DEPOSIT",
    vault,
    amount,
    description

  });

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   WITHDRAW FUNCTION
========================================= */

function withdrawFunds(vault, amount, description){

  if(!treasuryState.vaults[vault]){

    alert("Invalid vault.");
    return;

  }

  if(treasuryState.vaults[vault] < amount){

    alert("Insufficient vault balance.");
    return;

  }

  treasuryState.vaults[vault] -= amount;

  treasuryState.totalBalance -= amount;

  createTransaction({

    type: "WITHDRAWAL",
    vault,
    amount,
    description

  });

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   TRANSFER BETWEEN VAULTS
========================================= */

function transferFunds(

  fromVault,
  toVault,
  amount,
  description

){

  if(
    !treasuryState.vaults[fromVault] ||
    !treasuryState.vaults[toVault]
  ){

    alert("Invalid vault selection.");
    return;

  }

  if(
    treasuryState.vaults[fromVault] < amount
  ){

    alert("Insufficient balance.");
    return;

  }

  treasuryState.vaults[fromVault] -= amount;

  treasuryState.vaults[toVault] += amount;

  createTransaction({

    type: "TRANSFER",

    vault:
      `${fromVault} → ${toVault}`,

    amount,

    description

  });

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   CREDIT REQUEST
========================================= */

function requestCredit(amount, purpose){

  const exposureLimit =
    treasuryState.totalBalance * 0.30;

  if(amount > exposureLimit){

    alert(
      "Credit request exceeds governance exposure limit."
    );

    return;

  }

  createTransaction({

    type: "CREDIT REQUEST",

    vault: "credit",

    amount,

    description: purpose,

    status: "PENDING"

  });

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   APPROVE CREDIT
========================================= */

function approveCredit(transactionID){

  const transaction =
    treasuryState.transactions.find(
      t => t.id === transactionID
    );

  if(!transaction){

    alert("Transaction not found.");
    return;

  }

  transaction.status = "APPROVED";

  treasuryState.vaults.credit -= transaction.amount;

  treasuryState.totalBalance -= transaction.amount;

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   REJECT CREDIT
========================================= */

function rejectCredit(transactionID){

  const transaction =
    treasuryState.transactions.find(
      t => t.id === transactionID
    );

  if(!transaction){

    alert("Transaction not found.");
    return;

  }

  transaction.status = "REJECTED";

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   TREASURY ANALYTICS
========================================= */

function calculateReserveRatio(){

  const reserve =
    treasuryState.vaults.stability;

  return (
    (reserve / treasuryState.totalBalance) * 100
  ).toFixed(1);

}



/* =========================================
   REFRESH UI
========================================= */

function refreshTreasuryUI(){

  /* TOTAL BALANCE */

  const totalElement =
    document.getElementById("totalBalance");

  if(totalElement){

    totalElement.innerText =
      `₦${treasuryState.totalBalance.toLocaleString()}`;

  }


  /* VAULTS */

  Object.keys(treasuryState.vaults)
    .forEach(vault => {

      const element =
        document.getElementById(`${vault}Balance`);

      if(element){

        element.innerText =
          `₦${treasuryState.vaults[vault].toLocaleString()}`;

      }

    });


  /* RESERVE RATIO */

  const reserveElement =
    document.getElementById("reserveRatio");

  if(reserveElement){

    reserveElement.innerText =
      `${calculateReserveRatio()}%`;

  }


  /* TRANSACTION TABLE */

  const table =
    document.getElementById("transactionsTable");

  if(table){

    table.innerHTML = "";

    treasuryState.transactions
      .slice(0, 10)
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

}



/* =========================================
   SYSTEM INITIALIZATION
========================================= */

initializeTreasury();

window.onload = refreshTreasuryUI;
