# Knowledge Graph ETL

This ETL reads Postgres databases from the microservices and loads a Neo4j graph.

Run locally:
1) Start Neo4j and the microservices (or at least the Postgres containers).
2) Install dependencies: `pip install -r kg-etl/requirements.txt`
3) Execute: `python kg-etl/etl.py`

Run with Docker Compose:
1) Start core services: `docker compose up -d neo4j`
2) Run the ETL profile: `docker compose --profile etl up --build kg-etl`

Env vars:
- `NEO4J_URI` (default `bolt://localhost:7687`)
- `NEO4J_AUTH` (default `neo4j/neo4j_password`)
- `*_DB_HOST`, `*_DB_PORT`, `*_DB_NAME`, `*_DB_USER`, `*_DB_PASSWORD`
- `KG_CONSTRAINTS_PATH`, `KG_RULES_PATH`, `KG_ENRICHMENT_PATH`
- `KG_APPLY_CONSTRAINTS`, `KG_APPLY_RULES`, `KG_APPLY_ENRICHMENT`
