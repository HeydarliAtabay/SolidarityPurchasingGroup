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

- Average hour per task: 97.9(hours)/19(#tasks)= 4.07 hours; 
- Standard deviation: 0.28
- Total task estimation error ratio: 1.013

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 30h (6h of studying unit testing methods & 24 hours for implementing tests) 
  - Total hours spent: 33h (9h of studying unit testing methods & 24 hours of testing)
  - Nr of automated unit test cases : 17(for BackEnd)+36(for FrontEnd) = 53 unit test cases

- E2E testing:
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent: 6h
- Code review
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent: 10h
- Technical Debt management:
  - Total hours estimated: 6h
  - Total hours spent: 3h
  - Hours estimated for remediation by SonarQube: 1d3h (only in Maintainability - fixing code smells)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 1d3h (only in Maintainability - fixing code smells)
  - Hours spent on remediation: 3h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.7%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): Reliability - A, Security - A, Maintainability - A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - FE development time was underestimated. We ended up reallocating time from the BE tasks to deliver a good UI for the tasks.
  - JEST testing proved much more difficult and tricky than we thought
  - We included also SonarQube analysis under the "Implement test" task, but since the actual JEST testing proved a lot tougher, we ended up not having enough time to properly do the SonarQube analysis.
  - We forgot to include in the DB task the fact that we needed a certain number of dummy data to be inserted (as requested by the project PDF).


- What lessons did you learn (both positive and negative) in this sprint?
  - Testing, especially the Technical dept part needs more time to be properly done.
  - The testing and technical debt tasks need to separated.
  - A good FE needs more development time allocated.


- Which improvement goals set in the previous retrospective were you able to achieve?
  - Tasks were much better divided this time, which in turn decreased a lot the continuous communication efforts needed.
- Which ones you were not able to achieve? Why?
  - We did not succeed in increasing the code documentation size since by better dividing the tasks, the need for very detailed documentation decreased. This may well prove problematic in the future if we will need to do incremental work on already implemented features. 

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - More time for testing.
  - By better understanding the current suggestions of Sonarcloud, in the future we can write better code and in turn reduce the remediation efforts.
  - Testing needs to be treated differently from Technical debt and more time needs to be dedicated to the Technical debt part.


- One thing you are proud of as a Team!!
  - Everyone finished all of their tasks and delivered working code.
  - Team members communication and availability was outstanding. 



