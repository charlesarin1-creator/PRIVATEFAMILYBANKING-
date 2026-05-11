/*
========================================
PRIVATE FAMILY BANKING
CENTRAL TREASURY DATABASE
========================================
*/

const PFB_DATABASE_KEY = "PFB_SYSTEM_DATABASE_V1";

/*
========================================
DEFAULT SYSTEM DATABASE
========================================
*/

const defaultDatabase = {

  system: {
    institution: "PRIVATE FAMILY BANKING",
    founder: "Charles Inyam Arin",
    doctrine: "Survival Before Expansion",
    initialized: true,
    version: "1.0.0",
    createdAt: new Date().toISOString()
  },

  treasury: {

    totalTreasury: 115320,

    vaults: {

      stability: {
        id: "VAULT-STABILITY",
        name: "Stability Reserve",
        balance: 35000,
        protected: true,
        color: "gold"
      },

      expansion: {
        id: "VAULT-EXPANSION",
        name: "Expansion Vault",
        balance: 20000,
        protected: false,
        color: "copper"
      },

      operations: {
        id: "VAULT-OPERATIONS",
        name: "Operations Vault",
        balance: 25000,
        protected: false,
        color: "navy"
      },

      credit: {
        id: "VAULT-CREDIT",
        name: "Credit Vault",
        balance: 15000,
        protected: true,
        color: "red"
      },

      mercyarm: {
        id: "VAULT-MERCYARM",
        name: "MERCY ARM",
        balance: 15320,
        protected: true,
        color: "green"
      }

    }

  },

  governance: {

    contributionLaw: true,
    withdrawalProtection: true,
    creditGovernance: true,
    quarterlyReview: "First Saturday of March, June, September, December",

    emergencyDefinition: [
      "Health Crisis",
      "Shelter Protection",
      "Treasury Survival",
      "Critical Institutional Threat"
    ],

    restrictedActivities: [
      "Impulse Spending",
      "Emotional Withdrawals",
      "Undocumented Credit",
      "Unauthorized Treasury Movement"
    ]

  },

  credit: {

    maxExposurePercent: 30,

    activeLoans: [],

    requests: []

  },

  transactions: [

    {
      id: "PFB-001",
      date: new Date().toISOString(),
      vault: "Institutional Treasury",
      type: "Founding Allocation",
      amount: 100000,
      status: "Approved"
    },

    {
      id: "MA-001",
      date: new Date().toISOString(),
      vault: "MERCY ARM",
      type: "Founding Allocation",
      amount: 15320,
      status: "Protected"
    }

  ],

  auditLogs: [],

  notifications: []

};

/*
========================================
INITIALIZE DATABASE
========================================
*/

function initializeDatabase(){

  const existingDatabase = localStorage.getItem(PFB_DATABASE_KEY);

  if(!existingDatabase){

    localStorage.setItem(
      PFB_DATABASE_KEY,
      JSON.stringify(defaultDatabase)
    );

    console.log("PFB DATABASE INITIALIZED");

  } else {

    console.log("PFB DATABASE LOADED");

  }

}

/*
========================================
GET DATABASE
========================================
*/

function getDatabase(){

  return JSON.parse(
    localStorage.getItem(PFB_DATABASE_KEY)
  );

}

/*
========================================
SAVE DATABASE
========================================
*/

function saveDatabase(data){

  localStorage.setItem(
    PFB_DATABASE_KEY,
    JSON.stringify(data)
  );

}

/*
========================================
RESET DATABASE
========================================
*/

function resetDatabase(){

  localStorage.removeItem(PFB_DATABASE_KEY);

  initializeDatabase();

  console.log("PFB DATABASE RESET");

}

/*
========================================
GET VAULT BALANCE
========================================
*/

function getVaultBalance(vaultName){

  const db = getDatabase();

  return db.treasury.vaults[vaultName].balance;

}

/*
========================================
UPDATE VAULT BALANCE
========================================
*/

function updateVaultBalance(vaultName, amount){

  const db = getDatabase();

  db.treasury.vaults[vaultName].balance = amount;

  recalculateTreasury(db);

  saveDatabase(db);

}

/*
========================================
RECALCULATE TREASURY
========================================
*/

function recalculateTreasury(db){

  const vaults = db.treasury.vaults;

  let total = 0;

  Object.keys(vaults).forEach(key => {

    total += vaults[key].balance;

  });

  db.treasury.totalTreasury = total;

}

/*
========================================
ADD TRANSACTION
========================================
*/

function addTransaction(transaction){

  const db = getDatabase();

  db.transactions.unshift(transaction);

  saveDatabase(db);

}

/*
========================================
GENERATE REFERENCE ID
========================================
*/

function generateReference(prefix = "PFB"){

  const timestamp = Date.now();

  return `${prefix}-${timestamp}`;

}

/*
========================================
ADD AUDIT LOG
========================================
*/

function addAuditLog(action, actor = "Founder"){

  const db = getDatabase();

  db.auditLogs.unshift({

    action,
    actor,
    timestamp: new Date().toISOString()

  });

  saveDatabase(db);

}

/*
========================================
ADD NOTIFICATION
========================================
*/

function addNotification(message){

  const db = getDatabase();

  db.notifications.unshift({

    message,
    time: new Date().toISOString()

  });

  saveDatabase(db);

}

/*
========================================
SYSTEM BOOT
========================================
*/

initializeDatabase();
