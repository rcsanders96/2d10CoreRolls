# 2d10CoreRolls
A simple module that changes all initiative, ability checks, skills, saving throws, and attack rolls to be 2d10 instead of 1d20. Requires the lib-wrapper module. Works best with Midi-QoL.


## Mechanics
All 1d20 rolls in the game are replaced with a sum of 2d10.
- You can still manually roll 1d20's by using "/roll 1d20" in chat or by using something like the dice tray module. However, rolls handled by the 5e system (like those triggered by clicking on your character sheet) are intercepted and changed into 2d10 rolls.
- Advantage is handled by rolling 3d10 and taking the highest 2.
- Disadvantage, conversely, is handled by rolling 3d10 and taking the lowest 2.
- A critical hit is a natural roll of 20, 19, or 18.
- A critical failure is a natural roll of 2, 3, or 4.
- Decreased critical thresholds (like with the champion fighter) function as normal: the number required is decreased by 1. So, a champion fighter should crit on a natural roll of 17 - 20, for example.

## Statistics

### Summary
The purpose of the 2d10 system is to keep the numbers of 1d20, but skew the results a little more towards a predictable average while still allowing for a good amount of chaos (as opposed to something highly predictable, like a 3d6 system).

Shown: Probability of rolling any given number. 1d20 vs 2d10 vs 3d6
<img width="1668" height="402" alt="10v20v6 raw" src="https://github.com/user-attachments/assets/1361e0c5-db49-4fa2-8c31-9d2010b41e6e" />



The following is expanded upon further down:
- The chance of rolling a natural 12 or higher using 2d10 is exactly the same as 1d20
  - If the number you need to roll is less than a natural 12, you're more likely to get it using a 2d10
  - If it's higher than 12, you're less likely to get it using a 2d10.
- Normal Critical Hit/Miss chances are only 1% off (6% on 2d10 vs 5% on 1d20)
  - Improved and Superior Critical Hit chances are identical (10% and 15%, respectively)
- Success Chances when rolling with Advantage and Disadvantage are mostly the same
  - However, you are ~5% more likely to Critically Succeed when rolling with advantage (when compared to 1d20) and 5% more likely to Critically Fail when rolling with disadvantage.




### Normal Rolls
As a GM and/or Player, you should expect to hit low target numbers more often and higher ones less often. 
- Specifically, the break point is 12. 2d10 is just as likely to roll a natural 12 or higher as a 1d20 is.
- If the number you need from the dice is less than a natural 12, you'll be more likely to succeed
  - Up to 15% higher, at 7, which comes out to 21.4% more likely by comparison
- If the number you need from the dice is more than a natural 12, you'll be less likely to succeed
  - Up to 10% lower, at 17, which comes out to 50% less likely by comparison

Shown: Probability of rolling a given number or higher. 1d20 vs 2d10
<img width="1671" height="406" alt="10v20 roll at least" src="https://github.com/user-attachments/assets/08f3c3f2-e5fa-4bd5-96b1-3113fc625ea1" />

Critical Hits and Critical failures are roughly the same, 6% vs 5% (so, 20% more likely on average).
- Interestingly, because of how the 2d10 table works, you have ***exactly*** the same chance to roll a critical hit with Improved and Superior critical


### Advantage and Disadvantage
While rolling with advantage does give 2d10 a much higher chance of rolling a particularly high number, the 2 systems are actually much closer than standard rolls when contextualized in the form of rolling at "least X or higher."
- Average Roll for 1d20 with advantage: 13.82
- Average Roll for 2d10 with advantage: 13.48

Disadvantage slightly breaks the pattern
- Average Roll for 1d20 with disadvantage: 7.17
- Average Roll for 2d10 with disadvantage: 8.52


Critical Success Chances when Rolling with Advantage
- Normal: 14.9% vs 9.75%. 5.15% more likely in total, ~52.8% more likely by comparison
- Improved: 23.3% vs 19%. 4.3% more likely in total, ~22.6% more likely by comparison
- Superior: 32.7% vs 27.75%. 4.95% more likely in total, ~17.8% more likely by comparison

### Compounding Effects on 5e's Balance
Since AC and To-Hit bonuses often increase with a monster's CR in 5e, the party will find groups of weak enemies easier and singular big monsters harder.
- A high AC will be far more effective and a low AC will be far more punishing. This may be good or bad, depending on group. In my group, it's forced the party to pay attention to the environment more often and it's forced me to make more interesting environments, as anything that can give one side a bonus to rolls will matter a lot more to them.
