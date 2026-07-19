/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Reward System: Virtual Rewards, XP, Currency & Disclaimer
   ========================================================================== */

class RewardSystem {
  constructor() {
    this.disclaimerNote = "Ces récompenses sont virtuelles et destinées exclusivement à la progression pédagogique.";
  }

  awardAnswer(profile, question, isCorrect) {
    if (!isCorrect) {
      // Deduct life
      const penalty = question.perte_vie || 1;
      profile.vies = Math.max(0, profile.vies - penalty);
      this.logAction(profile, "ÉCHEC", `Réponse incorrecte à ${question.id}. Vies restantes: ${profile.vies}`);
      return { xpGained: 0, rewardAmount: 0, livesLeft: profile.vies };
    }

    // Award XP and Virtual Money
    const xpGained = question.niveau * 25 + (question.piege ? 50 : 0);
    const rewardObj = question.recompense || { type: "CDF", montant: 5000 };
    
    profile.xp += xpGained;
    if (rewardObj.type === "CDF") {
      profile.solde.CDF += rewardObj.montant;
    } else if (rewardObj.type === "USD") {
      profile.solde.USD += rewardObj.montant;
    }

    this.logAction(profile, "RÉUSSITE", `+${xpGained} XP, +${rewardObj.montant} ${rewardObj.type} virtuels (${question.id})`);
    return { xpGained, rewardAmount: rewardObj.montant, currency: rewardObj.type, livesLeft: profile.vies };
  }

  refillLives(profile) {
    profile.vies = profile.maxVies || 5;
    window.persistenceEngine.saveProfile(profile);
  }

  logAction(profile, actionType, details) {
    if (!profile.historique) profile.historique = [];
    profile.historique.unshift({
      date: new Date().toISOString(),
      action: actionType,
      details: details
    });
    if (profile.historique.length > 50) profile.historique.pop();
  }
}

window.rewardEngine = new RewardSystem();
