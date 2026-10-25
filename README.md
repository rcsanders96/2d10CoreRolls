# 2d10CoreRolls
A simple module that changes all initiative, ability checks, skills, saving throws, and attack rolls to be 2d10 instead of 1d20. Requires the lib-wrapper module. Works best with Midi-QoL.


### Mechanics
All 1d20 rolls in the game are replaced with a sum of 2d10.
- You can still manually roll 1d20's by using /roll 1d20 in chat or by using something like the dice tray module. However, rolls handled by the 5e system (like those triggered by clicking on your character sheet) are intercepted and changed into 2d10 rolls.
- Advantage is handled by rolling 3d10 and taking the highest 2. Disadvantage, conversely, is handled by taking the lowest 2.
- A critical hit is a natural roll of 20, 19, or 18.
- A critical failure is a natural roll of 2, 3, or 4.
- Decreased critical thresholds (like with the champion fighter) function as normal: the number required is decreased by 1. So, a champion fighter should crit on a natural roll of 17 - 20, for example.

### Statistics
The purpose of the 2d10 system is to keep the numbers of 1d20, but skew results a little more towards a predictable average while still allowing for a good amount of chaos (as opposed to something highly predictable, like a 3d6 system.)
<img width="1668" height="400" alt="10v20v6 raw" src="https://github.com/user-attachments/assets/1ef99bcd-7e20-4582-bdeb-9d6775dd9410" />
