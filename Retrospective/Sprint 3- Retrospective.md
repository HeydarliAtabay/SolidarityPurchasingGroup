# RETROSPECTIVE of THIRD SPRINT (Team R02)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Committed Stories: 8 ; Stories Done: 8
- Committed Points: 42; Points Done: 42
- Planned Hours: 98h ; Spent Hours: 100h 50m


**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual     |
| ----- | ------- | ------ | ---------- | ---------------- |
| _#0_  | 10      | -       | 72h 30m     | 63h 50m          |
| _#15_  | 2       | 2      | 1h 30m     |      3h 30m        |
| _#16_  | 2       | 13     | 1h         |      2h 30m         |
| _#21_  | 2       | 5      | 2h         |      3h 45m      |
| _#22_  | 2       | 5      | 5h         |      5h 15m        |
| _#23_  | 2       | 8      | 2h         |      4h        |
| _#24_  | 2       | 5      | 4h         |      4h      |
| _#25_  | 2       | 2      | 2h         |      3h         |
| _#26_  | 2       | 2      | 8h         |      11h      |
> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Average hour per task: 100.8(hours)/26(#tasks)= 3.87 hours; 
- Standard deviation: 0.54
- Total task estimation error ratio: 0.972

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 3d 6h ( 30 hours for implementing unit tests) 
  - Total hours spent: 13h 
  - Nr of automated unit test cases : 30(for BackEnd) + 42(for FrontEnd) = 72 unit test cases [Please Modify this part :)]

- E2E testing:
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent: 8 h
- Code review
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent:8 h
- Technical Debt management:
  - Total hours estimated: 1d 2h 30m
  - Total hours spent: 1d
  - Hours estimated for remediation by SonarQube: 3h (only in Maintainability - fixing code smells)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 3h (only in Maintainability - fixing code smells)
  - Hours spent on remediation: 1d 2h 30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): Reliability - A, Security - A, Maintainability - A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Reviewing globally the app and controlling that every story is correctly connected to the others


- What lessons did you learn (both positive and negative) in this sprint?
  - Comment more our code to let the other group mates understand what we did.
  - Write a general documentation in the readme file (for example write the users credentials).
  - A good FE needs more development time allocated.


- Which improvement goals set in the previous retrospective were you able to achieve?
  - We have cured more the design of our application and made all the pages responsive
  - We have added to the read.me file api calls explanations 
  - We have fixed all the past and new issues and the stories left from previous sprint

- Which ones you were not able to achieve? Why?
  - We achieved all of the goals set in the previous retrospective.


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We need to increase the technical debt remediation time and to increase the number of technical tasks needed to refactor our code and make the UI responsive.
  - We plan to develop less stories and focus more on the currently open issues and app visual improvements.



- One thing you are proud of as a Team!!
  - We supported each other on any difficulty that appeared.




