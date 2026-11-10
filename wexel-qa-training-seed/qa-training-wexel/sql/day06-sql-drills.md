# Day 6 — SQL drills on `covernest.db` (self-administered, no EM send)

Open `sql/covernest.db` in DB Browser for SQLite and keep `sql/covernest-schema.sql` beside it. For each drill write the query, run it, and paste the result (row count or values) as a comment under the query in `sql/day06-drills.sql`. Where SQLite and SQL Server syntax differ, add the SQL Server version as a comment (most client databases you will meet are SQL Server, PostgreSQL or MySQL).

Timestamps ending in `Z` are UTC. Manila time is UTC+8: `datetime(col, '+8 hours')`.

| # | Drill |
|---|---|
| D6.01 | How many customers are there? |
| D6.02 | The 3 highest annual premiums in agency A2: policy number, status, premium. Break ties by policy number. |
| D6.03 | Number of policies per status. |
| D6.04 | Average annual premium of Active, non-deleted policies, rounded to 2 decimals. |
| D6.05 | How many customers hold more than one policy? |
| D6.06 | Policy number and customer name for every Lapsed policy. |
| D6.07 | How many policies have no claims at all? (Use a LEFT JOIN, then do it again with NOT EXISTS and confirm both give the same number.) |
| D6.08 | Total claimed amount per claim status. |
| D6.09 | How many claims have no paid amount (NULL)? Does every one of them have a status other than Paid? |
| D6.10 | Number and total of payments made in July 2026 (UTC). |
| D6.11 | List claim ids created on 2026-10-31, first by UTC date, then by Manila date. Explain the difference in one line. |
| D6.12 | Customers who share an email address when case is ignored. |
| D6.13 | Policies whose term end is not exactly one year minus one day after the effective date. |
| D6.14 | Number of Open claims per agency (claims → policies). |
| D6.15 | How many policies have an annual premium above the average of Active, non-deleted policies? |

## Salesforce transfer (SOQL, written only)

Write the **SOQL** equivalent of **D6.06** and **D6.07** for these fictional Salesforce objects, under the SQL in `sql/day06-drills.sql`, plus one line on what SOQL does differently from SQL. You cannot run these here; write them as you would in Workbench or the Developer Console.

| Object | Fields |
|---|---|
| `Customer__c` | `Id`, `Full_Name__c`, `Email__c` |
| `Policy__c` | `Id`, `Name` (policy number), `Status__c`, `Customer__c` (lookup to `Customer__c`), `Annual_Premium__c` |
| `Claim__c` | `Id`, `Policy__c` (lookup to `Policy__c`), `Status__c`, `Amount__c` |

Commit on a branch `day-06-sql` and open a PR (the Day 6 peer review goes in the same PR).
