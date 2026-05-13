/* =========================================================
   governance-engine.js
   PRIVATE FAMILY BANKING — Institutional Governance Engine
   Constitutional Treasury Enforcement Layer
========================================================= */

(function () {

  const GovernanceEngine = {

    /* =========================================
       GOVERNANCE CONFIGURATION
    ========================================= */

    config: {

      minimumReserveRatio: 0.30,

      maxCreditExposure: 0.20,

      withdrawalDelayThreshold: 50000,

      mercyArmProtected: true,

      emergencyLockdown: false,

      governanceVersion: "PFB-GOV-1.0",

      restrictedVaults: [
        "stability",
        "mercy"
      ]

    },

    /* =========================================
       INITIALIZE
    ========================================= */

    init() {

      this.ensureGovernanceStorage();

      this.runGovernanceAudit();

      console.log(
        "PFB Governance Engine Active"
      );

    },

    /* =========================================
       STORAGE SETUP
    ========================================= */

    ensureGovernanceStorage() {

      if (!localStorage.getItem("pfb_governance")) {

        const defaultGovernance = {

          reserveProtection: true,

          creditProtection: true,

          mercyArmProtection: true,

          lockdownMode: false,

          lastAudit: new Date().toISOString(),

          governanceAlerts: [],

          governanceHistory: []

        };

        localStorage.setItem(
          "pfb_governance",
          JSON.stringify(defaultGovernance)
        );

      }

    },

    /* =========================================
       GET GOVERNANCE DATA
    ========================================= */

    getGovernance() {

      return JSON.parse(
        localStorage.getItem("pfb_governance")
      );

    },

    /* =========================================
       SAVE GOVERNANCE DATA
    ========================================= */

    saveGovernance(data) {

      localStorage.setItem(
        "pfb_governance",
        JSON.stringify(data)
      );

    },

    /* =========================================
       AUDIT ENGINE
    ========================================= */

    runGovernanceAudit() {

      const treasury =
        this.getTreasuryData();

      const governance =
        this.getGovernance();

      governance.lastAudit =
        new Date().toISOString();

      governance.governanceAlerts = [];

      /* RESERVE RATIO CHECK */

      const reserveRatio =
        treasury.stability /
        treasury.total;

      if (
        reserveRatio <
        this.config.minimumReserveRatio
      ) {

        governance.governanceAlerts.push({

          level: "critical",

          title: "Reserve Ratio Breach",

          message:
            "Stability reserve below governance threshold.",

          timestamp:
            new Date().toISOString()

        });

      }

      /* CREDIT EXPOSURE CHECK */

      const exposure =
        treasury.creditExposure /
        treasury.total;

      if (
        exposure >
        this.config.maxCreditExposure
      ) {

        governance.governanceAlerts.push({

          level: "warning",

          title: "Credit Exposure Risk",

          message:
            "Credit exposure exceeded governance limit.",

          timestamp:
            new Date().toISOString()

        });

      }

      /* MERCY ARM PROTECTION */

      if (
        treasury.mercy < 0
      ) {

        governance.governanceAlerts.push({

          level: "critical",

          title: "Mercy ARM Breach",

          message:
            "Mercy ARM reserve compromised.",

          timestamp:
            new Date().toISOString()

        });

      }

      governance.governanceHistory.push({

        auditDate:
          new Date().toISOString(),

        reserveRatio:
          reserveRatio,

        exposure:
          exposure,

        treasuryTotal:
          treasury.total

      });

      this.saveGovernance(governance);

    },

    /* =========================================
       TREASURY ACCESS
    ========================================= */

    getTreasuryData() {

      const treasury =
        JSON.parse(
          localStorage.getItem("pfb_treasury")
        ) || {};

      return {

        total:
          treasury.totalTreasury || 115320,

        stability:
          treasury.stabilityReserve || 35000,

        expansion:
          treasury.expansionVault || 20000,

        operations:
          treasury.operationsVault || 25000,

        credit:
          treasury.creditVault || 15000,

        mercy:
          treasury.mercyArmVault || 15320,

        creditExposure:
          treasury.creditExposure || 0

      };

    },

    /* =========================================
       WITHDRAWAL VALIDATION
    ========================================= */

    validateWithdrawal(vault, amount) {

      const treasury =
        this.getTreasuryData();

      if (
        this.config.emergencyLockdown
      ) {

        return {

          approved: false,

          reason:
            "Emergency lockdown active."

        };

      }

      if (
        this.config.restrictedVaults.includes(vault)
      ) {

        return {

          approved: false,

          reason:
            "Protected vault withdrawal restricted."

        };

      }

      if (
        amount >
        this.config.withdrawalDelayThreshold
      ) {

        return {

          approved: false,

          reason:
            "Governance review required."

        };

      }

      return {

        approved: true,

        reason:
          "Withdrawal within governance policy."

      };

    },

    /* =========================================
       CREDIT VALIDATION
    ========================================= */

    validateCredit(amount) {

      const treasury =
        this.getTreasuryData();

      const projectedExposure =
        (
          treasury.creditExposure +
          amount
        ) / treasury.total;

      if (
        projectedExposure >
        this.config.maxCreditExposure
      ) {

        return {

          approved: false,

          reason:
            "Credit exposure exceeds policy."

        };

      }

      return {

        approved: true,

        reason:
          "Credit request within policy."

      };

    },

    /* =========================================
       GOVERNANCE ALERTS
    ========================================= */

    getAlerts() {

      const governance =
        this.getGovernance();

      return governance.governanceAlerts;

    },

    /* =========================================
       LOCKDOWN CONTROL
    ========================================= */

    activateLockdown(reason) {

      const governance =
        this.getGovernance();

      governance.lockdownMode = true;

      governance.governanceAlerts.push({

        level: "critical",

        title: "Emergency Lockdown Activated",

        message: reason,

        timestamp:
          new Date().toISOString()

      });

      this.config.emergencyLockdown = true;

      this.saveGovernance(governance);

    },

    deactivateLockdown() {

      const governance =
        this.getGovernance();

      governance.lockdownMode = false;

      this.config.emergencyLockdown = false;

      this.saveGovernance(governance);

    },

    /* =========================================
       GOVERNANCE REPORT
    ========================================= */

    generateGovernanceReport() {

      const treasury =
        this.getTreasuryData();

      const governance =
        this.getGovernance();

      return {

        version:
          this.config.governanceVersion,

        treasury,

        alerts:
          governance.governanceAlerts,

        lastAudit:
          governance.lastAudit,

        lockdown:
          governance.lockdownMode,

        reserveRatio:
          (
            treasury.stability /
            treasury.total
          ).toFixed(2),

        creditExposure:
          (
            treasury.creditExposure /
            treasury.total
          ).toFixed(2)

      };

    }

  };

  /* =========================================
     GLOBAL ACCESS
  ========================================= */

  window.GovernanceEngine =
    GovernanceEngine;

  /* =========================================
     AUTO START
  ========================================= */

  GovernanceEngine.init();

})();
