/* =========================================
   PRIVATE FAMILY BANKING
   STORAGE ENGINE V1
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const STORAGE_KEYS = {

  treasury: "pfbTreasury",

  transactions: "pfbTransactions",

  governance: "pfbGovernance",

  settings: "pfbSettings",

  credit: "pfbCreditRegister",

  reviews: "pfbQuarterlyReviews"

};



/* =========================================
   SAVE DATA
========================================= */

function saveData(key, data){

  try{

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return true;

  } catch(error){

    console.error(
      "Storage Save Error:",
      error
    );

    return false;

  }

}



/* =========================================
   LOAD DATA
========================================= */

function loadData(key){

  try{

    const data =
      localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : null;

  } catch(error){

    console.error(
      "Storage Load Error:",
      error
    );

    return null;

  }

}



/* =========================================
   REMOVE DATA
========================================= */

function removeData(key){

  try{

    localStorage.removeItem(key);

    return true;

  } catch(error){

    console.error(
      "Storage Remove Error:",
      error
    );

    return false;

  }

}



/* =========================================
   CLEAR ENTIRE PFB SYSTEM
========================================= */

function clearPFBSystem(){

  const confirmation =
    confirm(
      "This will erase the entire treasury system. Continue?"
    );

  if(!confirmation) return;

  Object.values(STORAGE_KEYS)
    .forEach(key => {

      localStorage.removeItem(key);

    });

  alert(
    "PRIVATE FAMILY BANKING storage cleared."
  );

  location.reload();

}



/* =========================================
   EXPORT SYSTEM DATA
========================================= */

function exportTreasuryData(){

  const exportObject = {

    treasury:
      loadData(STORAGE_KEYS.treasury),

    transactions:
      loadData(STORAGE_KEYS.transactions),

    governance:
      loadData(STORAGE_KEYS.governance),

    credit:
      loadData(STORAGE_KEYS.credit),

    reviews:
      loadData(STORAGE_KEYS.reviews),

    exportDate:
      new Date().toLocaleString()

  };

  const dataStr =
    JSON.stringify(exportObject, null, 2);

  const blob =
    new Blob([dataStr], {
      type: "application/json"
    });

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `PFB-Treasury-Backup-${Date.now()}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}



/* =========================================
   IMPORT SYSTEM DATA
========================================= */

function importTreasuryData(event){

  const file =
    event.target.files[0];

  if(!file){

    alert("No file selected.");
    return;

  }

  const reader =
    new FileReader();

  reader.onload = function(e){

    try{

      const imported =
        JSON.parse(e.target.result);

      if(imported.treasury){

        saveData(
          STORAGE_KEYS.treasury,
          imported.treasury
        );

      }

      if(imported.transactions){

        saveData(
          STORAGE_KEYS.transactions,
          imported.transactions
        );

      }

      if(imported.governance){

        saveData(
          STORAGE_KEYS.governance,
          imported.governance
        );

      }

      if(imported.credit){

        saveData(
          STORAGE_KEYS.credit,
          imported.credit
        );

      }

      if(imported.reviews){

        saveData(
          STORAGE_KEYS.reviews,
          imported.reviews
        );

      }

      alert(
        "Treasury system imported successfully."
      );

      location.reload();

    } catch(error){

      console.error(error);

      alert(
        "Invalid treasury backup file."
      );

    }

  };

  reader.readAsText(file);

}



/* =========================================
   STORAGE HEALTH CHECK
========================================= */

function checkStorageHealth(){

  try{

    const testKey = "pfbTest";

    localStorage.setItem(testKey, "working");

    localStorage.removeItem(testKey);

    return true;

  } catch(error){

    console.error(
      "Storage system unavailable."
    );

    return false;

  }

}



/* =========================================
   AUTO BACKUP SYSTEM
========================================= */

function autoBackupTreasury(){

  const treasury =
    loadData(STORAGE_KEYS.treasury);

  if(!treasury) return;

  saveData(

    `PFB_BACKUP_${Date.now()}`,

    treasury

  );

}



/* =========================================
   BACKUP CLEANER
========================================= */

function cleanOldBackups(){

  const keys =
    Object.keys(localStorage);

  const backupKeys =
    keys.filter(key =>
      key.startsWith("PFB_BACKUP_")
    );

  if(backupKeys.length <= 5) return;

  backupKeys.sort();

  const oldBackups =
    backupKeys.slice(
      0,
      backupKeys.length - 5
    );

  oldBackups.forEach(key => {

    localStorage.removeItem(key);

  });

}



/* =========================================
   SYSTEM INITIALIZATION
========================================= */

(function initializeStorage(){

  const healthy =
    checkStorageHealth();

  if(!healthy){

    alert(
      "Local storage unavailable. Treasury persistence disabled."
    );

    return;

  }

  autoBackupTreasury();

  cleanOldBackups();

})();
