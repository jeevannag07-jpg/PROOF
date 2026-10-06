import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.core.database import SessionLocal
from backend.app.models import User, Submission, Review, Reel

db = SessionLocal()
try:
    jeevan = db.query(User).filter(User.username == 'jeevan').first()
    elena = db.query(User).filter(User.username == 'elena_r').first()
    marcus = db.query(User).filter(User.username == 'mchen').first()
    alex = db.query(User).filter(User.username == 'alex_t').first()
    maya = db.query(User).filter(User.username == 'dr_mlin').first()
    carlos = db.query(User).filter(User.username == 'cvance').first()

    # Check if extra projects already exist
    if db.query(Submission).count() < 11:
        p9 = Submission(
            user_id=jeevan.id,
            title='eBPF Network Observability & TCP Packet Drop Monitor',
            description='Kernel-space probe tool for detecting microsecond TCP retransmissions and dropped packets across container network namespaces.',
            repository_url='https://github.com/jeevan-eng/ebpf-tcp-monitor',
            live_demo_url='https://ebpf-monitor.proof.dev',
            status='VERIFIED',
            tags='DevOps,Linux,Networking,System Design',
            capability_impact=json.dumps({'DevOps': 8, 'System Design': 6, 'Cloud': 5})
        )
        db.add(p9)

        p10 = Submission(
            user_id=elena.id,
            title='Multi-Paxos Distributed Consensus Cluster in Rust',
            description='Strict Multi-Paxos implementation with pipelined leader proposals and zero-downtime reconfiguration.',
            repository_url='https://github.com/elena-dist-sys/paxos-rust',
            live_demo_url='https://paxos-demo.proof.dev',
            status='VERIFIED',
            tags='Distributed Systems,Rust,Consensus,Backend',
            capability_impact=json.dumps({'System Design': 9, 'Backend': 8})
        )
        db.add(p10)

        p11 = Submission(
            user_id=marcus.id,
            title='Lock-Free SPSC/MPMC Ring Buffer Queue in C++20',
            description='Sub-10ns latency inter-thread messaging queue with cache-line padding and relaxed atomic memory orderings.',
            repository_url='https://github.com/mchen-io/lockfree-ring-buffer',
            live_demo_url='https://ringbuffer-bench.proof.dev',
            status='VERIFIED',
            tags='Concurrency,C++,Low Latency,System Design',
            capability_impact=json.dumps({'System Design': 8, 'Backend': 7})
        )
        db.add(p11)
        db.commit()

        # Additional Reviews to reach 11 reviews
        db.add(Review(submission_id=p9.id, reviewer_id=carlos.id, architecture_score=8.7, code_quality_score=8.9, scalability_score=8.5, technical_reasoning_score=8.8, testing_score=8.4, overall_score=8.66, feedback='Clean eBPF bytecode loaded with libbpf. Minimal kernel overhead verified.', strengths='Kernel safety and zero overhead', improvements='Support older kernel versions', reviewer_insight='“Exceptional network debugging capability.”', status='PUBLISHED'))
        db.add(Review(submission_id=p10.id, reviewer_id=alex.id, architecture_score=9.4, code_quality_score=9.3, scalability_score=9.1, technical_reasoning_score=9.5, testing_score=9.2, overall_score=9.3, feedback='Flawless Paxos pipelining logic.', strengths='Correctness under network reordering', improvements='Benchmark under sustained asymmetric partitions', reviewer_insight='“True mastery of consensus protocols.”', status='PUBLISHED'))
        db.add(Review(submission_id=p11.id, reviewer_id=maya.id, architecture_score=9.0, code_quality_score=8.8, scalability_score=9.2, technical_reasoning_score=9.1, testing_score=8.7, overall_score=8.96, feedback='Cache-line false sharing is rigorously prevented with 64-byte alignas.', strengths='Hardware-conscious optimization', improvements='Add ThreadSanitizer test harness', reviewer_insight='“Sub-10ns message passing validated.”', status='PUBLISHED'))
        db.add(Review(submission_id=2, reviewer_id=alex.id, architecture_score=8.5, code_quality_score=8.6, scalability_score=8.3, technical_reasoning_score=8.7, testing_score=8.2, overall_score=8.46, feedback='Strong vector retrieval architecture with clear separation of quantization and graph traversal.', strengths='Algorithmic efficiency', improvements='Investigate disk-backed HNSW memory reduction', reviewer_insight='“Demonstrated deep understanding of spatial indexing.”', status='PUBLISHED'))
        db.add(Review(submission_id=5, reviewer_id=carlos.id, architecture_score=8.9, code_quality_score=8.6, scalability_score=8.7, technical_reasoning_score=8.8, testing_score=8.5, overall_score=8.7, feedback='WebSocket fanout handling is scalable up to 20k concurrent peers with minimal memory leaks.', strengths='WebSocket connection lifecycle management', improvements='Benchmark against flaky mobile networks', reviewer_insight='“Scalable real-time gateway architecture.”', status='PUBLISHED'))
        db.add(Review(submission_id=6, reviewer_id=alex.id, architecture_score=9.0, code_quality_score=8.9, scalability_score=8.8, technical_reasoning_score=9.1, testing_score=8.6, overall_score=8.88, feedback='Volcano iterator pipeline is elegant. Hash join probe stage handles skew gracefully.', strengths='Cost estimation heuristics', improvements='Add adaptive query execution support', reviewer_insight='“Solid compiler and database internals.”', status='PUBLISHED'))

    # Additional Reels to reach 16 reels
    if db.query(Reel).count() < 16:
        extra_reels = [
            (jeevan.id, 1, 1, 'Detecting TCP Micro-Drops in Kernel Space with eBPF', 'Using BCC and eBPF tracepoints to diagnose silent retransmits.', 'DEBUG', 'Silent packet loss', '0.01% detectable loss', '“eBPF lets us debug production networks without stopping traffic.”', 'SEC("kprobe/tcp_drop") int kprobe_tcp_drop(struct pt_regs *ctx) { return 0; }', 'eBPF,Linux,Networking', 3120, 480),
            (elena.id, 3, 8, 'Why Multi-Paxos Leader Leases Break Without Monotonic Clocks', 'Clock drift between servers can cause two leaders to simultaneously serve stale reads.', 'DECISION', 'Stale read risk', 'Bounded clock sync leases', '“Never trust wall clock timestamps for linearizable distributed reads.”', 'fn check_leader_lease(&self, monotonic_now: Instant) -> bool { true }', 'Consensus,Distributed Systems,Rust', 2940, 510),
            (marcus.id, 4, 6, 'Sub-10ns Messaging: Eliminating Cache Line False Sharing', 'When producer and consumer write to the same 64-byte L1 cache line, performance drops 80%.', 'ARCHITECTURE', '48ns latency', '8.4ns latency', '“Aligning atomic head and tail pointers to distinct cache lines unlocked 5.7x throughput.”', 'alignas(64) std::atomic<size_t> head_{0};\nalignas(64) std::atomic<size_t> tail_{0};', 'Concurrency,Hardware,C++', 4210, 720),
            (jeevan.id, 1, 1, 'My Rate Limiter Architecture 6 Months Ago vs Today', 'From a fragile single Redis node with fixed windows to a resilient clustered sliding window.', 'GROWTH', 'Fixed window spike vulnerability', 'Smooth zero-overdraft sliding window', '“Engineering growth is about discovering the edge cases you didn’t know existed.”', '# Architecture evolution documented in PROOF capability log', 'Growth,System Design,Backend', 3560, 610),
            (jeevan.id, 2, 2, 'Why Python Alone Was Too Slow for Vector Dot Products', 'Pure Python loop took 180ms per 1k vectors. SIMD C-extension brought it down to 1.4ms.', 'DEBUG', '180ms per query', '1.4ms with SIMD', '“Profile before you optimize. The vector dot product was consuming 91% of CPU cycles.”', '#include <immintrin.h>\n__m256 v1 = _mm256_loadu_ps(&a[i]);', 'AI/ML,Optimization,C,Python', 4890, 890),
            (elena.id, 3, 8, 'Raft Heartbeats: Tuning Election Timeouts for WAN Networks', 'Tuning randomized timeouts (150ms-300ms) prevents election flapping when round-trip latency fluctuates.', 'CHALLENGE', 'Election flapping', 'Stable leader convergence', '“Distributed systems must tolerate network jitter without panicking into reelection.”', 'def random_election_timeout():\n    return base_timeout + random.uniform(0.0, jitter)', 'Distributed Systems,Raft,Reliability', 2650, 430)
        ]

        for uid, pid, cid, title, cap, rtype, mb, ma, hook, code, tags, views, saves in extra_reels:
            db.add(Reel(
                user_id=uid,
                project_id=pid,
                challenge_id=cid,
                title=title,
                caption=cap,
                reel_type=rtype,
                metrics_before=mb,
                metrics_after=ma,
                hook_quote=hook,
                code_snippet=code,
                tags=tags,
                views_count=views,
                saves_count=saves
            ))

    db.commit()
    print("Seed expansion completed successfully.")
finally:
    db.close()
