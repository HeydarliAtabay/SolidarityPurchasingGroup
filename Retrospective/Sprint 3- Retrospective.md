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


Story 0 in-depth - fixing Git issues:
- Navbar color contrast issue -> Navbar was completely redesigned
- Shopping cart not allowing floating point values -> shopping cart now increments the quantity by 0.5 units instead of 1 unit 


Sprint statistics
- Average hour per task: 100.8(hours)/26(#tasks)= 3.87 hours; 
- Standard deviation: 0.54
- Total task estimation error ratio: 0.972

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 3d 6h ( hours for implementing unit tests) 
  - Total hours spent: 1d 5h 
  - Nr of automated unit test cases : 46 (for BackEnd) + 47 (for FrontEnd) = 93 unit test cases

- E2E testing:
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent: 8 h
- Code review
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent:8 h
- Technical Debt management:
  - Total hours estimated: 1d 2h 30m
  - Total hours spent: 1d
  - Hours estimated for remediation by SonarQube: 2d (only in Maintainability - fixing code smells)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 1d 7h (only in New Code - Maintainability - fixing code smells)
  - Hours spent on remediation: 1d
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): Reliability - A, Security - A, Maintainability - A

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Reviewing globally the app and controlling that every story is correctly connected to the others
  - Making well-designed and responsive pages is not always a straight-forward process



- What lessons did you learn (both positive and negative) in this sprint?
  - Story integration was not as swift as we expected. We faced some initial difficulty on integrating our previously implemented stories with the new ones
  - Documentation (the Git readme) proved to be very helpful and we often used it as a “manual” to quickly search and get the information we needed
  - At the end of this sprint we were able to deliver a much better looking and much more responsive app. This step helped us better understand the effects of a better design on the stakeholders feedback and “happiness”



- Which improvement goals set in the previous retrospective were you able to achieve?
  - We have cured more the design of our application and made all the pages responsive
  - We have added to the readme file all the API calls and the corresponding explanations 
  - We have fixed most of the past and new issues and we have completed all the stories left from previous sprint


- Which ones you were not able to achieve? Why?
  - We achieved all of the goals set in the previous retrospective


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We need to further improve the design and the usability of our application
  - We need to better show the state of our system by showing more meaningful alerts and messages to the user
  - We plan to increase the amount and granularity of our test suites to achieve a higher coverage and to discover bugs quicker


- One thing you are proud of as a Team!!
  - Teamwork, as it was also the case in the previous two sprints, was awesome. We helped each other in solving problems and reviewing code from previously implemented stories





