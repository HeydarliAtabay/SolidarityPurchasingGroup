# RETROSPECTIVE of FIRST SPRINT (Team R02)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Committed Stories: 8 ; Stories Done: 8
- Committed Points: 43; Points Done: 43
- Planned Hours: 99h 15m ; Spent Hours: 97h 55m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual     |
| ----- | ------- | ------ | ---------- | ---------------- |
| _#0_  | 8       | -      | 55h 15m    | 50h 55m          |
| _#1_  | 2       | 8      | 8h         | 8h               |
| _#2_  | 2       | 3      | 3h         | 45m              |
| _#3_  | 2       | 13     | 12h        | 18h              |
| _#4_  | 2       | 5      | 4h         | 4h               |
| _#5_  | 2       | 2      | 4h         | 4h 30m           |
| _#6_  | 2       | 2      | 3h         | 4h 30m           |
| _#7_  | 2       | 8      | 6h         | 7h               |
| _#8_  | 2       | 2      | 4h         | 3h               |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Average hour per task: 97.9(hours)/19(#tasks)= 4.07 hours; Standard deviation:[can you please calculate it??]
- Total task estimation error ratio: 1.013

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 36h (6h of studying unit testing methods & 30 hours for implementing tests) 
  - Total hours spent: 33h (9h of studying unit testing methods & 24 hours of testing)
  - Nr of automated unit test cases : 17(BackEnd)+36(FrontEnd) = 53 unit test cases

- E2E testing:
  - Total hours estimated: --------------------------
  - Total hours spent: ---------------------
- Code review
  - Total hours estimated
  - Total hours spent
- Technical Debt management:
  - Total hours estimated: 1h 30min
  - Total hours spent: 1h 30min
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Underestimated need for coordination between team members (many modules of the app were linked and were dependent on one another)
  - Underestimated code documentation and testing time


- What lessons did you learn (both positive and negative) in this sprint?
  - The need for a well-documented code is essential in a team-working environment
  - We need to schedule more time for organization and coordination meetings
  - We need to better divide the tasks among team members to reduce wasted time on coordination


- Which improvement goals set in the previous retrospective were you able to achieve?
  - Nothing
- Which ones you were not able to achieve? Why?
  - Nothing

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Loose less time in coordination efforts by estimating more hours for communication and documentation
  - Better define tasks to reduce task dependencies and improve the possibility for all team members to work in parallel


- One thing you are proud of as a Team!!
  - Everyone worked really hard to provide a perfectly working demo
  - The communication between team members was extremely friendly
