/**
 * FoundryVTT v13+ / dnd5e module
 * Requires midi-qol and is compatable with midi-qol
 *
 *   midi-qol (github.com/tposney/midi-qol):
 *     "midi-qol.preCheckHits" fires after roll, before hit adjudication.
 *     workflow.isCritical / workflow.isFumble are live and writable here.
 * 
 */

const MODULE_ID = "personal-5eLessBad";

let CRIT_THRESHOLD   = 18;
let FUMBLE_THRESHOLD = 4;
const D20_BASELINE   = 20;

function registerSettings() {
  game.settings.register(MODULE_ID, "baseCriticalThreshold", {
    name: "Base Critical Threshold",
    hint: "The 2d10 sum at or above which a roll is a critical hit (equivalent to a natural 20). Default 18.",
    scope: "world",
    config: true,
    default: 18,
    type: Number,
    requiresReload: true
  });
  game.settings.register(MODULE_ID, "baseFumbleThreshold", {
    name: "Base Fumble Threshold",
    hint: "The 2d10 sum at or below which a roll is a fumble (equivalent to a natural 1). Default 4.",
    scope: "world",
    config: true,
    default: 4,
    type: Number,
    requiresReload: true
  });
}

Hooks.on("init", () => {
  console.log(`[${MODULE_ID}] init fired`);
  registerSettings();
  CRIT_THRESHOLD   = game.settings.get(MODULE_ID, "baseCriticalThreshold");
  FUMBLE_THRESHOLD = game.settings.get(MODULE_ID, "baseFumbleThreshold");
  console.log(`[${MODULE_ID}] Thresholds — crit: ${CRIT_THRESHOLD}, fumble: ${FUMBLE_THRESHOLD}`);

  // ── TwoTenRoll ─────────────────────────────────────────────────────────────
  class TwoTenRoll extends dnd5e.dice.D20Roll {
    constructor(formula, data, options = {}) {
      // 1. Priority check: Did we already stash this in a previous instantiation?
      // 2. Secondary check: Is there a valid d20 threshold (1-20)?
      // 3. Fallback: Use the baseline 20.
      const stashed = options._d20CritThreshold;
      const incoming = options.criticalSuccess;
      
      let effectiveD20Threshold;
      
      if (typeof stashed === "number") {
        effectiveD20Threshold = stashed;
      } else if (typeof incoming === "number" && incoming > 0 && incoming <= 20) {
        effectiveD20Threshold = incoming;
      } else {
        effectiveD20Threshold = D20_BASELINE;
      }

      // Now set the stashed value and the sentinels
      options._d20CritThreshold = effectiveD20Threshold;
      options.criticalSuccess   = 99;
      options.criticalFailure   = -99;
      options.critical          = 99;
      options.fumble            = -99;

      super(formula, data, options);
      
      // Debug log only on the first "real" capture to reduce console spam
      if (typeof stashed === "undefined") {
        console.log(`[${MODULE_ID}] Initial Threshold Captured: ${effectiveD20Threshold}`);
      }
    }

    /**
     * Sums the active (kept) d10 results on this roll.
     * .active respects kh/kl modifiers, so 3d10kh2 / 3d10kl2 work correctly.
     * @returns {number|null}
     */
    #getNaturalSum() {
      let total = 0, found = false;
      for (const term of this.terms) {
        if (!(term instanceof Die) || term.faces !== 10) continue;
        for (const r of term.results) {
          if (r.active) { total += r.result; found = true; }
        }
      }
      return found ? total : null;
    }

    /**
     * Converts the stashed d20 threshold to its 2d10 equivalent.
     * effective_2d10 = CRIT_THRESHOLD - (D20_BASELINE - d20Threshold)
     * @returns {number}
     */

    #getEffectiveCritThreshold() {
      // Calculate the 2d10 equivalent:
      // $$effective = CRIT\_THRESHOLD - (20 - d20Threshold)$$
      const d20Threshold = this.options._d20CritThreshold ?? D20_BASELINE;
      return CRIT_THRESHOLD - (D20_BASELINE - d20Threshold);
    }

    /** Swap the d20 term for 2d10 (or 3d10kh2 / 3d10kl2 on adv/disadv). */
    async configureModifiers() {
      await super.configureModifiers();
      let dice;
      if      (this.options.advantageMode ===  1) dice = "3d10kh2";
      else if (this.options.advantageMode === -1) dice = "3d10kl2";
      else                                         dice = "2d10";
      console.log(`[${MODULE_ID}] configureModifiers | swapping d20 → ${dice}`);
      this.terms.splice(0, 1, ...new Roll(dice).terms);
      this._formula = Roll.getFormula(this.terms);
      console.log(`[${MODULE_ID}] configureModifiers | new formula: "${this._formula}"`);
    }

    get isCritical() {
      if (!this._evaluated) return false;
      // Use the cached total if available to avoid re-iterating terms
      const sum = this.#getNaturalSum();
      const threshold = this.#getEffectiveCritThreshold();
      return sum !== null && sum >= threshold;
    }

    get isFumble() {
      if (!this._evaluated) return false;
      const sum    = this.#getNaturalSum();
      const result = sum !== null && sum <= FUMBLE_THRESHOLD;
      console.log(`[${MODULE_ID}] isFumble | sum=${sum} threshold=${FUMBLE_THRESHOLD} → ${result}`);
      return result;
    }

    get validD20Roll() { return true; }

    async evaluate(options = {}) {
      await super.evaluate(options);
      if (Array.isArray(this.options.attributions)) {
        this.options.attributions = this.options.attributions.filter(
          a => a.source !== "naturalFumble" && a.source !== "naturalCritical"
        );
      }
      console.log(`[${MODULE_ID}] evaluate | total=${this.total} | sum=${this.#getNaturalSum()} | crit=${this.isCritical} | fumble=${this.isFumble}`);
      return this;
    }
  }

  // ── Register with Foundry ──────────────────────────────────────────────────
  CONFIG.Dice.TwoTenRoll = TwoTenRoll;
  if (!CONFIG.Dice.rolls.includes(TwoTenRoll)) CONFIG.Dice.rolls.push(TwoTenRoll);
  CONFIG.Dice.D20Roll = TwoTenRoll;
  console.log(`[${MODULE_ID}] CONFIG.Dice.D20Roll → TwoTenRoll`);

  CONFIG.Combat.initiative.formula =
    "2d10 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus";

  // ── midi-qol.preCheckHits ──────────────────────────────────────────────────
  Hooks.on("midi-qol.preCheckHits", (workflow) => {
    const roll = workflow?.attackRoll;
    if (!(roll instanceof TwoTenRoll)) return;
    console.log(`[${MODULE_ID}] midi-qol.preCheckHits | total=${roll.total} | crit=${roll.isCritical} | fumble=${roll.isFumble}`);
    workflow.isCritical = roll.isCritical;
    workflow.isFumble   = roll.isFumble;
    console.log(`[${MODULE_ID}] midi-qol.preCheckHits | workflow flags synced`);
  });

  console.log(`[${MODULE_ID}] init complete`);
});