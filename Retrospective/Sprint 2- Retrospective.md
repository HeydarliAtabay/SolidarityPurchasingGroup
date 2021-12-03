# RETROSPECTIVE of SECOND SPRINT (Team R02)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Committed Stories: 12 ; Stories Done: 10
- Committed Points: 53; Points Done: 38
- Planned Hours: 99h 30m ; Spent Hours: 102h 10m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual     |
| ----- | ------- | ------ | ---------- | ---------------- |
| _#0_  | 13       | -      | 53h 30m    | 49h 30m          |
| _#9_  | 2       | 8      | 5h         | 5h 30m              |
| _#10_  | 2       | 2      | 4h 30m         | 45m              |
| _#11_  | 2       | 8     | 5h        | 3h 30m             |
| _#12_  | 2       | 5      | 5h         | 5h               |
| _#13_  | 2       | 2      | 1h 30m         | 1h 10m           |
| _#17_  | 2       | 2      | 3h         | 3h           |
| _#15_  | 2       | 2      | 4h         | 7h               |
| _#16_  | 2       | 13      | 5h         | 5h               |
| _#14_  | 2       | 2      | 2h         | 2h 30m           |
| _#18_  | 2       | 2      | 5h         | 7h30m           |
| _#19_  | 1       | 2      | 2h         | 2h               |
| _#20_  | 2       | 5      | 4h         | 4h               |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Average hour per task: 102.15(hours)/36(#tasks)= 2.83 hours; 
- Standard deviation: 0.46
- Total task estimation error ratio: 0.97

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 3d 6h ( hours for implementing unit tests) 
  - Total hours spent: 19h 30m 
  - Nr of automated unit test cases : 30(for BackEnd) + 42(for FrontEnd) = 72 unit test cases

- E2E testing:
  - Total hours estimated: 12h (1h per story) - included inside each story
  - Total hours spent: 12 h
- Code review
  - Total hours estimated: 12h (1h per story) - included inside each story
  - Total hours spent:12 h
- Technical Debt management:
  - Total hours estimated: 1d 1h
  - Total hours spent: 6h
  - Hours estimated for remediation by SonarQube: 3h (only in Maintainability - fixing code smells)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 3h (only in Maintainability - fixing code smells)
  - Hours spent on remediation: 6h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.5%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): Reliability - A, Security - A, Maintainability - A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - FE development time was underestimated. We ended up reallocating time from the BE tasks to deliver a good UI for the tasks.
  - We lost some time in interpreting the meaning of some stories and estimate correctly the time to implement them.
  - We underestimated the time needed to update the database with the correct tables and columns to support the stories.


- What lessons did you learn (both positive and negative) in this sprint?
  - Comment more our code to let the other group mates understand what we did.
  - Write a general documentation in the readme file (for example write the users credentials).
  - A good FE needs more development time allocated.


- Which improvement goals set in the previous retrospective were you able to achieve?
  - We allocated more time for implementing tests.
  - Remediation effort on new code decreased considerably since we had the chance to learn from SonarCloud how to write better code.
  - We created an appropriate task for the Technical debt remediation and the result was much better in terms of remediation efforts needed on new code.

Which ones you were not able to achieve? Why?
  - We achieved all of the goals set in the previous retrospective.


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We need to increase the technical debt remediation time and to increase the number of technical tasks needed to refactor our code and make the UI responsive.
  - We plan to develop less stories and focus more on the currently open issues and app visual improvements.



- One thing you are proud of as a Team!!
  - We supported each other on any difficulty that appeared.




