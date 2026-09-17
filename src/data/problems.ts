// Original practice problems. No copied exam material.
export type Mode = 'interleaved' | 'blind' | 'redteam' | 'proof' | 'teachback'
export type Tier = 'University' | 'Hard university' | 'Elite undergraduate' | 'Graduate' | 'Research challenge'

export type Problem = {
  id: string
  title: string
  mode: Mode
  tier: Tier
  courseId: string
  topics: string[]
  statement: string
  expected: string
  trap: string
  minutes: number
}

export const modeLabels: Record<Mode, string> = {
  interleaved: 'Interleaved exam — the topic is not given',
  blind: 'Blind implementation — no algorithm named',
  redteam: 'Knowledge red team — designed to expose a gap',
  proof: 'Proof lab — argue, do not compute',
  teachback: 'Teach-back — you explain, you are graded on it',
}

export const tiers: Tier[] = ['University', 'Hard university', 'Elite undergraduate', 'Graduate', 'Research challenge']

export const problems: Problem[] = [
  {
    id: 'p1', title: 'The stream that must answer twice', mode: 'blind', tier: 'Hard university', courseId: 'cs201',
    topics: ['Heaps', 'Invariants', 'Streaming'],
    statement: 'Numbers arrive one at a time and never leave. After every arrival you must report the current median in O(log n), and every 1000 arrivals you must report the 90th percentile. Design the data structure and justify every operation cost. You are not told which structure to use.',
    expected: 'Two heaps with a size invariant for the median; for the percentile either an order-statistic tree or a reservoir with an explicit accuracy claim. The answer must state the invariant that keeps the heaps balanced and what breaks if it is violated.',
    trap: 'Most people reach for sorting per query, or claim a single heap gives percentiles. State the invariant first, then the cost.',
    minutes: 35,
  },
  {
    id: 'p2', title: 'Amortized cost of a shrinking array', mode: 'proof', tier: 'Hard university', courseId: 'cs301',
    topics: ['Amortized analysis', 'Potential method'],
    statement: 'A dynamic array doubles on overflow and halves when it becomes exactly half empty. Prove that this policy does NOT give O(1) amortized cost, then propose a threshold that does and prove it with the potential method.',
    expected: 'A construction alternating push/pop at the boundary forcing Θ(n) work per operation; then halving at one quarter full, with a potential function and the standard accounting argument.',
    trap: 'Hand-waving "doubling is amortized O(1) so halving must be too". The counterexample is the point.',
    minutes: 40,
  },
  {
    id: 'p3', title: 'Which concept applies?', mode: 'interleaved', tier: 'Elite undergraduate', courseId: 'cs301',
    topics: ['Unknown — that is the exercise'],
    statement: 'A service handles 4000 requests/second. Each request reads one of 10 million keys; 1% of keys receive 90% of reads. Latency at p99 has doubled after a deploy that changed nothing but the key hashing function. Explain the mechanism, name the concept, and give the measurement that would confirm it.',
    expected: 'Cache locality and hash distribution: the new function destroyed the hot-set concentration in cache lines / shards, so p99 is dominated by misses. Confirm with per-shard hit rate and cache-miss counters, not with average latency.',
    trap: 'Answering "add more cache". You are asked for the mechanism and the confirming measurement.',
    minutes: 25,
  },
  {
    id: 'p4', title: 'A lock that is correct but useless', mode: 'redteam', tier: 'Graduate', courseId: 'cs320',
    topics: ['Concurrency', 'Scheduling', 'Fairness'],
    statement: 'You implement a spinlock with test-and-set. It is provably mutually exclusive. Under 64 threads on 8 cores, throughput collapses to below single-threaded. Explain precisely why, then fix it twice: once without changing the algorithm class, once by changing it.',
    expected: 'Cache-line contention and bus traffic from TAS; convoying and no fairness. Fix 1: test-and-test-and-set with exponential backoff. Fix 2: a queue lock (MCS) with per-thread nodes. Discuss the tradeoff under low contention.',
    trap: 'Blaming "context switches" without the coherence traffic argument.',
    minutes: 35,
  },
  {
    id: 'p5', title: 'Explain backpropagation to a sceptical examiner', mode: 'teachback', tier: 'University', courseId: 'cs410',
    topics: ['Chain rule', 'Computational graphs'],
    statement: 'Teach backpropagation for a two-layer MLP without using the word "just". Derive the gradient for the second-layer weights, state the shapes of every matrix, and explain why the same algorithm applies to any differentiable graph.',
    expected: 'Correct chain-rule derivation with explicit shapes, the distinction between the local Jacobian and the accumulated gradient, and reverse-mode as a graph traversal — not an MLP-specific trick.',
    trap: 'Reciting "the error is propagated backwards" without a single shape or derivative written down.',
    minutes: 30,
  },
  {
    id: 'p6', title: 'The index that made it slower', mode: 'interleaved', tier: 'Hard university', courseId: 'cs330',
    topics: ['Indexing', 'Query planning', 'Selectivity'],
    statement: 'A query filtering on a boolean column over 50 million rows becomes slower after adding a B-tree index on that column. Explain the planner reasoning, quantify when the index would help, and name the physical access pattern involved.',
    expected: 'Low selectivity means random heap access dominates a sequential scan; the crossover depends on the fraction of rows returned and rows-per-page. Mentions correlated/clustered ordering and covering indexes.',
    trap: '"Indexes always speed up reads."',
    minutes: 25,
  },
  {
    id: 'p7', title: 'Consensus without a leader you trust', mode: 'blind', tier: 'Graduate', courseId: 'cs460',
    topics: ['Replication', 'Safety vs liveness'],
    statement: 'Five replicas must agree on an append-only log. The network can delay and reorder messages arbitrarily but not corrupt them; nodes can crash and restart with disk intact. Specify a protocol and prove the safety property you claim. Then state precisely which failure makes it lose liveness.',
    expected: 'A quorum protocol with terms, monotone voting rules and a durable log; safety argued via quorum intersection; liveness lost under indefinite partition or repeated election timeouts (FLP-consistent reasoning).',
    trap: 'Describing "the leader decides" without the intersection argument, or claiming liveness under arbitrary asynchrony.',
    minutes: 45,
  },
  {
    id: 'p8', title: 'Two models, one honest comparison', mode: 'redteam', tier: 'Research challenge', courseId: 'cs450',
    topics: ['Experimental design', 'Statistics'],
    statement: 'Model B beats model A by 1.4 accuracy points on one test split. Design the experiment that would let you claim the improvement is real, list every confound you must control, and state the result that would make you abandon the claim.',
    expected: 'Multiple seeds with reported variance, matched compute and data budgets, held-out split hygiene, a paired significance test with stated assumptions, and an ablation isolating the change. Abandonment condition stated in advance.',
    trap: 'Reporting one number per model and calling it an improvement.',
    minutes: 40,
  },
  {
    id: 'p9', title: 'Prove your scheduler cannot starve', mode: 'proof', tier: 'Elite undergraduate', courseId: 'cs320',
    topics: ['Scheduling', 'Invariants'],
    statement: 'You design a scheduler with dynamic priorities that increase with waiting time. Prove that no runnable task waits forever, and identify the exact assumption your proof depends on.',
    expected: 'A monotone-progress / bounded-priority argument showing every waiting task eventually attains maximum priority, depending on a finite task set and bounded quantum. Names the assumption explicitly.',
    trap: 'Arguing from intuition about "aging" without a bound.',
    minutes: 30,
  },
  {
    id: 'p10', title: 'Reproduce a number you do not believe', mode: 'redteam', tier: 'Research challenge', courseId: 'cs450',
    topics: ['Reproduction', 'Scepticism'],
    statement: 'A paper reports a 2.4x speedup. Your reimplementation reaches 1.3x. List the six most likely causes in order of prior probability, and design the single cheapest measurement that discriminates between the top two.',
    expected: 'Hardware/bandwidth differences, unreported kernel fusion, different baseline strength, sequence-length or batch regime, measurement methodology (warmup, synchronisation), and compiler flags. The discriminating measurement is named and cheap.',
    trap: 'Concluding the paper is wrong, or that you are wrong, before measuring.',
    minutes: 35,
  },
]

export const problemsFor = (mode: Mode) => problems.filter(p => p.mode === mode)
