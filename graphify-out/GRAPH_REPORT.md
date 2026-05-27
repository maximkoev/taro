# Graph Report - taro  (2026-05-27)

## Corpus Check
- 87 files · ~24,663 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 860 nodes · 1106 edges · 48 communities (35 shown, 13 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb1bb62f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 21 edges
2. `Card` - 16 edges
3. `scripts` - 14 edges
4. `/graphify` - 14 edges
5. `What You Must Do When Invoked` - 14 edges
6. `Milestones` - 13 edges
7. `PrismaService` - 11 edges
8. `UserService` - 11 edges
9. `TarotService` - 11 edges
10. `bootstrap` - 11 edges

## Surprising Connections (you probably didn't know these)
- `createE2EApp Bootstrap Mirror` --semantically_similar_to--> `bootstrap`  [EXTRACTED] [semantically similar]
  README.md → src/main.ts
- `M5.1 Prisma Database Bootstrap` --conceptually_related_to--> `Prisma Config`  [INFERRED]
  README.md → prisma.config.ts
- `User username Unique Index` --conceptually_related_to--> `M5.2 User Registration V1`  [AMBIGUOUS]
  prisma/migrations/20260515132956_init_user/migration.sql → README.md
- `OpenAI Dependency` --conceptually_related_to--> `LLM Adapter`  [INFERRED]
  package.json → README.md
- `Global Prefix v1 with Health Exclusion` --conceptually_related_to--> `GET /health API`  [INFERRED]
  src/main.ts → README.md

## Hyperedges (group relationships)
- **Graphify Operational Loop** — agents_graphify_skill_invocation, skill_graphify_skill, hooks_graphify_pretooluse_hook, agents_graphify_update_workflow, skill_graphify_output_artifacts [INFERRED 0.84]
- **Database Bootstrap Flow** — envhelper_database_url, prismaconfig_prisma_config, postgres_docker_db_service, migration_user_table, readme_m51_prisma_database_bootstrap [INFERRED 0.82]
- **CI Quality Gates** — ci_lint_job, ci_test_job, ci_coverage_job, ci_build_job, package_lint_script, package_test_script, package_coverage_script, package_build_script [EXTRACTED 1.00]
- **HTTP Error Response Normalization** — error_type_build_error, error_type_api_response_error, prisma_error_map_prisma_error_map, prisma_exception_filter_prisma_client_exception_filter, unexpected_exception_filter_unexpected_errors_filter [INFERRED 0.86]
- **Request ID Correlation Flow** — request_id_middleware_request_id_middleware, request_id_middleware_request_id, logging_middleware_logger_middleware, prisma_exception_filter_prisma_client_exception_filter, unexpected_exception_filter_unexpected_errors_filter [INFERRED 0.84]
- **Tarot Deck Draw Flow** — card_card, deck_deck_constant, cards_deck_getter, cards_shuffle, cards_draw, cards_assert_is_non_negative_integer [INFERRED 0.88]
- **Health Endpoint Flow** — health_controller_HealthEndpointContract, health_controller_health, health_service_getHealth, health_service_HealthStatusResponse [EXTRACTED 1.00]
- **Tarot Prediction Flow** — tarot_controller_TarotEndpointContract, tarot_controller_tarot, tarot_service_tarot, tarot_service_DeckDraw, tarot_service_buildPrediction, llm_port_getPrediction, tarot_schema_PredictionTarotResponse [EXTRACTED 1.00]
- **LLM Provider Switching** — tarot_module_LlmProviderFactory, tarot_module_LlmProviderConfig, llm_port_LlmPort, fake_llm_adapter_FakeLLMAdapter, openai_llm_adapter_OpenAILlmAdapter [EXTRACTED 1.00]
- **Tarot Reading Input Contract** — tarot_prompt_tarot_reader_prompt, tarot_schema_question_taro_schema, tarot_schema_style_schema, tarot_schema_cards_valid_numbers, tarot_schema_question_tarot_dto [INFERRED 0.85]
- **Tarot Schema Validation Coverage** — tarot_schema_question_taro_schema, tarot_schema_prediction_tarot_schema, tarot_schema_spec_question_schema_validation_tests, tarot_schema_spec_prediction_schema_validation_tests [EXTRACTED 1.00]
- **User Creation Flow** — user_schema_user_schema, user_schema_user_dto, user_service_create_user, user_service_map_user, user_service_prisma_user_create_operation, user_service_prisma_user_create_input [INFERRED 0.85]

## Communities (48 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (44): Card, Deck, before, d, desc, expected, ORIGINAL_DECK_COPY, res (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (27): AppModule, ApiResponseError, buildError(), PrismaErrorConfig, error, PRISMA_ERROR_MAP, PrismaClientExceptionFilter, exception (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (14): scripts, build, db:up, format, lint, migrate:dev, start, start:debug (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (12): DATABASE_URL, PostgreSQL Environment Variables, npm run db:up, Prisma Tooling Dependencies, Postgres Docker DB Service, postgres_data Volume, Postgres Compose Environment, defineConfig (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (45): AppController, AppController AppService Dependency, TestingModule.compile, AppController TestingModule, AppModule, Global ConfigModule, Request ID and Logger Middleware Pipeline, HealthModule and TarotModule Imports (+37 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (46): author, dependencies, bcrypt, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/platform-express, openai (+38 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (27): Global E2E Application Configuration, UnexpectedErrorsFilter Integration, createE2EApp, FakeLLMAdapter, HealthController, GET /health Endpoint Contract, HealthController.health, HealthController Spec (+19 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (23): Card, Deck.assertIsNonNegativeInteger, Deck.deck getter, Deck.draw, Fisher-Yates Shuffle, Deck.shuffle, Deck Tests, Deterministic Shuffle Test (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (22): FakeLLMAdapter.getPrediction, LlmPort.getPrediction, OpenAI responses.create, OpenAI Responses API Request, TAROT_READER_PROMPT Instructions, OpenAI Request Timeout AbortController, OpenAILlmAdapter.getBody, OpenAILlmAdapter.getPrediction (+14 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (22): HTTP Adapter Reply, ApiResponseError, buildError, PrismaErrorConfig, Request Log Message, LoggerMiddleware Tests, LoggerMiddleware.use, LoggerMiddleware.writeLog (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (15): invalid, mockBody, result, schema, valid, { ZodBody }, { ZodValidationPipe }, ZodBody() (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (9): AppController, AppService, ShutdownLoggerService, HealthController, getHealthSpy, HealthModule, HealthService, LoggerMiddleware (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (17): Connected Spread Narrative Guidance, Soft Hard Tarot Tone Guidance, TAROT_READER_PROMPT, Tarot Cards Valid Counts, QuestionTaroSchema, QuestionTarotDTO, QuestionTaroSchema Validation Tests, StyleSchema (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (24): PrismaClient, User, PrismaModule, exportsMetadata, providers, adapter, PrismaService, constructor() (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.02
Nodes (97): Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean, Bytes (+89 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (10): /graphify Skill Invocation, Graphify Update Workflow, graphify hook-check Command, Graphify PreToolUse Hook, Cross Document Surprise, Honest Audit Trail, Graphify Output Artifacts, Persistent Graph (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (8): OpenAI Dependency, HTTP Tarot Reading Service, LLM Adapter, M4 LLM Adapter Milestone, Random Tarot Spread, Reading Response, Taro Tarot Reading API, Tarot Reading Request

### Community 18 - "Community 18"
Cohesion: 0.04
Nodes (56): AggregateUser, DateTimeFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, Prisma__UserClient, StringFieldUpdateOperationsInput, UserAggregateArgs, UserCountAggregateInputType (+48 more)

### Community 19 - "Community 19"
Cohesion: 0.60
Nodes (4): isNonEmptyString(), isNonNegativeInteger(), greet(), maybe()

### Community 20 - "Community 20"
Cohesion: 0.40
Nodes (6): User passwordHash Column, User Table, User Timestamp Columns, User username Unique Index, M5.2 User Registration V1, M5.5 Authentication

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 22 - "Community 22"
Cohesion: 0.40
Nodes (5): PrismaModule, DATABASE_URL Configuration, PrismaClient Connection Lifecycle, PrismaPg Adapter Configuration, PrismaService

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (4): Semantic Extraction Cache, Semantic Extraction, Structural Extraction, Semantic Subagent Chunks

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (3): Project Knowledge Graph, Graphify Query Workflow, Graphify Wiki Navigation

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (3): AppModule.configure, MiddlewareConsumer.apply, forRoutes('*')

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (3): onApplicationShutdown, Shutdown Log Message, ShutdownLoggerService

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (3): PredictionTarotDTO, PredictionTarotSchema, PredictionTarotSchema Validation Tests

### Community 38 - "Community 38"
Cohesion: 0.05
Nodes (43): code:block10 (You are a graphify extraction subagent. Read the files liste), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash (mkdir -p graphify-out), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c ") (+35 more)

### Community 39 - "Community 39"
Cohesion: 0.06
Nodes (34): code:block1 (/graphify                                             # full), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash (if [ ! -f graphify-out/.graphify_extract.json ]; then), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c "), code:bash ($(cat .graphify_python) -c ") (+26 more)

### Community 43 - "Community 43"
Cohesion: 0.06
Nodes (31): code:json ({), code:json ({), code:text (src/), code:bash (npm i), code:bash (npm run start:dev), code:bash (npm test), code:bash (npm run build), Current API (+23 more)

### Community 44 - "Community 44"
Cohesion: 0.10
Nodes (16): ModelName, NullTypes, QueryMode, SortOrder, TransactionIsolationLevel, UserScalarFieldEnum, User, DateTimeFilter (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (6): db, getEnv(), host, isNotEmptyString(), password, user

### Community 46 - "Community 46"
Cohesion: 0.29
Nodes (4): config, LogOptions, PrismaClient, PrismaClientConstructor

## Ambiguous Edges - Review These
- `M5.2 User Registration V1` → `User username Unique Index`  [AMBIGUOUS]
  prisma/migrations/20260515132956_init_user/migration.sql · relation: conceptually_related_to

## Knowledge Gaps
- **494 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `M5.2 User Registration V1` and `User username Unique Index`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `ZodBody()` connect `Community 11` to `Community 0`, `Community 14`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `TarotService` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0609009009009009 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._