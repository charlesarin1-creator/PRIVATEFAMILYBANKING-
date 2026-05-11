/* =========================================
   PRIVATE FAMILY BANKING
   ANALYTICS ENGINE V1
========================================= */


/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount){

  return `₦${Number(amount).toLocaleString()}`;

}



/* =========================================
   TOTAL TREASURY VALUE
========================================= */

function getTreasuryValue(){

  return treasuryState.totalBalance || 0;

}



/* =========================================
   TOTAL TRANSACTIONS
========================================= */

function getTotalTransactions(){

  return treasuryState.transactions.length;

}



/* =========================================
   TOTAL DEPOSITS
========================================= */

function getTotalDeposits(){

  let total = 0;

  treasuryState.transactions.forEach(t => {

    if(
      t.type === "DEPOSIT" ||
      t.type === "AUTO ALLOCATION"
    ){

      total += t.amount;

    }

  });

  return total;

}



/* =========================================
   TOTAL WITHDRAWALS
========================================= */

function getTotalWithdrawals(){

  let total = 0;

  treasuryState.transactions.forEach(t => {

    if(
      t.type === "WITHDRAWAL" ||
      t.type === "MERCY ALLOCATION"
    ){

      total += t.amount;

    }

  });

  return total;

}



/* =========================================
   CREDIT ANALYTICS
========================================= */

function getPendingCreditRequests(){

  return treasuryState.transactions.filter(

    t =>
      t.type === "CREDIT REQUEST" &&
      t.status === "PENDING"

  );

}



function getApprovedCredits(){

  return treasuryState.transactions.filter(

    t =>
      t.type === "CREDIT REQUEST" &&
      t.status === "APPROVED"

  );

}



function getRejectedCredits(){

  return treasuryState.transactions.filter(

    t =>
      t.type === "CREDIT REQUEST" &&
      t.status === "REJECTED"

  );

}



/* =========================================
   TREASURY GROWTH RATE
========================================= */

function calculateGrowthRate(){

  const initialCapital = 100000;

  const current =
    treasuryState.totalBalance;

  const growth =
    ((current - initialCapital)
    / initialCapital) * 100;

  return growth.toFixed(1);

}



/* =========================================
   VAULT DISTRIBUTION
========================================= */

function generateVaultDistribution(){

  const total =
    treasuryState.totalBalance;

  const distribution = {};

  Object.entries(treasuryState.vaults)
    .forEach(([vault, balance]) => {

      distribution[vault] = {

        balance,

        ratio:
          (
            (balance / total) * 100
          ).toFixed(1)

      };

    });

  return distribution;

}



/* =========================================
   GOVERNANCE ANALYTICS
========================================= */

function governanceAnalytics(){

  const reserveRatio =
    calculateVaultRatio("stability");

  const creditExposure =
    calculateCreditExposure();

  let status = "STABLE";

  if(reserveRatio < 30){

    status = "WARNING";

  }

  if(creditExposure > 30){

    status = "RISK";

  }

  return {

    reserveRatio:
      `${reserveRatio}%`,

    creditExposure:
      `${creditExposure}%`,

    governanceStatus:
      status

  };

}



/* =========================================
   MERCY ARM ANALYTICS
========================================= */

function mercyArmAnalytics(){

  let totalAllocated = 0;

  treasuryState.transactions.forEach(t => {

    if(t.type === "MERCY ALLOCATION"){

      totalAllocated += t.amount;

    }

  });

  return {

    currentBalance:
      treasuryState.vaults.mercyarm,

    totalMercyAllocated:
      totalAllocated

  };

}



/* =========================================
   MONTHLY TREASURY REPORT
========================================= */

function generateMonthlyReport(){

  const report = {

    generated:
      new Date().toLocaleString(),

    treasuryValue:
      getTreasuryValue(),

    growthRate:
      `${calculateGrowthRate()}%`,

    transactions:
      getTotalTransactions(),

    deposits:
      getTotalDeposits(),

    withdrawals:
      getTotalWithdrawals(),

    governance:
      governanceAnalytics(),

    mercyarm:
      mercyArmAnalytics(),

    vaults:
      generateVaultDistribution()

  };

  console.log(
    "MONTHLY TREASURY REPORT",
    report
  );

  return report;

}



/* =========================================
   EXPORT ANALYTICS REPORT
========================================= */

function exportAnalyticsReport(){

  const report =
    generateMonthlyReport();

  const blob =
    new Blob(

      [
        JSON.stringify(
          report,
          null,
          2
        )
      ],

      {
        type: "application/json"
      }

    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `PFB-Analytics-${Date.now()}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}



/* =========================================
   UPDATE ANALYTICS UI
========================================= */

function renderAnalytics(){

  const treasuryValue =
    document.getElementById(
      "analyticsTreasuryValue"
    );

  if(treasuryValue){

    treasuryValue.innerText =
      formatCurrency(
        getTreasuryValue()
      );

  }


  const transactionCount =
    document.getElementById(
      "analyticsTransactions"
    );

  if(transactionCount){

    transactionCount.innerText =
      getTotalTransactions();

  }


  const growth =
    document.getElementById(
      "analyticsGrowth"
    );

  if(growth){

    growth.innerText =
      `${calculateGrowthRate()}%`;

  }


  const reserve =
    document.getElementById(
      "analyticsReserve"
    );

  if(reserve){

    reserve.innerText =
      governanceAnalytics().reserveRatio;

  }


  const exposure =
    document.getElementById(
      "analyticsExposure"
    );

  if(exposure){

    exposure.innerText =
      governanceAnalytics().creditExposure;

  }

}



/* =========================================
   TREASURY INSIGHT ENGINE
========================================= */

function generateTreasuryInsights(){

  const insights = [];

  const reserve =
    parseFloat(
      governanceAnalytics().reserveRatio
    );

  const exposure =
    parseFloat(
      governanceAnalytics().creditExposure
    );

  if(reserve < 30){

    insights.push(
      "Reserve protection threshold approaching risk zone."
    );

  } else {

    insights.push(
      "Reserve protection stable."
    );

  }

  if(exposure > 30){

    insights.push(
      "Credit exposure above governance limit."
    );

  } else {

    insights.push(
      "Credit exposure within governance range."
    );

  }

  if(
    treasuryState.transactions.length < 5
  ){

    insights.push(
      "Treasury activity remains in early operational phase."
    );

  }

  return insights;

}



/* =========================================
   DISPLAY INSIGHTS
========================================= */

function renderTreasuryInsights(){

  const insightsContainer =
    document.getElementById(
      "treasuryInsights"
    );

  if(!insightsContainer) return;

  insightsContainer.innerHTML = "";

  generateTreasuryInsights()
    .forEach(insight => {

      insightsContainer.innerHTML += `

        <div class="insight-card">

          ${insight}

        </div>

      `;

    });

}



/* =========================================
   ANALYTICS BOOT
========================================= */

window.addEventListener(

  "load",

  () => {

    renderAnalytics();

    renderTreasuryInsights();

  }

);
