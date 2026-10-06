import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.challenge import Challenge
from backend.app.models.attempt import ChallengeAttempt
from backend.app.models.submission import Submission
from backend.app.models.architecture import Architecture
from backend.app.models.decision import TechnicalDecision
from backend.app.models.evidence import Evidence
from backend.app.models.verification import VerificationResult
from backend.app.models.defense import TechnicalQuestion
from backend.app.models.review import Review, ReviewerReputation
from backend.app.models.capability import Capability
from backend.app.models.reel import Reel
from backend.app.models.social import Comment
from backend.app.models.opportunity import Opportunity

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.username == "jeevan").first():
        print("Database already seeded with demo data.")
        return

    print("Seeding PROOF database with production-grade demonstrated capability data...")

    # 1. USERS
    default_pass = get_password_hash("password123")

    users_data = [
        # Demo account
        {
            "name": "Jeevan N.",
            "username": "jeevan",
            "email": "jeevan@proof.dev",
            "role": "BUILDER",
            "title": "AI / Backend Engineer",
            "bio": "Building high-throughput distributed systems and LLM inference pipelines. Obsessed with p99 latency reduction and zero-allocation networking.",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "github_username": "jeevan-eng",
            "github_connected": "CONNECTED",
            "overall_capability": 86,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 17,
            "expert_reviews_count": 8,
            "deployments_count": 3,
            "streak_days": 14
        },
        # Builders
        {
            "name": "Elena Rostova",
            "username": "elena_r",
            "email": "elena@proof.dev",
            "role": "BUILDER",
            "title": "Staff Distributed Systems Engineer",
            "bio": "Specialized in consensus protocols (Raft, Paxos), formal verification with TLA+, and lock-free concurrency.",
            "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            "github_username": "elena-dist-sys",
            "github_connected": "CONNECTED",
            "overall_capability": 92,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 21,
            "expert_reviews_count": 12,
            "deployments_count": 5,
            "streak_days": 28
        },
        {
            "name": "Marcus Chen",
            "username": "mchen",
            "email": "marcus@proof.dev",
            "role": "BUILDER",
            "title": "Low-Latency Systems & Kernels",
            "bio": "Writing eBPF network hooks, io_uring asynchronous engines, and custom columnar storage formats.",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            "github_username": "mchen-io",
            "github_connected": "CONNECTED",
            "overall_capability": 89,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 14,
            "expert_reviews_count": 9,
            "deployments_count": 4,
            "streak_days": 9
        },
        {
            "name": "Sarah Jenkins",
            "username": "s_jenkins",
            "email": "sarah@proof.dev",
            "role": "BUILDER",
            "title": "ML Infra & Vector Retrieval Lead",
            "bio": "Scaling HNSW index graphs to 500M vectors with sub-15ms p99 recall. Exploring quantized tensor kernels.",
            "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            "github_username": "sjenkins-ml",
            "github_connected": "CONNECTED",
            "overall_capability": 85,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 11,
            "expert_reviews_count": 7,
            "deployments_count": 3,
            "streak_days": 18
        },
        {
            "name": "David Okafor",
            "username": "d_okafor",
            "email": "david@proof.dev",
            "role": "BUILDER",
            "title": "Database Engine Internals",
            "bio": "Building LSM-tree engines, Write-Ahead Logs, and custom MVCC concurrency control for multi-tenant analytical stores.",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            "github_username": "dokafor-db",
            "github_connected": "CONNECTED",
            "overall_capability": 84,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 13,
            "expert_reviews_count": 6,
            "deployments_count": 2,
            "streak_days": 11
        },
        # Reviewers
        {
            "name": "Alex Thorne",
            "username": "alex_t",
            "email": "alex.thorne@proof.dev",
            "role": "REVIEWER",
            "title": "Principal Distributed Systems Architect",
            "bio": "Former Staff Engineer at CoreCloud. Specializing in strict linearizability, distributed deadlock detection, and fault recovery.",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
            "github_username": "thorne-core",
            "github_connected": "CONNECTED",
            "overall_capability": 96,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 34,
            "expert_reviews_count": 48,
            "deployments_count": 12,
            "streak_days": 42
        },
        {
            "name": "Dr. Maya Lin",
            "username": "dr_mlin",
            "email": "maya.lin@proof.dev",
            "role": "REVIEWER",
            "title": "Systems & Database Research Fellow",
            "bio": "Ph.D. in Asynchronous Transaction Protocols. Evaluating codebases for rigorous correctness, memory safety, and empirical benchmarks.",
            "avatar_url": "https://images.unsplash.com/photo-1534751516642-a171edd25218?auto=format&fit=crop&w=400&q=80",
            "github_username": "mlin-research",
            "github_connected": "CONNECTED",
            "overall_capability": 97,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 29,
            "expert_reviews_count": 39,
            "deployments_count": 8,
            "streak_days": 35
        },
        {
            "name": "Carlos Vance",
            "username": "cvance",
            "email": "carlos.vance@proof.dev",
            "role": "REVIEWER",
            "title": "Staff Performance & Reliability Engineer",
            "bio": "Focuses on Linux perf counters, cache misses, memory profiling, and high-concurrency microbenchmarks.",
            "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
            "github_username": "cvance-perf",
            "github_connected": "CONNECTED",
            "overall_capability": 94,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 26,
            "expert_reviews_count": 31,
            "deployments_count": 7,
            "streak_days": 21
        },
        # Recruiters
        {
            "name": "Rachel Adams",
            "username": "rachel_a",
            "email": "rachel.adams@horizoninfra.com",
            "role": "RECRUITER",
            "title": "VP Technical Talent @ Horizon Infrastructure",
            "bio": "We scout proven builders for Series B-D distributed systems and AI platforms. No resume fluff; we review architecture docs and benchmarks.",
            "avatar_url": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
            "github_username": "rachel-horizon",
            "github_connected": "DEMO_NOT_CONNECTED",
            "overall_capability": 0,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 0,
            "expert_reviews_count": 0,
            "deployments_count": 0,
            "streak_days": 5
        },
        {
            "name": "Liam Vance",
            "username": "liam_rec",
            "email": "liam@scaleworks-ventures.io",
            "role": "RECRUITER",
            "title": "Head of Technical Discovery @ ScaleWorks",
            "bio": "Matching elite infrastructure and systems engineers directly to founding engineering teams.",
            "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
            "github_username": "liam-scale",
            "github_connected": "DEMO_NOT_CONNECTED",
            "overall_capability": 0,
            "evidence_confidence": "HIGH",
            "verified_projects_count": 0,
            "expert_reviews_count": 0,
            "deployments_count": 0,
            "streak_days": 8
        }
    ]

    user_objs = {}
    for u in users_data:
        user = User(
            name=u["name"],
            username=u["username"],
            email=u["email"],
            password_hash=default_pass,
            role=u["role"],
            title=u["title"],
            bio=u["bio"],
            avatar_url=u["avatar_url"],
            github_username=u["github_username"],
            github_connected=u["github_connected"],
            overall_capability=u["overall_capability"],
            evidence_confidence=u["evidence_confidence"],
            verified_projects_count=u["verified_projects_count"],
            expert_reviews_count=u["expert_reviews_count"],
            deployments_count=u["deployments_count"],
            streak_days=u["streak_days"]
        )
        db.add(user)
        user_objs[u["username"]] = user

    db.commit()

    # Seed capabilities for Jeevan (demo user)
    jeevan = user_objs["jeevan"]
    jeevan_caps = [
        ("Backend", 86, "HIGH", 12, [{"date": "2026-06-01", "score": 52}, {"date": "2026-08-15", "score": 74}, {"date": "2026-10-01", "score": 86}]),
        ("Python", 91, "HIGH", 15, [{"date": "2026-05-10", "score": 64}, {"date": "2026-07-20", "score": 81}, {"date": "2026-10-01", "score": 91}]),
        ("AI/ML", 78, "MEDIUM", 6, [{"date": "2026-06-15", "score": 55}, {"date": "2026-09-01", "score": 78}]),
        ("System Design", 78, "HIGH", 9, [{"date": "2026-04-12", "score": 41}, {"date": "2026-08-01", "score": 65}, {"date": "2026-10-01", "score": 78}]),
        ("Databases", 74, "HIGH", 8, [{"date": "2026-05-20", "score": 50}, {"date": "2026-09-10", "score": 74}]),
        ("Cloud", 63, "MEDIUM", 4, [{"date": "2026-06-01", "score": 44}, {"date": "2026-09-20", "score": 63}]),
        ("DevOps", 69, "MEDIUM", 5, [{"date": "2026-07-01", "score": 58}, {"date": "2026-10-01", "score": 69}]),
        ("APIs", 88, "HIGH", 11, [{"date": "2026-06-10", "score": 70}, {"date": "2026-10-01", "score": 88}]),
        ("Testing", 82, "HIGH", 10, [{"date": "2026-06-12", "score": 65}, {"date": "2026-10-01", "score": 82}]),
        ("Security", 71, "MEDIUM", 4, [{"date": "2026-07-05", "score": 59}, {"date": "2026-10-01", "score": 71}])
    ]
    for skill, score, conf, ev_count, hist in jeevan_caps:
        db.add(Capability(
            user_id=jeevan.id,
            skill=skill,
            score=score,
            confidence=conf,
            evidence_count=ev_count,
            history_data=json.dumps(hist)
        ))

    # Add reviewer reputations
    alex = user_objs["alex_t"]
    maya = user_objs["dr_mlin"]
    carlos = user_objs["cvance"]

    db.add(ReviewerReputation(reviewer_id=alex.id, domain="Distributed Systems & Concurrency", reviews_completed=48, agreement_score=96.8, helpfulness_score=98.2, reputation_level="PRINCIPAL"))
    db.add(ReviewerReputation(reviewer_id=maya.id, domain="Database Internals & Storage", reviews_completed=39, agreement_score=95.4, helpfulness_score=97.0, reputation_level="PRINCIPAL"))
    db.add(ReviewerReputation(reviewer_id=carlos.id, domain="Performance & System Observability", reviews_completed=31, agreement_score=93.8, helpfulness_score=94.5, reputation_level="STAFF"))

    db.commit()

    # 2. CHALLENGES (8 Real Challenges)
    challenges_data = [
        {
            "title": "Design a Distributed Rate Limiter",
            "slug": "design-a-distributed-rate-limiter",
            "difficulty": "Advanced",
            "estimated_hours": "3–5 hours",
            "category": "Backend",
            "skills": "Backend,Redis,Concurrency,System Design",
            "description": "Build a production-grade distributed rate-limiting service capable of coordinating across multiple service replicas with deterministic sub-millisecond decision latency.",
            "problem_statement": """Traditional in-memory rate limiting fails when applications scale horizontally across dozens of container instances.

Your objective is to design, implement, and benchmark a distributed rate limiter that:
1. Enforces rate limits across 10+ concurrent application instances without clock drift bias.
2. Supports sliding window logs or token bucket with Redis Lua scripting for atomic execution.
3. Sustains 100,000 requests/minute with p99 decision latency under 10ms.
4. Degrades gracefully under network partition or Redis replica downtime with configurable circuit breaking.""",
            "constraints": """- Max decision latency: <15ms p99
- Throughput target: 100,000 req/min
- Concurrency safety: Zero race condition window overdrafts
- Failure behavior: Fail-open or fallback to local token bucket""",
            "expected_output": """- Production service code with clean REST/gRPC endpoint (/v1/rate-limit/check)
- Lua script for atomic sliding window log inspection
- Integration test suite validating concurrent burst requests
- Locust / k6 benchmark report proving latency under high load""",
            "evaluation_criteria": """- Concurrency control and atomicity guarantees
- Latency and cache eviction efficiency
- Resilience under Redis failover
- Observability and Prometheus telemetry integration""",
            "skills_demonstrated": "Concurrency\nCaching\nScalability\nFault tolerance\nRedis Internals"
        },
        {
            "title": "Vector Search Engine with Approximate Nearest Neighbors",
            "slug": "vector-search-engine-ann",
            "difficulty": "Advanced",
            "estimated_hours": "4–6 hours",
            "category": "AI/ML",
            "skills": "Python,AI/ML,Embeddings,Vector Databases,API Design",
            "description": "Build an in-memory vector index engine implementing Hierarchical Navigable Small World (HNSW) graphs with cosine distance metrics.",
            "problem_statement": """Vector embeddings power modern semantic search and RAG pipelines. Brute-force linear scans degrade at O(N) complexity as datasets surpass 100k embeddings.

Build an ANN engine supporting:
1. Efficient multi-layer graph indexing (HNSW) for vector embeddings (1536-dim).
2. Quantization or SIMD-accelerated distance computation.
3. Sub-20ms query recall on 100,000 vectors with >95% recall@10 accuracy.
4. Concurrent upserts and queries without locking the entire index.""",
            "constraints": """- Recall accuracy: >95% recall@10 vs exact cosine scan
- Query latency: <20ms p95 on 100k vectors
- Memory footprint: <500MB for 100k 1536-dim embeddings""",
            "expected_output": """- Vector index module with insert, query, and save/load serialization
- Benchmark harness comparing HNSW vs Brute Force
- REST API with batch search capabilities""",
            "evaluation_criteria": """- Algorithmic graph construction logic
- Thread-safety during index mutation
- Memory layout and cache efficiency
- Reproducible benchmark evidence""",
            "skills_demonstrated": "Vector Geometry\nGraph Algorithms\nPython C-Extensions/NumPy\nLow-Latency APIs"
        },
        {
            "title": "Real-Time Collaboration System with Conflict-Free Replicated Data Types",
            "slug": "real-time-collaboration-crdt",
            "difficulty": "Advanced",
            "estimated_hours": "5–7 hours",
            "category": "System Design",
            "skills": "WebSockets,Distributed Systems,Concurrency,CRDTs",
            "description": "Architect a real-time multiplayer document engine supporting offline edits, peer reconnection, and conflict-free text merging.",
            "problem_statement": """Centralized locking prevents seamless real-time co-authoring. Operational Transformation requires heavy central arbitration.

Construct a real-time CRDT text synchronizer:
1. Support arbitrary concurrent inserts/deletes using a sequence CRDT (e.g., LSEQ or Fugue).
2. Handle client disconnections and state catch-up without data loss.
3. Efficient delta serialization over WebSockets with heartbeat keepalives.
4. Zero divergence between peers after convergence.""",
            "constraints": """- Eventual consistency guarantee: Convergence mathematically guaranteed
- Message overhead: Delta compression for small keystrokes
- Connection capacity: 1,000 simultaneous active peer sessions per node""",
            "expected_output": """- WebSocket sync gateway
- CRDT character tree data structure
- Automated peer partition and reconciliation test suite""",
            "evaluation_criteria": """- Correctness of causal tree ordering
- Convergence test under network jitter and packet loss
- WebSocket broadcast fanout performance""",
            "skills_demonstrated": "Distributed State\nEventual Consistency\nWebSocket Scaling\nData Structures"
        },
        {
            "title": "Distributed In-Memory Cache with Consistent Hashing",
            "slug": "distributed-cache-consistent-hashing",
            "difficulty": "Intermediate",
            "estimated_hours": "3–4 hours",
            "category": "Databases",
            "skills": "Backend,Databases,System Design,Algorithms",
            "description": "Implement a distributed key-value cache cluster that dynamically rebalances keys across nodes using consistent hashing with virtual nodes.",
            "problem_statement": """Standard modulo hashing causes near-total cache invalidation when nodes are added or removed from a cache cluster.

Implement:
1. A consistent hash ring with configurable virtual nodes to balance key distribution.
2. Peer node discovery and cluster membership heartbeat.
3. Cache eviction policies (LRU/LFU with O(1) time complexity).
4. Benchmark showing <10% key remap during single-node failure.""",
            "constraints": """- Ring lookup time: O(log N) where N is virtual nodes
- Key deviation ratio: <15% variance across all nodes
- Eviction latency: O(1) operations""",
            "expected_output": """- Hash ring module with virtual node balancing
- LRU cache implementation
- Node churn simulation test suite""",
            "evaluation_criteria": """- Uniformity of key distribution
- Concurrency protection on cache updates
- Edge-case handling when ring is empty or resizing""",
            "skills_demonstrated": "Consistent Hashing\nCache Eviction\nCluster Topology\nData Structures"
        },
        {
            "title": "High-Throughput Event Streaming Pipeline",
            "slug": "high-throughput-event-pipeline",
            "difficulty": "Advanced",
            "estimated_hours": "4–6 hours",
            "category": "DevOps",
            "skills": "Kafka,Concurrency,DevOps,Streaming,Python",
            "description": "Construct an end-to-end event ingestion pipeline processing 50,000 events/second with exactly-once processing semantics.",
            "problem_statement": """Data pipelines often silently drop events or suffer massive backpressure spikes when upstream producer bursts exceed ingestion capacity.

Build a hardened streaming processor with:
1. Partition-aware ingestion workers with backpressure flow control.
2. Idempotent deduplication using distributed state windows.
3. Dead-letter queue (DLQ) automated retry mechanism with exponential backoff.
4. End-to-end telemetry exposing consumer lag and throughput metrics.""",
            "constraints": """- Throughput: >= 50,000 msgs/sec
- Exactly-once semantics via transactional checkpoints
- Max allowable consumer lag under burst: <500ms""",
            "expected_output": """- Producer load generator and Consumer worker cluster
- Deduplication and checkpointing logic
- Grafana dashboard JSON or Prometheus metrics export""",
            "evaluation_criteria": """- Backpressure handling and buffer sizing
- Zero message loss during worker node crash
- Idempotency correctness""",
            "skills_demonstrated": "Event Sourcing\nBackpressure Control\nIdempotency\nStream Processing"
        },
        {
            "title": "Zero-Copy High-Performance Key-Value Store",
            "slug": "zero-copy-kv-store",
            "difficulty": "Advanced",
            "estimated_hours": "5–8 hours",
            "category": "Databases",
            "skills": "Databases,C++,Rust,Storage,Memory Mapping",
            "description": "Design an append-only LSM-tree log and memory-mapped SSTable storage engine with zero memory copying on read paths.",
            "problem_statement": """Memory allocations and kernel-to-user space buffer copying dominate overhead in modern storage engines.

Implement a key-value engine featuring:
1. Active MemTable with skiplist or red-black tree.
2. Background thread SSTable compaction with immutable segments.
3. Memory-mapped files (mmap) for read-path lookups bypassing OS user copies.
4. Bloom filters per SSTable to avoid disk seeks on absent keys.""",
            "constraints": """- Read amplification: Max 2 disk seeks on cold reads
- Bloom filter false positive rate: <1%
- Write throughput: >80,000 writes/second""",
            "expected_output": """- LSM engine codebase with WAL and compaction worker
- Bloom filter implementation
- Microbenchmark evaluating read/write throughput""",
            "evaluation_criteria": """- Compaction algorithm correctness (tiered vs leveled)
- Crash recovery using WAL replay
- Bloom filter bit-vector efficiency""",
            "skills_demonstrated": "LSM Trees\nMemory Mapping\nBloom Filters\nCrash Recovery"
        },
        {
            "title": "SQL Query Execution Engine with Cost-Based Optimizer",
            "slug": "sql-query-engine-optimizer",
            "difficulty": "Advanced",
            "estimated_hours": "6–8 hours",
            "category": "Databases",
            "skills": "Databases,Compilers,System Design,Algorithms",
            "description": "Build an execution engine supporting AST parsing, catalog metadata statistics, and cost-based join reordering.",
            "problem_statement": """Naive nested-loop joins cause catastrophic O(N*M) query execution times on large relational datasets.

Develop:
1. SQL lexer/parser generating a relational algebra logical plan (Filter, Project, Join).
2. Cost-based optimizer that evaluates join orderings using histogram table statistics.
3. Vectorized Volcano iterator physical operators (Hash Join, Index Scan, Aggregation).
4. Benchmark verifying query plan efficiency on 1,000,000 record datasets.""",
            "constraints": """- Hash Join execution time: <100ms for 500k row cross-join
- Plan optimization latency: <5ms for queries with up to 5 tables""",
            "expected_output": """- Relational execution engine
- Query optimizer unit tests verifying optimal plan selection
- Test suite with TPC-H query subset""",
            "evaluation_criteria": """- Volcano iterator pipeline correctness
- Cardinality estimation math
- Memory usage during hash table build phase""",
            "skills_demonstrated": "Query Optimization\nRelational Algebra\nVolcano Model\nCompilers"
        },
        {
            "title": "Resilient Raft Consensus Protocol Implementation",
            "slug": "resilient-raft-consensus",
            "difficulty": "Advanced",
            "estimated_hours": "6–9 hours",
            "category": "Backend",
            "skills": "Distributed Systems,Consensus,Raft,Concurrency,Go,Python",
            "description": "Implement the core Raft consensus algorithm with leader election, log replication, and safety invariants under network splits.",
            "problem_statement": """Building reliable distributed coordination requires strict linearizability in the presence of unreliable networks and crashing nodes.

Implement Raft:
1. Randomized timer leader election preventing split votes.
2. AppendEntries RPC log replication with log matching invariant.
3. Persistent state commits surviving machine restarts.
4. Partition tolerance: Minority cluster nodes cannot commit writes.""",
            "constraints": """- Election resolution time: <300ms
- Safety: No split-brain state machine divergence under any network partition
- State persistence: WAL persistence on term and vote changes""",
            "expected_output": """- 3-5 node Raft cluster implementation
- Jepsen-style automated network partition failure tests
- State machine replication demo (distributed KV)""",
            "evaluation_criteria": """- Adherence to Raft safety properties
- Graceful recovery after partition heals
- Deterministic test harness""",
            "skills_demonstrated": "Raft Consensus\nFault Tolerance\nNetwork Partitions\nDistributed State Machines"
        }
    ]

    challenge_objs = {}
    for c in challenges_data:
        chal = Challenge(
            title=c["title"],
            slug=c["slug"],
            difficulty=c["difficulty"],
            estimated_hours=c["estimated_hours"],
            category=c["category"],
            skills=c["skills"],
            description=c["description"],
            problem_statement=c["problem_statement"],
            constraints=c["constraints"],
            expected_output=c["expected_output"],
            evaluation_criteria=c["evaluation_criteria"],
            skills_demonstrated=c["skills_demonstrated"],
            status="ACTIVE"
        )
        db.add(chal)
        challenge_objs[c["slug"]] = chal

    db.commit()

    # 3. PROJECTS & SUBMISSIONS (Real Verified Work)
    # Project 1: Jeevan's Rate Limiter
    c_limiter = challenge_objs["design-a-distributed-rate-limiter"]
    attempt_jeevan_1 = ChallengeAttempt(
        user_id=jeevan.id,
        challenge_id=c_limiter.id,
        status="COMPLETED",
        started_at=datetime.now(timezone.utc) - timedelta(days=12),
        submitted_at=datetime.now(timezone.utc) - timedelta(days=10)
    )
    db.add(attempt_jeevan_1)
    db.commit()

    sub_rate_limiter = Submission(
        attempt_id=attempt_jeevan_1.id,
        user_id=jeevan.id,
        title="Zero-Lock Sliding Window Rate Limiter on Redis Cluster",
        description="A distributed rate-limiting microservice handling 120k requests/min with sub-4ms decision latency using atomic Lua scripts and circuit-broken local token buckets.",
        repository_url="https://github.com/jeevan-eng/redis-sliding-window-limiter",
        live_demo_url="https://rate-limiter-demo.proof.dev",
        status="VERIFIED",
        tags="Backend,Redis,System Design,Concurrency,Python",
        capability_impact=json.dumps({"Backend": 7, "System Design": 5, "Python": 3, "Databases": 4}),
        created_at=datetime.now(timezone.utc) - timedelta(days=10)
    )
    db.add(sub_rate_limiter)
    db.commit()

    # Architecture for Rate Limiter
    arch_diagram = {
        "nodes": [
            {"id": "client", "label": "Client Traffic (100k req/min)", "type": "Client", "x": 100, "y": 180},
            {"id": "lb", "label": "Envoy Load Balancer", "type": "Load Balancer", "x": 300, "y": 180},
            {"id": "app_cluster", "label": "Rate Limiter Nodes (x6)", "type": "Service", "x": 520, "y": 180},
            {"id": "redis_cluster", "label": "Redis Primary-Replica Cluster", "type": "Cache", "x": 750, "y": 120},
            {"id": "fallback_bucket", "label": "In-Memory Token Bucket Fallback", "type": "Worker", "x": 750, "y": 250},
            {"id": "prom_metrics", "label": "Prometheus & Grafana Telemetry", "type": "External API", "x": 520, "y": 320}
        ],
        "edges": [
            {"source": "client", "target": "lb", "label": "HTTPS Traffic"},
            {"source": "lb", "target": "app_cluster", "label": "Round Robin"},
            {"source": "app_cluster", "target": "redis_cluster", "label": "Atomic EVALSHA"},
            {"source": "app_cluster", "target": "fallback_bucket", "label": "Circuit Break on Failover"},
            {"source": "app_cluster", "target": "prom_metrics", "label": "Latency / Rejection Counter"}
        ]
    }
    db.add(Architecture(
        submission_id=sub_rate_limiter.id,
        diagram_data=json.dumps(arch_diagram),
        description="Six stateless rate limiter nodes communicating with a 3-shard Redis cluster via atomic Lua scripts for sliding-window log calculations.",
        system_flow="Clients send ingress requests through Envoy. Rate limiter evaluates the client's token key against Redis using a single network round-trip Lua script. If Redis health check drops, a local token bucket engages to avoid catastrophic fail-closed outages.",
        scaling_strategy="Horizontally scale application pods using Kubernetes HPA based on CPU & network socket saturation. Redis sharding is partitioned by client tenant_id hash to prevent single-shard hot spots.",
        failure_points="Redis primary failover window (~2 seconds). Mitigated by automatic fallback circuit-breaker that switches to local burst allowance rather than blocking all incoming client requests."
    ))

    # Technical Decisions for Rate Limiter
    db.add(TechnicalDecision(
        submission_id=sub_rate_limiter.id,
        title="Atomic Lua Script vs Redis MULTI/EXEC Transaction",
        decision="Execute sliding-window log evaluation inside a single atomic Redis Lua script loaded via EVALSHA.",
        context="Multiple concurrent workers checking a rate limit create a race window where requests are authorized before the counter increments.",
        alternatives="Redis MULTI/EXEC transaction blocks or distributed Redlock locking.",
        tradeoffs="Lua scripts block the single-threaded Redis engine during execution, so the script must execute in <0.5ms with O(log N) sorted set pruning.",
        result="Achieved zero overdrafts under a 2,000-concurrent-request burst while keeping Redis CPU utilization under 24%."
    ))
    db.add(TechnicalDecision(
        submission_id=sub_rate_limiter.id,
        title="Sliding Window Log with Timestamp Microsecond Granularity",
        decision="Use Redis Sorted Sets (ZSET) with microsecond epoch scores instead of Fixed Window Counters.",
        context="Fixed window counters allow double the maximum request allowance at window boundary transitions (e.g. 59s and 01s).",
        alternatives="Fixed window counter, Token Bucket, Leaky Bucket.",
        tradeoffs="ZSET stores individual timestamps, increasing memory consumption from O(1) to O(K) where K is current requests in window.",
        result="Guaranteed strictly smooth traffic limiting with memory capped at ~1.2MB per 10,000 active clients."
    ))
    db.add(TechnicalDecision(
        submission_id=sub_rate_limiter.id,
        title="Circuit-Breaker Fail-Open Fallback Strategy",
        decision="On Redis connection timeout (>25ms), fallback to local node memory token bucket instead of failing closed.",
        context="If the caching layer suffers a network partition, rejecting all user traffic takes down critical customer-facing APIs.",
        alternatives="Strict fail-closed (reject all traffic) or unthrottled pass-through.",
        tradeoffs="Temporarily allows up to N * local_limit traffic during an active cache outage.",
        result="Protected upstream service uptime during simulated Redis replica failover test with zero false-positive 500 errors."
    ))

    # Evidence for Rate Limiter
    db.add(Evidence(
        submission_id=sub_rate_limiter.id,
        type="REPOSITORY",
        title="GitHub Repository & Automated CI Workflow",
        url="https://github.com/jeevan-eng/redis-sliding-window-limiter",
        description="Clean Python FastAPI service with uvloop, poetry dependencies, and automated GitHub Actions CI pipeline.",
        verification_status="VERIFIED",
        metrics_data=json.dumps({"coverage": "94.2%", "lint_score": "10/10", "loc": 1420})
    ))
    db.add(Evidence(
        submission_id=sub_rate_limiter.id,
        type="BENCHMARK",
        title="Locust Concurrency Stress Test Report",
        url="https://benchmarks.proof.dev/runs/jeevan-limiter-100k",
        description="Sustained 120,000 requests/minute across 50 concurrent simulated client instances for 20 minutes.",
        verification_status="VERIFIED",
        metrics_data=json.dumps({"p50_latency_ms": 1.8, "p95_latency_ms": 3.4, "p99_latency_ms": 5.9, "error_rate": "0.00%"})
    ))
    db.add(Evidence(
        submission_id=sub_rate_limiter.id,
        type="TEST",
        title="Pytest Suite: Concurrency & Boundary Tests",
        url="https://github.com/jeevan-eng/redis-sliding-window-limiter/tree/main/tests",
        description="38 unit and integration tests including simulated clock skew, Redis connection drops, and burst boundary attacks.",
        verification_status="VERIFIED",
        metrics_data=json.dumps({"tests_passed": 38, "tests_failed": 0, "duration_seconds": 4.8})
    ))
    db.add(Evidence(
        submission_id=sub_rate_limiter.id,
        type="DEPLOYMENT",
        title="Live Kubernetes Staging Deployment",
        url="https://rate-limiter-demo.proof.dev/metrics",
        description="Deployed on a 3-node k3s cluster with Prometheus operator exposing request rejection rates.",
        verification_status="VERIFIED",
        metrics_data=json.dumps({"uptime": "99.98%", "replicas": 6})
    ))

    # Verification Result for Rate Limiter
    db.add(VerificationResult(
        submission_id=sub_rate_limiter.id,
        repository_check=True,
        build_check=True,
        test_check=True,
        benchmark_check=True,
        security_check=True,
        reproducibility_check=True,
        overall_status="VERIFIED",
        confidence="HIGH",
        details=json.dumps({
            "checks": {
                "repository": {"status": "PASS", "meta": "Public GitHub repo with clean commit lineage"},
                "build": {"status": "PASS", "detail": "Dockerfile multi-stage build succeeded in 18s"},
                "test": {"status": "PASS", "detail": "38/38 tests passed with 94.2% statement coverage"},
                "benchmark": {"status": "PASS", "detail": "Sub-6ms p99 validated on sustained 120k req/min"},
                "security": {"status": "PASS", "detail": "Trivy container scan clean, zero high CVEs"},
                "reproducibility": {"status": "PASS", "detail": "docker-compose up reproduces benchmark locally"}
            }
        })
    ))

    # Technical Defense Questions & Answers
    db.add(TechnicalQuestion(
        submission_id=sub_rate_limiter.id,
        question="Why did you choose Redis over an in-memory sliding log on each node with gossip synchronization?",
        answer="Gossip synchronization across 10+ nodes incurs O(N^2) convergence delay (typically 200-500ms). Under high burst traffic, this divergence window would cause significant rate limit oversubscription. Redis offers centralized atomic ordering within 1-2ms round-trip latency.",
    ))
    db.add(TechnicalQuestion(
        submission_id=sub_rate_limiter.id,
        question="What happens if Redis becomes completely unavailable during peak load?",
        answer="I implemented a circuit-breaker using the pybreaker pattern. When Redis fails 3 consecutive health checks, the client falls back to an in-memory token bucket allocated per pod with an 80% quota cap. This prevents catastrophic cascading 500 errors across client applications.",
    ))
    db.add(TechnicalQuestion(
        submission_id=sub_rate_limiter.id,
        question="Where is the current bottleneck under 10× traffic (1M req/min)?",
        answer="The bottleneck is the single Redis primary core processing ZADD and ZREMRANGEBYSCORE. At 1M req/min, Redis single-thread CPU would saturate. Scaling 10× requires consistent hash partitioning of the client key space across multiple Redis masters.",
    ))
    db.add(TechnicalQuestion(
        submission_id=sub_rate_limiter.id,
        question="How would you scale this system 10×?",
        answer="1) Hash slot partitioning by tenant_id across a 12-master Redis cluster. 2) Client-side connection multiplexing with hiredis C bindings. 3) Migrating the Lua script to Redis 7 functions for compiled bytecode speedups.",
    ))
    db.add(TechnicalQuestion(
        submission_id=sub_rate_limiter.id,
        question="What trade-off did you knowingly accept in your architecture?",
        answer="I accepted higher memory consumption (O(N) sorted sets storing individual timestamp entries) to eliminate the boundary spike vulnerability inherent to Fixed Window counters.",
    ))

    # Expert Reviews for Rate Limiter
    db.add(Review(
        submission_id=sub_rate_limiter.id,
        reviewer_id=alex.id,
        architecture_score=8.8,
        code_quality_score=8.5,
        scalability_score=8.4,
        technical_reasoning_score=8.9,
        testing_score=8.6,
        overall_score=8.64,
        feedback="Extremely clean implementation of Redis-backed sliding window rate limiting. The atomic Lua script is well-constructed with proper garbage collection of expired timestamp members.",
        strengths="Clear separation of services, zero race condition window, and realistic circuit-breaking fail-open fallback.",
        improvements="Under severe Redis latency spikes, the timeout threshold (25ms) should be dynamic rather than hardcoded to prevent connection pool exhaustion.",
        reviewer_insight="“The architecture comfortably handles the target 100k requests/min. The developer clearly understands atomicity and failure isolation under network partitions.”",
        status="PUBLISHED"
    ))
    db.add(Review(
        submission_id=sub_rate_limiter.id,
        reviewer_id=carlos.id,
        architecture_score=8.2,
        code_quality_score=8.4,
        scalability_score=8.0,
        technical_reasoning_score=8.7,
        testing_score=8.5,
        overall_score=8.36,
        feedback="Verified microbenchmarks on Locust. p99 latency stayed under 6ms throughout the 20-minute run. Memory usage on Redis ZSET is well managed with proactive eviction.",
        strengths="Benchmark reproducibility and clear technical defense explanations on Redis single-threaded bottlenecks.",
        improvements="Add Prometheus histogram bucket metrics specifically measuring Lua script execution duration versus network transmission time.",
        reviewer_insight="“Good defense of the memory vs accuracy trade-off. This is someone who has debugged real production race conditions.”",
        status="PUBLISHED"
    ))

    # Project 2: Jeevan's Vector Search Engine
    c_vector = challenge_objs["vector-search-engine-ann"]
    sub_vector = Submission(
        user_id=jeevan.id,
        title="High-Recall HNSW Vector Search Engine in Python/C-Ext",
        description="In-memory approximate nearest neighbors search engine implementing Hierarchical Navigable Small World graphs with SIMD dot-product acceleration.",
        repository_url="https://github.com/jeevan-eng/hnsw-vector-engine",
        live_demo_url="https://vector-search-demo.proof.dev",
        status="VERIFIED",
        tags="AI/ML,Python,Vector Databases,System Design",
        capability_impact=json.dumps({"AI/ML": 8, "Python": 6, "System Design": 4, "Backend": 4}),
        created_at=datetime.now(timezone.utc) - timedelta(days=25)
    )
    db.add(sub_vector)
    db.commit()

    db.add(TechnicalDecision(
        submission_id=sub_vector.id,
        title="HNSW Multi-Layer Skip-List Graph vs ScaNN Trees",
        decision="Select HNSW graph construction with entry point routing across exponential decay layers.",
        context="Need sub-15ms p99 recall on 1536-dimensional OpenAI embeddings with continuous insert capability.",
        alternatives="Inverted File Index (IVF), KD-Trees, Product Quantization (PQ).",
        tradeoffs="HNSW graph pointers consume more RAM than Product Quantization (approx 1.2x raw vector size).",
        result="Achieved 97.4% recall@10 with 11.2ms p95 latency on a 150k vector corpus."
    ))
    db.add(Evidence(
        submission_id=sub_vector.id,
        type="BENCHMARK",
        title="HNSW vs Brute Force Recall Benchmark",
        url="https://benchmarks.proof.dev/runs/jeevan-hnsw-150k",
        description="Compared against exact NumPy matrix multiplication across 10,000 sample query vectors.",
        verification_status="VERIFIED",
        metrics_data=json.dumps({"recall_at_10": "97.4%", "p95_query_ms": 11.2, "index_time_seconds": 184})
    ))
    db.add(Review(
        submission_id=sub_vector.id,
        reviewer_id=maya.id,
        architecture_score=8.6,
        code_quality_score=8.7,
        scalability_score=8.2,
        technical_reasoning_score=8.8,
        testing_score=8.4,
        overall_score=8.54,
        feedback="Solid understanding of small-world navigation heuristics. The C-accelerated distance metric avoids Python GIL overhead effectively.",
        strengths="Mathematical accuracy of the distance calculation and thorough recall@10 validation scripts.",
        improvements="Investigate memory alignment for AVX2 vector instructions to push query throughput an additional 25%.",
        reviewer_insight="“Demonstrates genuine algorithmic grasp of graph indexing rather than just wrapping an off-the-shelf vector database.”",
        status="PUBLISHED"
    ))

    # Project 3: Elena's Raft Consensus Engine
    c_raft = challenge_objs["resilient-raft-consensus"]
    sub_raft = Submission(
        user_id=user_objs["elena_r"].id,
        title="Deterministic Raft Protocol Engine with TLA+ Spec",
        description="Zero-dependency Raft consensus implementation in Go featuring linearizable read leases, log compaction snapshots, and chaotic network partition fuzzing.",
        repository_url="https://github.com/elena-dist-sys/deterministic-raft",
        live_demo_url="https://raft-cluster.proof.dev",
        status="VERIFIED",
        tags="Distributed Systems,Consensus,Backend,System Design",
        capability_impact=json.dumps({"System Design": 9, "Backend": 8, "Testing": 8}),
        created_at=datetime.now(timezone.utc) - timedelta(days=18)
    )
    db.add(sub_raft)
    db.commit()

    db.add(Review(
        submission_id=sub_raft.id,
        reviewer_id=alex.id,
        architecture_score=9.6,
        code_quality_score=9.4,
        scalability_score=9.2,
        technical_reasoning_score=9.8,
        testing_score=9.5,
        overall_score=9.5,
        feedback="One of the best Raft implementations submitted on PROOF. The inclusion of TLA+ safety specifications and Jepsen nemesis testing proves absolute mastery.",
        strengths="Formal verification models, clean state machine boundaries, and battle-tested partition recovery.",
        improvements="Read index batching could be optimized under write-heavy saturation workloads.",
        reviewer_insight="“Elena represents the gold standard of demonstrated distributed systems engineering.”",
        status="PUBLISHED"
    ))

    # Project 4: Marcus Chen's LSM Key-Value Engine
    c_kv = challenge_objs["zero-copy-kv-store"]
    sub_kv = Submission(
        user_id=user_objs["mchen"].id,
        title="Zero-Copy io_uring LSM-Tree Storage Engine",
        description="High-performance embedded key-value engine using Linux io_uring asynchronous system calls and mmap SSTable segments.",
        repository_url="https://github.com/mchen-io/iouring-lsm-kv",
        live_demo_url="https://lsm-bench.proof.dev",
        status="VERIFIED",
        tags="Databases,Storage,C++,System Design",
        capability_impact=json.dumps({"Databases": 9, "System Design": 8, "Backend": 7}),
        created_at=datetime.now(timezone.utc) - timedelta(days=14)
    )
    db.add(sub_kv)
    db.commit()

    db.add(Review(
        submission_id=sub_kv.id,
        reviewer_id=carlos.id,
        architecture_score=9.1,
        code_quality_score=8.9,
        scalability_score=9.3,
        technical_reasoning_score=9.0,
        testing_score=8.8,
        overall_score=9.02,
        feedback="Superb memory management. Zero unnecessary copies between the page cache and user ring buffers.",
        strengths="Deep Linux kernel interface knowledge and flawless tiered compaction logic.",
        improvements="Expose more granular block-cache statistics in telemetry.",
        reviewer_insight="“Hardcore systems code with verified throughput exceeding 90k writes/sec.”",
        status="PUBLISHED"
    ))

    # Project 5: Sarah Jenkins's Real-Time CRDT Document Sync
    c_crdt = challenge_objs["real-time-collaboration-crdt"]
    sub_crdt = Submission(
        user_id=user_objs["s_jenkins"].id,
        title="Sub-Millisecond LSEQ CRDT Collaboration Gateway",
        description="Concurrent multiplayer text editing engine capable of handling 20,000 connected peers with guaranteed mathematical convergence.",
        repository_url="https://github.com/sjenkins-ml/lseq-crdt-gateway",
        live_demo_url="https://collab-crdt.proof.dev",
        status="VERIFIED",
        tags="Distributed Systems,WebSockets,System Design,Concurrency",
        capability_impact=json.dumps({"System Design": 8, "Backend": 7, "APIs": 8}),
        created_at=datetime.now(timezone.utc) - timedelta(days=22)
    )
    db.add(sub_crdt)
    db.commit()

    # Project 6: David Okafor's Query Execution Optimizer
    c_query = challenge_objs["sql-query-engine-optimizer"]
    sub_query = Submission(
        user_id=user_objs["d_okafor"].id,
        title="Vectorized Volcano SQL Execution Engine & Cost Optimizer",
        description="Relational database query engine with dynamic programming join enumeration and hyperloglog cardinality estimation.",
        repository_url="https://github.com/dokafor-db/volcano-sql-optimizer",
        live_demo_url="https://sql-engine.proof.dev",
        status="VERIFIED",
        tags="Databases,Compilers,System Design,Algorithms",
        capability_impact=json.dumps({"Databases": 9, "System Design": 8, "Python": 6}),
        created_at=datetime.now(timezone.utc) - timedelta(days=16)
    )
    db.add(sub_query)
    db.commit()

    # Project 7: Jeevan's Distributed Cache
    c_cache = challenge_objs["distributed-cache-consistent-hashing"]
    sub_cache = Submission(
        user_id=jeevan.id,
        title="MurmurHash3 Consistent Ring In-Memory Cache",
        description="Distributed cache with 150 virtual nodes per server ensuring uniform distribution and bounded key remaps during node topology changes.",
        repository_url="https://github.com/jeevan-eng/consistent-hash-cache",
        live_demo_url="https://cache-ring.proof.dev",
        status="VERIFIED",
        tags="Backend,Databases,System Design,Algorithms",
        capability_impact=json.dumps({"Backend": 6, "System Design": 6, "Databases": 5}),
        created_at=datetime.now(timezone.utc) - timedelta(days=40)
    )
    db.add(sub_cache)
    db.commit()

    # Project 8: Jeevan's Event Pipeline
    c_stream = challenge_objs["high-throughput-event-pipeline"]
    sub_stream = Submission(
        user_id=jeevan.id,
        title="50k Msg/Sec Exactly-Once Event Ingestion Pipeline",
        description="High-throughput stream processing pipeline built on Kafka partitions with RocksDB state stores for windowed deduplication.",
        repository_url="https://github.com/jeevan-eng/high-throughput-event-pipeline",
        live_demo_url="https://stream-pipeline.proof.dev",
        status="VERIFIED",
        tags="DevOps,Kafka,Streaming,Backend,Python",
        capability_impact=json.dumps({"DevOps": 7, "Backend": 6, "Python": 5}),
        created_at=datetime.now(timezone.utc) - timedelta(days=60)
    )
    db.add(sub_stream)
    db.commit()

    # 4. REELS (15+ Technical Engineering Reels)
    # Principles: Reel = hook. Project = evidence. No fluffy vanity likes.
    reels_data = [
        {
            "user_id": jeevan.id,
            "project_id": sub_rate_limiter.id,
            "challenge_id": c_limiter.id,
            "title": "How I Reduced Rate-Limiter Latency Under 100k Req/Min",
            "caption": "Eliminating race conditions in distributed rate limiters requires atomicity without holding heavyweight database locks.",
            "reel_type": "DEBUG",
            "metrics_before": "900ms p99",
            "metrics_after": "3.8ms p99",
            "hook_quote": "“I discovered Redis transactions were creating a silent network round-trip stampede. Here is how Lua scripts fixed it.”",
            "code_snippet": """-- Atomic sliding window evaluation in Redis Lua
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- Remove expired entries older than (now - window)
redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
local current_count = redis.call('ZCARD', key)

if current_count < limit then
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    return 1 -- Allowed
else
    return 0 -- Throttled
end""",
            "tags": "Backend,Performance,Redis,System Design",
            "views_count": 2840,
            "saves_count": 420
        },
        {
            "user_id": jeevan.id,
            "project_id": sub_rate_limiter.id,
            "challenge_id": c_limiter.id,
            "title": "Why I Chose Redis Lua Over Distributed Redlock",
            "caption": "Redlock introduces clock synchronization assumptions and multi-master round trips. For rate limiting, data locality wins.",
            "reel_type": "DECISION",
            "metrics_before": "32ms lock overhead",
            "metrics_after": "1.2ms single script execution",
            "hook_quote": "“Distributed locks are often the wrong hammer. If you can push logic to the storage engine, do it.”",
            "code_snippet": """# Evaluated in Python FastAPI via EVALSHA
async def check_rate_limit(redis_client, client_ip: str) -> bool:
    now_ms = int(time.time() * 1000)
    # One round-trip execution using preloaded SHA1 hash
    allowed = await redis_client.evalsha(
        LUA_SCRIPT_SHA, 1, f"ratelimit:{client_ip}", now_ms, 60000, 100
    )
    return bool(allowed)""",
            "tags": "System Design,Redis,Concurrency",
            "views_count": 1920,
            "saves_count": 310
        },
        {
            "user_id": jeevan.id,
            "project_id": sub_vector.id,
            "challenge_id": c_vector.id,
            "title": "Optimizing Vector ANN Recall from 71% → 97.4%",
            "caption": "Brute force matrix multiplication doesn't scale to 100k embeddings. Here's how HNSW heuristic pruning solved our recall degradation.",
            "reel_type": "BUILD",
            "metrics_before": "71.2% recall@10",
            "metrics_after": "97.4% recall@10",
            "hook_quote": "“Choosing M=16 and efConstruction=200 gave us near-exact precision with only a 15% index time penalty.”",
            "code_snippet": """# HNSW Layer search heuristic
def search_layer(q_vec, enter_points, num_candidates, layer_idx):
    visited = set(enter_points)
    candidates = PriorityQueue(enter_points)
    nearest_neighbors = PriorityQueue(enter_points)
    
    while not candidates.empty():
        curr = candidates.pop_nearest()
        furthest = nearest_neighbors.peek_furthest()
        if distance(curr, q_vec) > distance(furthest, q_vec):
            break
        for neighbor in graph[layer_idx][curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                # Prune and expand...""",
            "tags": "AI/ML,Algorithms,Python,Vector Search",
            "views_count": 3410,
            "saves_count": 512
        },
        {
            "user_id": user_objs["elena_r"].id,
            "project_id": sub_raft.id,
            "challenge_id": c_raft.id,
            "title": "Catching a Split-Brain Bug with Formal TLA+ Proofs",
            "caption": "My unit tests passed 1,000 times. Then TLA+ found a 4-step sequence where a minority partition committed stale logs.",
            "reel_type": "DEBUG",
            "metrics_before": "Silent Data Inconsistency",
            "metrics_after": "100% Proven Linearizability",
            "hook_quote": "“If you are building distributed consensus without formal verification, you are guessing.”",
            "code_snippet": r"""\* TLA+ Safety Invariant: Election Safety
ElectionSafety == 
  \A s1, s2 \in Server :
    (state[s1] = Leader /\ state[s2] = Leader) => (currentTerm[s1] # currentTerm[s2])

\* Verified under TLC Model Checker for N=5 nodes""",
            "tags": "Distributed Systems,Consensus,TLA+,Formal Methods",
            "views_count": 4120,
            "saves_count": 680
        },
        {
            "user_id": user_objs["mchen"].id,
            "project_id": sub_kv.id,
            "challenge_id": c_kv.id,
            "title": "Zero-Copy Disk I/O: Why io_uring Crushed Epoll",
            "caption": "System call overhead and kernel memory copying account for 45% of latency in standard LSM database reads.",
            "reel_type": "ARCHITECTURE",
            "metrics_before": "42k writes/sec (epoll)",
            "metrics_after": "94k writes/sec (io_uring)",
            "hook_quote": "“By mapping submission and completion queues directly into user space, we cut context switches to near zero.”",
            "code_snippet": """// io_uring SQE submission without blocking syscalls
struct io_uring_sqe *sqe = io_uring_get_sqe(&ring);
io_uring_prep_readv(sqe, fd, iovecs, 1, offset);
io_uring_sqe_set_data(sqe, req_context);
io_uring_submit(&ring); // Batch submissions in single loop""",
            "tags": "Databases,Linux,Kernels,Performance",
            "views_count": 2750,
            "saves_count": 489
        },
        {
            "user_id": user_objs["s_jenkins"].id,
            "project_id": sub_crdt.id,
            "challenge_id": c_crdt.id,
            "title": "Why Operational Transformation Fails Offline Peers",
            "caption": "OT requires a central sequencer to resolve concurrent edits. When peers disconnect, CRDTs maintain invariant trees that merge seamlessly.",
            "reel_type": "DECISION",
            "metrics_before": "Conflict Lost Overwrites",
            "metrics_after": "Zero Divergence Guaranteed",
            "hook_quote": "“Mathematically provable convergence beats complex centralized transformation matrices every single time.”",
            "code_snippet": """// LSEQ Identifier Generation with Boundary Allocation
function generateIdBetween(posP, posQ, boundaryStrategy) {
    const depth = findCommonPrefixDepth(posP, posQ);
    const step = chooseStepSize(boundaryStrategy, depth);
    const newDigit = allocateIdentifierDigit(posP[depth], posQ[depth], step);
    return [...posP.slice(0, depth), newDigit, clientClock];
}""",
            "tags": "Distributed Systems,CRDTs,WebSockets",
            "views_count": 1890,
            "saves_count": 340
        },
        {
            "user_id": user_objs["d_okafor"].id,
            "project_id": sub_query.id,
            "challenge_id": c_query.id,
            "title": "Cost-Based Query Optimization: Hash Join vs Nested Loop",
            "caption": "A naive nested loop on two 500k row tables takes 4.2 minutes. Hash join with dynamic histogram statistics takes 84 milliseconds.",
            "reel_type": "BUILD",
            "metrics_before": "252,000ms execution",
            "metrics_after": "84ms execution",
            "hook_quote": "“The query planner is the brain of a database. Bad cost estimates destroy hardware investments.”",
            "code_snippet": """# Cost calculation for Plan Operator selection
def estimate_hash_join_cost(left_rel, right_rel, catalog):
    n_left = catalog.get_cardinality(left_rel)
    n_right = catalog.get_cardinality(right_rel)
    # Cost = Build Hash Table + Probe Phase
    return (n_left * HASH_BUILD_FACTOR) + (n_right * HASH_PROBE_FACTOR)""",
            "tags": "Databases,Compilers,SQL,Algorithms",
            "views_count": 2100,
            "saves_count": 395
        },
        {
            "user_id": jeevan.id,
            "project_id": sub_rate_limiter.id,
            "challenge_id": c_limiter.id,
            "title": "Architecture: Handling 100k Req/Min Without Single Points of Failure",
            "caption": "Walkthrough of our Envoy ingress, 6-node stateless rate limiter pods, and Redis primary-replica failover topologies.",
            "reel_type": "ARCHITECTURE",
            "metrics_before": "Single Point of Failure",
            "metrics_after": "High-Availability Redundant Cluster",
            "hook_quote": "“Always design for the day your primary cache node spontaneously reboots under peak traffic.”",
            "code_snippet": """# Envoy rate limit filter snippet
rate_limit_service:
  grpc_service:
    envoy_grpc:
      cluster_name: rate_limit_cluster
  timeout: 0.015s # Strict 15ms SLA
  failure_mode_deny: false # Fail-open protection""",
            "tags": "Architecture,Envoy,Kubernetes,System Design",
            "views_count": 3890,
            "saves_count": 612
        },
        {
            "user_id": jeevan.id,
            "project_id": sub_cache.id,
            "challenge_id": c_cache.id,
            "title": "Consistent Hashing Ring: Reducing Cache Misses on Node Crash",
            "caption": "Modulo N hashing remaps 90% of keys when a server drops. Consistent hashing with virtual nodes drops remaps to under 8%.",
            "reel_type": "GROWTH",
            "metrics_before": "91% keys invalidated",
            "metrics_after": "7.8% keys invalidated",
            "hook_quote": "“Virtual nodes solve the clustering hot-spot problem by distributing replicas evenly across hash space.”",
            "code_snippet": """class ConsistentHashRing:
    def __init__(self, replicas=150):
        self.replicas = replicas
        self.ring = dict()
        self.sorted_keys = []

    def add_node(self, node: str):
        for i in range(self.replicas):
            v_key = murmurhash3(f"{node}#vnode{i}")
            self.ring[v_key] = node
            bisect.insort(self.sorted_keys, v_key)""",
            "tags": "System Design,Algorithms,Databases,Caching",
            "views_count": 2420,
            "saves_count": 418
        },
        {
            "user_id": jeevan.id,
            "project_id": sub_rate_limiter.id,
            "challenge_id": c_limiter.id,
            "title": "I Couldn't Pass the Concurrency Stress Test. Then I Tried This.",
            "caption": "My rate limiter allowed 14% overdrafts when 50 threads bombarded the service simultaneously. Here is the exact fix.",
            "reel_type": "CHALLENGE",
            "metrics_before": "14% overdraft rate",
            "metrics_after": "0% overdraft rate",
            "hook_quote": "“If your rate limiter does read-then-write without atomic transaction isolation, it's not a rate limiter.”",
            "code_snippet": """# Vulnerable Code:
# count = redis.get(key)
# if count < limit: redis.incr(key) -> RACE CONDITION!
#
# Fixed with single atomic Lua script call:
redis.evalsha(ATOMIC_SLIDING_WINDOW_SHA, 1, key, now, window, limit)""",
            "tags": "Challenges,Concurrency,Debugging,Backend",
            "views_count": 3120,
            "saves_count": 540
        }
    ]

    for r in reels_data:
        reel = Reel(
            user_id=r["user_id"],
            project_id=r["project_id"],
            challenge_id=r["challenge_id"],
            title=r["title"],
            caption=r["caption"],
            reel_type=r["reel_type"],
            metrics_before=r["metrics_before"],
            metrics_after=r["metrics_after"],
            hook_quote=r["hook_quote"],
            code_snippet=r["code_snippet"],
            tags=r["tags"],
            views_count=r["views_count"],
            saves_count=r["saves_count"]
        )
        db.add(reel)

    db.commit()

    # 5. TECHNICAL COMMENTS ON REELS
    first_reel = db.query(Reel).first()
    if first_reel:
        db.add(Comment(
            reel_id=first_reel.id,
            user_id=alex.id,
            text="How does this Lua script behave if Redis memory maxmemory-policy is set to allkeys-lru? Expiring members prematurely could skew your window calculation.",
            is_technical_question=True
        ))
        db.add(Comment(
            reel_id=first_reel.id,
            user_id=jeevan.id,
            text="Great call Alex. We explicitly set the rate-limiting keys with volatile-ttl and isolate rate limiter data on a dedicated Redis cluster so analytical cache evictions never evict active quota keys.",
            is_technical_question=False
        ))
        db.add(Comment(
            reel_id=first_reel.id,
            user_id=user_objs["mchen"].id,
            text="Nice clean solution. Did you profile whether hiredis C parser saved meaningful CPU cycles compared to the standard Python redis client parser?",
            is_technical_question=True
        ))

    # 6. OPPORTUNITIES (5 Recruiter-Initiated Opportunities)
    rachel = user_objs["rachel_a"]
    liam = user_objs["liam_rec"]

    opps_data = [
        {
            "recruiter_id": rachel.id,
            "developer_id": jeevan.id,
            "title": "Senior Distributed Systems & Performance Engineer",
            "company_name": "Horizon Infrastructure Labs",
            "location": "Remote (US / EU) / San Francisco",
            "salary_range": "$185,000 - $240,000 + 0.15% Equity",
            "description": "We discovered your verified work on the Redis Sliding Window Rate Limiter and HNSW Vector Engine. Your documented technical defense on circuit breaking and sub-4ms p99 latency directly aligns with our API gateway infrastructure roadmap.",
            "match_reasons": json.dumps([
                "Matched 91/100 Python & 86/100 Backend capability requirement",
                "High Evidence Confidence with 17 verified projects",
                "Expert review by Principal Architect Alex Thorne (8.64/10)",
                "Proven low-latency benchmarking & concurrency defense"
            ]),
            "status": "NEW"
        },
        {
            "recruiter_id": liam.id,
            "developer_id": jeevan.id,
            "title": "Lead Core Backend Architect (Vector & Storage)",
            "company_name": "ScaleWorks Data Engine",
            "location": "San Francisco, CA (Hybrid)",
            "salary_range": "$200,000 - $260,000 + Top Tier Equity",
            "description": "Our portfolio founding team is scaling an AI search infrastructure platform. We reviewed your architecture diagrams and empirical benchmarks on HNSW graph indexing. We'd love to discuss leading the query execution pod.",
            "match_reasons": json.dumps([
                "Verified Vector Search HNSW implementation with 97.4% recall",
                "Demonstrated System Design score of 78+ with architecture models",
                "Demonstrated live staging deployment evidence"
            ]),
            "status": "INTERESTED"
        },
        {
            "recruiter_id": rachel.id,
            "developer_id": user_objs["elena_r"].id,
            "title": "Staff Consensus Protocol Engineer",
            "company_name": "Horizon Infrastructure Labs",
            "location": "Remote / Zurich / New York",
            "salary_range": "$240,000 - $310,000 + Equity",
            "description": "Your formal TLA+ verification for Raft consensus is exceptional. We need a staff engineer to architect our multi-datacenter transactional state machine.",
            "match_reasons": json.dumps([
                "92/100 Overall Capability with 21 verified distributed systems projects",
                "TLA+ formal verification artifact attached to profile",
                "Principal Reviewer score of 9.5/10"
            ]),
            "status": "IN_DISCUSSION"
        },
        {
            "recruiter_id": liam.id,
            "developer_id": user_objs["mchen"].id,
            "title": "Low-Latency Kernel / Storage Engineer",
            "company_name": "ScaleWorks High-Frequency Analytics",
            "location": "New York, NY",
            "salary_range": "$220,000 - $290,000",
            "description": "Discovered your io_uring zero-copy LSM storage engine benchmark. We are building custom Linux kernel drivers for next-generation analytical telemetry.",
            "match_reasons": json.dumps([
                "89/100 Systems Capability",
                "Verified 94k writes/sec io_uring benchmark",
                "Staff Reviewer verification by Carlos Vance"
            ]),
            "status": "NEW"
        },
        {
            "recruiter_id": rachel.id,
            "developer_id": user_objs["s_jenkins"].id,
            "title": "Senior Collaborative Systems Lead",
            "company_name": "SyncSpace Technologies",
            "location": "Remote",
            "salary_range": "$175,000 - $230,000",
            "description": "Reviewing your CRDT LSEQ implementation for multiplayer text sync. We are building the next-generation spatial computing collaboration canvas.",
            "match_reasons": json.dumps([
                "85/100 Capability with strong CRDT state convergence proof",
                "WebSocket scalability stress test with 20k simulated peers"
            ]),
            "status": "NEW"
        }
    ]

    for opp in opps_data:
        db.add(Opportunity(
            recruiter_id=opp["recruiter_id"],
            developer_id=opp["developer_id"],
            title=opp["title"],
            company_name=opp["company_name"],
            location=opp["location"],
            salary_range=opp["salary_range"],
            description=opp["description"],
            match_reasons=opp["match_reasons"],
            status=opp["status"]
        ))

    db.commit()
    print("Database seeding completed successfully!")
