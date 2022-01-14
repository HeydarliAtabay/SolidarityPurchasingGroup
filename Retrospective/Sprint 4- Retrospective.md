# RETROSPECTIVE of FOURTH SPRINT (Team R02)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Committed Stories: 8 ; Stories Done: 6
- Committed Points: 81; Points Done: 68
- Planned Hours: 98h  ; Spent Hours: 102h 30m


**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual     |
| ----- | ------- | ------ | ---------- | ---------------- |
| _#0_  | 7      | -       | 60h 15m     | 63h 50m          |
| _#40_  | 2       | 13     | 5h     |      5h 30m        |
| _#41_  | 2       | 5     | 5h         |      0h         |
| _#42_  | 2       | 21      | 9h         |      9h       |
| _#43_  | 2       | 8     | 3h         |      13h        |
| _#44_  | 2       | 13     | 7h         |      7h        |
| _#45_  | 2       | 8      | 3h         |      3h 30m      |
| _#46_  | 2       | 8     | 3h         |      3h 30m        |
| _#47_  | 2       | 5     | 2h         |      2h  30m     |
> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)


Story 0 in-depth - fixing Git issues:
- Logos on manage orders: app design was completely upgraded
 


Sprint statistics
- Average hour per task: 102.5(hours)/23(#tasks)= 4.45 hours; 
- Standard deviation: 0.54 ----------------------------------------
- Total task estimation error ratio: 0.956

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 2d 6h ( hours for implementing unit tests) 
  - Total hours spent: 1d 3h
  - Nr of automated unit test cases : 46 (for BackEnd) + 88 (for FrontEnd) = 134 unit test cases

- E2E testing:
  - Total hours estimated: 8h (1h per story - included inside each story) + 6h in design task = 14h
  - Total hours spent: 6h for stories + 6h for design task = 12h
- Code review
  - Total hours estimated: 8h (1h per story) - included inside each story
  - Total hours spent: 6h
- Technical Debt management:
  - Total hours estimated: 1d 1h 30m 
  - Total hours spent: 6h
  - Hours estimated for remediation by SonarQube: 4d3h (only in Maintainability - fixing code smells)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 4d1h (only in New Code - Maintainability - fixing code smells)
  - Hours spent on remediation: 6h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): 

Reliability	C (Sonarcloud considers as bugs the usage of some HTML tags like b, i, th etc.)

Security	 	→	A

Maintainability	→	A


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Visual design & usability improvement proved really tough (especially making every page design consistent with the rest) so we overspent some hours for this task.
  - API testing integration proved to be less difficult due to the repetitive nature of the API calls.
  - The Story #43 (Disabled users) proved very difficult and by sacrificing time for it (still could not finish) we ended up with less time on the Story #41 (Unpicked food) and we completed none of the stories.



- What lessons did you learn (both positive and negative) in this sprint?
  - Since this was the last sprint of the course we were unconsciously influenced by this fact and ended up trying to deliver a “near final” version of our app.
  - Story integration was not as swift as we expected. We faced difficulty on integrating the Story #43 (Disabled users) with the other stories and this impacted the result of the stories successfully done.
  - There is no workaround to good design & usability. When upgrading the app design we discovered many usability problems and design inconsistencies.
  - Sprint presentation should be better prepared according to the Sprint structure.




- Which improvement goals set in the previous retrospective were you able to achieve?
  - Design & usability was very much improved. 
  - Different alerts and interactive buttons were placed throughout the app. 
  - API test suite coverage went up from less than 50% to higher than 80%. 


- Which ones you were not able to achieve? Why?
  - We achieved all of the goals set in the previous retrospective


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We want to further improve the site design by making it more intuitive, using more icons and creating a very consistent design and work-flow in every page of the app.
  - We should increase the documentation for each component that we create. In this way others can quickly edit and adapt components without breaking the app.
  - We should try to finish our tasks earlier so there is enough time to check that every new feature was correctly integrated.


- One thing you are proud of as a Team!!
  - Cooperation! Every team member did their best to help in delivering a working app for the last sprint of the course.





