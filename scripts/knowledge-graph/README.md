# Knowledge Graph scripts

Files:
- `01_constraints.cypher`: uniqueness constraints for nodes
- `02_derived_relations.cypher`: derived relations (PART_DE, ARRIVE_A, etc.)
- `03_checks.cypher`: validation queries
- `04_enrichment.cypher`: enrichment rules (price category, delays, validity)
- `05_recommendation.cypher`: recommendation query (departure + arrival)
- `06_recommendation_check.cypher`: auto-check for recommendation (picks a valid pair)

You can run them from Neo4j Browser or with cypher-shell.
