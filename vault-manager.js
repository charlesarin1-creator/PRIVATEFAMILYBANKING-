/* =========================================
   PRIVATE FAMILY BANKING
   VAULT MANAGER V1
========================================= */


/* =========================================
   VAULT GOVERNANCE CONFIGURATION
========================================= */

const vaultGovernance = {

  stability: {
    name: "Stability Reserve",
    minimumRatio: 30,
    locked: false
  },

  expansion: {
    name: "Expansion Vault",
    minimumRatio: 0,
    locked: false
  },

  operations: {
    name: "Operations Vault",
    minimumRatio: 0,
    locked: false
  },

  credit: {
    name: "Credit Vault",
    minimumRatio: 0,
    locked: false
  },

  bigsharks: {
    name: "BIG SHARKS Strategic Vault",
    minimumRatio: 0,
    locked: false
  },

  mercyarm: {
    name: "Mercy ARM Vault",
    minimumRatio: 0,
    locked: false
  }

};



/* =========================================
   DEFAULT ALLOCATION RULES
========================================= */

const allocationRules = {

  stability: 35,

  expansion: 20,

  operations: 25,

  credit: 15,

  bigsharks: 5

};



/* =========================================
   GET TOTAL TREASURY
========================================= */

function getTotalTreasury(){

  return treasuryState.totalBalance;

}



/* =========================================
   GET VAULT BALANCE
========================================= */

function getVaultBalance(vault){

  return treasuryState.vaults[vault] || 0;

}



/* =========================================
   CALCULATE VAULT RATIO
========================================= */

function calculateVaultRatio(vault){

  const total =
    getTotalTreasury();

  if(total <= 0) return 0;

  return (

    (getVaultBalance(vault) / total) * 100

  ).toFixed(1);

}



/* =========================================
   ENFORCE STABILITY PROTECTION
========================================= */

function enforceReserveProtection(){

  const ratio =
    parseFloat(
      calculateVaultRatio("stability")
    );

  const minimum =
    vaultGovernance.stability.minimumRatio;

  if(ratio < minimum){

    alert(
      "Governance Alert: Stability Reserve protection threshold breached."
    );

    return false;

  }

  return true;

}



/* =========================================
   AUTO ALLOCATION ENGINE
========================================= */

function autoAllocateDeposit(amount){

  Object.entries(allocationRules)
    .forEach(([vault, percentage]) => {

      const allocation =
        Math.floor(
          (amount * percentage) / 100
        );

      treasuryState.vaults[vault] += allocation;

      createTransaction({

        type: "AUTO ALLOCATION",

        vault,

        amount: allocation,

        description:
          `Automatic allocation from treasury inflow`

      });

    });

  treasuryState.totalBalance += amount;

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   GOVERNED WITHDRAWAL
========================================= */

function governedWithdrawal(

  vault,
  amount,
  purpose

){

  const restrictedWords = [

    "luxury",
    "impulse",
    "gambling",
    "random"

  ];

  const flagged =
    restrictedWords.some(word =>
      purpose.toLowerCase().includes(word)
    );

  if(flagged){

    alert(
      "Withdrawal denied by governance policy."
    );

    createTransaction({

      type: "DENIED WITHDRAWAL",

      vault,

      amount,

      description: purpose,

      status: "DENIED"

    });

    return;

  }

  if(vault === "stability"){

    const allowed =
      enforceReserveProtection();

    if(!allowed) return;

  }

  withdrawFunds(
    vault,
    amount,
    purpose
  );

}



/* =========================================
   LOCK VAULT
========================================= */

function lockVault(vault){

  if(!vaultGovernance[vault]) return;

  vaultGovernance[vault].locked = true;

  saveTreasury();

}



/* =========================================
   UNLOCK VAULT
========================================= */

function unlockVault(vault){

  if(!vaultGovernance[vault]) return;

  vaultGovernance[vault].locked = false;

  saveTreasury();

}



/* =========================================
   CHECK VAULT LOCK
========================================= */

function isVaultLocked(vault){

  if(!vaultGovernance[vault]) return false;

  return vaultGovernance[vault].locked;

}



/* =========================================
   VAULT TRANSFER GOVERNANCE
========================================= */

function governedTransfer(

  fromVault,
  toVault,
  amount,
  reason

){

  if(isVaultLocked(fromVault)){

    alert(
      `${vaultGovernance[fromVault].name} is locked.`
    );

    return;

  }

  if(fromVault === "stability"){

    const ratio =
      calculateVaultRatio("stability");

    if(ratio <= 30){

      alert(
        "Transfer blocked. Stability Reserve protection active."
      );

      return;

    }

  }

  transferFunds(

    fromVault,
    toVault,
    amount,
    reason

  );

}



/* =========================================
   CREDIT EXPOSURE ANALYTICS
========================================= */

function calculateCreditExposure(){

  const creditVault =
    treasuryState.vaults.credit;

  const total =
    treasuryState.totalBalance;

  if(total <= 0) return 0;

  return (

    (creditVault / total) * 100

  ).toFixed(1);

}



/* =========================================
   GOVERNANCE STATUS
========================================= */

function governanceHealthCheck(){

  const reserveHealthy =
    enforceReserveProtection();

  const exposure =
    calculateCreditExposure();

  return {

    reserveProtection:
      reserveHealthy
        ? "PROTECTED"
        : "AT RISK",

    creditExposure:
      `${exposure}%`,

    treasuryStatus:
      "STABLE"

  };

}



/* =========================================
   TREASURY SNAPSHOT
========================================= */

function generateTreasurySnapshot(){

  return {

    timestamp:
      new Date().toLocaleString(),

    totalTreasury:
      treasuryState.totalBalance,

    vaults:
      treasuryState.vaults,

    governance:
      governanceHealthCheck(),

    transactions:
      treasuryState.transactions.length

  };

}



/* =========================================
   DISPLAY SNAPSHOT IN CONSOLE
========================================= */

function printTreasurySnapshot(){

  console.log(

    "PFB TREASURY SNAPSHOT",
    generateTreasurySnapshot()

  );

}



/* =========================================
   QUARTERLY REVIEW ENGINE
========================================= */

function quarterlyReview(){

  const snapshot =
    generateTreasurySnapshot();

  const reviews =
    loadData(STORAGE_KEYS.reviews) || [];

  reviews.unshift(snapshot);

  saveData(
    STORAGE_KEYS.reviews,
    reviews
  );

  alert(
    "Quarterly treasury review completed."
  );

}



/* =========================================
   MERCY ARM GOVERNANCE
========================================= */

function allocateMercyFund(

  amount,
  beneficiary,
  purpose

){

  if(
    treasuryState.vaults.mercyarm < amount
  ){

    alert(
      "Insufficient Mercy ARM allocation."
    );

    return;

  }

  treasuryState.vaults.mercyarm -= amount;

  treasuryState.totalBalance -= amount;

  createTransaction({

    type: "MERCY ALLOCATION",

    vault: "mercyarm",

    amount,

    description:
      `${beneficiary} — ${purpose}`

  });

  saveTreasury();

  refreshTreasuryUI();

}



/* =========================================
   SYSTEM BOOT
========================================= */

printTreasurySnapshot();
