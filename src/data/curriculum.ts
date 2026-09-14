export type Level = 'A' | 'B' | 'C'
export type Lesson = { id: string; title: string; summary: string; minutes: number; level: Level; objectives: string[]; implement: string; proof?: string }
export type Module = { id: string; title: string; lessons: Lesson[] }
export type Course = { id: string; code: string; title: string; year: 1 | 2 | 3 | 4; level: Level; area: string; credits: number; description: string; prerequisites: string[]; resources: { label: string; url: string }[]; modules: Module[] }

const L = (id: string, title: string, summary: string, minutes: number, level: Level, objectives: string[], implement: string, proof?: string): Lesson => ({ id, title, summary, minutes, level, objectives, implement, proof })

export const courses: Course[] = [
  {
    id: 'cs101', code: 'CS101', title: 'Programming Fundamentals', year: 1, level: 'A', area: 'Programming', credits: 4,
    description: 'Python and C from first principles: memory, control flow, functions, recursion, debugging, tooling.',
    prerequisites: [],
    resources: [
      { label: 'CS50x (Harvard)', url: 'https://cs50.harvard.edu/x/' },
      { label: 'Structure and Interpretation of Computer Programs', url: 'https://mitpress.mit.edu/9780262510875/' },
      { label: 'The Missing Semester of Your CS Education (MIT)', url: 'https://missing.csail.mit.edu/' },
    ],
    modules: [
      { id: 'cs101-m1', title: 'Computation and control flow', lessons: [
        L('cs101-l1', 'Values, types and state', 'What a variable actually is in memory; mutation vs rebinding.', 45, 'A', ['Explain the difference between a name and an object', 'Predict aliasing bugs'], 'Implement a swap, a deep copy and a shallow copy; show where they differ.'),
        L('cs101-l2', 'Conditionals and loops as invariants', 'Every loop carries an invariant; find it before writing it.', 50, 'A', ['State a loop invariant', 'Prove termination'], 'Write binary search and state its invariant in a comment.', 'Prove your binary search terminates and is correct at exit.'),
        L('cs101-l3', 'Functions, scope and the call stack', 'Frames, parameters, return values, recursion depth.', 50, 'A', ['Trace a recursive call by hand', 'Convert recursion to iteration'], 'Implement factorial, Fibonacci (memoised) and Ackermann; measure stack depth.'),
      ]},
      { id: 'cs101-m2', title: 'C, memory and tooling', lessons: [
        L('cs101-l4', 'Pointers and manual memory', 'Addresses, dereferencing, ownership, leaks.', 60, 'A', ['Read a pointer diagram', 'Use valgrind reasoning'], 'Implement a dynamic array in C with growth doubling.'),
        L('cs101-l5', 'Debugging as a discipline', 'Hypothesis-driven debugging: bisect, instrument, minimise.', 40, 'A', ['Write a minimal reproduction', 'Use a debugger not print statements'], 'Take a buggy program, minimise it to 10 lines that still fail.'),
        L('cs101-l6', 'Git and Linux as an engineer', 'Branches, rebase, diff reading, shell pipelines, permissions.', 45, 'A', ['Resolve a conflict deliberately', 'Compose shell pipelines'], 'Reconstruct a lost commit with git reflog.'),
      ]},
    ],
  },
  {
    id: 'math110', code: 'MATH110', title: 'Discrete Mathematics and Proof', year: 1, level: 'A', area: 'Mathematics', credits: 4,
    description: 'Logic, sets, relations, functions, combinatorics, graph theory and the proof techniques CS depends on.',
    prerequisites: [],
    resources: [
      { label: 'Mathematics for Computer Science (MIT 6.042)', url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/' },
      { label: 'Book of Proof (Hammack)', url: 'https://www.people.vcu.edu/~rhammack/BookOfProof/' },
    ],
    modules: [
      { id: 'math110-m1', title: 'Logic and proof technique', lessons: [
        L('math110-l1', 'Propositional and predicate logic', 'Quantifier order, negation, vacuous truth.', 50, 'A', ['Negate a nested quantified statement', 'Detect a logical fallacy in a proof'], 'Write a truth-table evaluator for arbitrary propositional formulas.', 'Prove De Morgan for quantifiers.'),
        L('math110-l2', 'Direct proof, contraposition, contradiction', 'Choosing the technique the statement wants.', 55, 'A', ['Select a proof strategy from statement shape'], 'Prove sqrt(2) irrational, then generalise to sqrt(p) for prime p.', 'Prove: if n^2 is even then n is even, two different ways.'),
        L('math110-l3', 'Induction and structural induction', 'Weak, strong and structural induction on trees and grammars.', 60, 'A', ['Write a correct inductive hypothesis', 'Induct over recursive structures'], 'Prove your tree-height function correct by structural induction.', 'Prove every binary tree with n leaves has n-1 internal nodes.'),
      ]},
      { id: 'math110-m2', title: 'Counting and graphs', lessons: [
        L('math110-l4', 'Combinatorics', 'Bijections, pigeonhole, inclusion-exclusion, generating counts.', 55, 'A', ['Count by bijection', 'Apply pigeonhole to prove existence'], 'Enumerate all permutations lexicographically without recursion.'),
        L('math110-l5', 'Graph theory foundations', 'Degrees, paths, connectivity, trees, bipartiteness, colouring.', 55, 'A', ['Prove handshake lemma', 'Recognise bipartite structure'], 'Detect bipartiteness with BFS two-colouring.', 'Prove a graph is bipartite iff it has no odd cycle.'),
      ]},
    ],
  },
  {
    id: 'cs201', code: 'CS201', title: 'Data Structures', year: 1, level: 'A', area: 'Data Structures', credits: 4,
    description: 'Arrays, lists, stacks, queues, trees, heaps, hash tables and graphs — implemented from scratch with cost analysis.',
    prerequisites: ['cs101', 'math110'],
    resources: [
      { label: 'Open Data Structures', url: 'https://opendatastructures.org/' },
      { label: 'MIT 6.006 Introduction to Algorithms', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/' },
    ],
    modules: [
      { id: 'cs201-m1', title: 'Linear structures', lessons: [
        L('cs201-l1', 'Dynamic arrays and amortisation', 'Why doubling gives O(1) amortised append.', 50, 'A', ['Run an accounting argument', 'Distinguish worst case from amortised'], 'Implement a dynamic array; plot cost per operation over 10^6 appends.', 'Prove amortised O(1) append with the potential method.'),
        L('cs201-l2', 'Linked lists, stacks, queues, deques', 'Pointer discipline and cache consequences.', 45, 'A', ['Choose list vs array from access pattern'], 'Implement a deque two ways (ring buffer, doubly linked) and benchmark.'),
        L('cs201-l3', 'Hash tables', 'Hash functions, load factor, chaining vs open addressing, clustering.', 55, 'A', ['Explain why a bad hash destroys performance'], 'Implement open addressing with linear probing and tombstones.'),
      ]},
      { id: 'cs201-m2', title: 'Hierarchical structures', lessons: [
        L('cs201-l4', 'Binary search trees and balance', 'Rotations, AVL invariants, degeneration.', 60, 'A', ['State the AVL invariant', 'Trace rotations'], 'Implement an AVL tree with deletion and validate the invariant after every op.', 'Prove AVL height is O(log n).'),
        L('cs201-l5', 'Heaps and priority queues', 'Sift up/down, build-heap linear time, heapsort.', 50, 'A', ['Prove build-heap is O(n)'], 'Implement a binary heap and a d-ary heap; measure decrease-key cost.', 'Prove build-heap runs in O(n).'),
        L('cs201-l6', 'Graph representations', 'Adjacency list vs matrix; traversal orders.', 45, 'A', ['Pick representation from density'], 'Implement BFS/DFS iteratively and detect cycles in a directed graph.'),
      ]},
    ],
  },
  {
    id: 'cs210', code: 'CS210', title: 'Computer Organization', year: 1, level: 'A', area: 'Systems', credits: 4,
    description: 'From Boolean logic to a working CPU: binary, gates, ALUs, instruction sets, assembly, memory hierarchy.',
    prerequisites: ['cs101'],
    resources: [
      { label: 'Nand2Tetris', url: 'https://www.nand2tetris.org/' },
      { label: 'Computer Systems: A Programmer\u2019s Perspective (course site)', url: 'https://csapp.cs.cmu.edu/' },
    ],
    modules: [
      { id: 'cs210-m1', title: 'Digital foundations', lessons: [
        L('cs210-l1', 'Binary, two\u2019s complement, floating point', 'Representation limits and rounding error.', 50, 'A', ['Explain catastrophic cancellation'], 'Implement float addition by hand on bit patterns; compare with hardware.'),
        L('cs210-l2', 'Boolean algebra and combinational logic', 'Gates, minimisation, adders, muxes.', 50, 'A', ['Minimise an expression', 'Build an adder from gates'], 'Build a 4-bit ripple-carry adder in a simulator or in Verilog.'),
        L('cs210-l3', 'Sequential logic and the datapath', 'Registers, clocking, control, an ALU.', 60, 'A', ['Trace one instruction through a datapath'], 'Design an 8-bit ALU supporting add, sub, and, or, shift.'),
      ]},
      { id: 'cs210-m2', title: 'Instructions and memory', lessons: [
        L('cs210-l4', 'Instruction sets and assembly', 'RISC-V basics, calling convention, stack frames.', 55, 'A', ['Hand-assemble a function', 'Read compiler output'], 'Write a RISC-V assembly function and verify against a C version.'),
        L('cs210-l5', 'Caches and the memory hierarchy', 'Locality, associativity, miss types, false sharing.', 55, 'A', ['Predict miss rate from access pattern'], 'Write a cache simulator and reproduce the row-major vs column-major gap.'),
      ]},
    ],
  },
  {
    id: 'cs301', code: 'CS301', title: 'Algorithms and Complexity', year: 2, level: 'A', area: 'Algorithms', credits: 4,
    description: 'Design and analysis: divide and conquer, greedy, dynamic programming, graph algorithms, randomisation, lower bounds.',
    prerequisites: ['cs201', 'math110'],
    resources: [
      { label: 'MIT 6.046 Design and Analysis of Algorithms', url: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/' },
      { label: 'Algorithms (Dasgupta, Papadimitriou, Vazirani)', url: 'https://people.eecs.berkeley.edu/~vazirani/algorithms.html' },
    ],
    modules: [
      { id: 'cs301-m1', title: 'Design paradigms', lessons: [
        L('cs301-l1', 'Divide and conquer and recurrences', 'Master theorem, recursion trees, substitution.', 55, 'A', ['Solve a recurrence three ways'], 'Implement Karatsuba multiplication and find the crossover with schoolbook.', 'Solve T(n)=2T(n/2)+n by substitution.'),
        L('cs301-l2', 'Greedy algorithms and exchange arguments', 'When greedy is provably optimal.', 55, 'A', ['Construct an exchange argument', 'Find a counterexample to a wrong greedy'], 'Implement interval scheduling and Huffman coding.', 'Prove earliest-finish-time interval scheduling is optimal.'),
        L('cs301-l3', 'Dynamic programming', 'State design, overlapping subproblems, reconstruction.', 65, 'A', ['Define a DP state precisely', 'Reconstruct the solution not just the value'], 'Implement edit distance with O(min(m,n)) memory and path reconstruction.'),
      ]},
      { id: 'cs301-m2', title: 'Graphs, randomness, limits', lessons: [
        L('cs301-l4', 'Shortest paths and flows', 'Dijkstra, Bellman-Ford, max-flow/min-cut intuition.', 60, 'A', ['Explain why Dijkstra fails with negative edges'], 'Implement Dijkstra with a binary heap and Bellman-Ford; compare on negative edges.', 'Prove Dijkstra correct for non-negative weights.'),
        L('cs301-l5', 'Randomised algorithms', 'Expectation, concentration, quicksort, hashing.', 50, 'B', ['Compute an expected running time'], 'Implement randomised quickselect; empirically verify expected O(n).'),
        L('cs301-l6', 'Complexity and reductions', 'P, NP, NP-completeness, reduction craft.', 60, 'B', ['Build a reduction', 'Recognise an NP-hard problem in disguise'], 'Reduce 3-SAT to independent set in code and verify on small instances.'),
      ]},
    ],
  },
  {
    id: 'cs320', code: 'CS320', title: 'Operating Systems', year: 2, level: 'A', area: 'Systems', credits: 4,
    description: 'Processes, threads, scheduling, virtual memory, file systems, concurrency and the kernel/user boundary.',
    prerequisites: ['cs210', 'cs201'],
    resources: [
      { label: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
      { label: 'xv6 (MIT)', url: 'https://pdos.csail.mit.edu/6.828/2023/xv6.html' },
    ],
    modules: [
      { id: 'cs320-m1', title: 'Virtualisation', lessons: [
        L('cs320-l1', 'Processes, syscalls and context switching', 'What the kernel saves and why it costs.', 50, 'A', ['Trace fork/exec/wait'], 'Write a shell with pipes, redirection and job control.'),
        L('cs320-l2', 'Scheduling', 'FIFO, SJF, round robin, MLFQ, fairness vs latency.', 50, 'A', ['Compute turnaround and response time'], 'Simulate MLFQ and show starvation then fix it with priority boost.'),
        L('cs320-l3', 'Virtual memory and paging', 'Page tables, TLB, replacement, thrashing.', 60, 'A', ['Translate an address by hand', 'Explain a TLB miss cost'], 'Implement a page-replacement simulator (FIFO, LRU, clock, optimal).'),
      ]},
      { id: 'cs320-m2', title: 'Concurrency and persistence', lessons: [
        L('cs320-l4', 'Threads, locks and condition variables', 'Race conditions, deadlock, convoying.', 60, 'A', ['Identify a race from code', 'Order locks to avoid deadlock'], 'Implement a bounded buffer with condition variables and a lock-free counter.'),
        L('cs320-l5', 'File systems and crash consistency', 'Inodes, journalling, fsync semantics.', 55, 'B', ['Explain what survives a crash'], 'Implement a tiny log-structured key-value store with crash recovery.'),
      ]},
    ],
  },
  {
    id: 'cs330', code: 'CS330', title: 'Databases', year: 2, level: 'A', area: 'Data', credits: 3,
    description: 'Relational algebra, SQL, normalisation, indexing, transactions, query optimisation and distributed data.',
    prerequisites: ['cs201'],
    resources: [
      { label: 'CMU 15-445 Database Systems', url: 'https://15445.courses.cs.cmu.edu/' },
      { label: 'Database Internals concepts (Postgres docs)', url: 'https://www.postgresql.org/docs/current/index.html' },
    ],
    modules: [
      { id: 'cs330-m1', title: 'Model and access paths', lessons: [
        L('cs330-l1', 'Relational algebra and SQL semantics', 'Set semantics, joins, NULL logic, grouping.', 50, 'A', ['Translate SQL to algebra'], 'Write an in-memory relational algebra engine over CSV files.'),
        L('cs330-l2', 'Indexing and storage', 'B+ trees, clustering, selectivity, covering indexes.', 55, 'A', ['Predict when an index is ignored'], 'Implement a B+ tree with range scan.'),
        L('cs330-l3', 'Transactions and isolation', 'ACID, MVCC, anomalies, serialisability.', 55, 'B', ['Name the anomaly a level allows'], 'Reproduce write skew under repeatable read, then prevent it.'),
      ]},
    ],
  },
  {
    id: 'cs340', code: 'CS340', title: 'Computer Networks', year: 2, level: 'A', area: 'Systems', credits: 3,
    description: 'Layering, TCP/IP, routing, DNS, HTTP, sockets and network security fundamentals.',
    prerequisites: ['cs320'],
    resources: [
      { label: 'Computer Networks: A Systems Approach', url: 'https://book.systemsapproach.org/' },
      { label: 'RFC 9293 (TCP)', url: 'https://www.rfc-editor.org/rfc/rfc9293' },
    ],
    modules: [
      { id: 'cs340-m1', title: 'Transport and beyond', lessons: [
        L('cs340-l1', 'Reliable transport', 'Sliding windows, congestion control, RTT estimation.', 55, 'A', ['Explain AIMD behaviour'], 'Implement a reliable protocol over UDP with retransmission and windowing.'),
        L('cs340-l2', 'Routing and naming', 'Longest prefix match, BGP intuition, DNS resolution.', 50, 'A', ['Trace a DNS lookup end to end'], 'Write a recursive DNS resolver using raw queries.'),
        L('cs340-l3', 'HTTP, TLS and web security', 'Request lifecycle, certificates, common attacks.', 50, 'B', ['Explain what TLS actually authenticates'], 'Implement a minimal HTTP/1.1 server with keep-alive.'),
      ]},
    ],
  },
  {
    id: 'cs350', code: 'CS350', title: 'Software Engineering and System Design', year: 2, level: 'A', area: 'Engineering', credits: 3,
    description: 'Architecture, testing, CI/CD, code review, observability and designing systems under constraints.',
    prerequisites: ['cs201'],
    resources: [
      { label: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/' },
      { label: 'The Twelve-Factor App', url: 'https://12factor.net/' },
    ],
    modules: [
      { id: 'cs350-m1', title: 'Building systems that survive', lessons: [
        L('cs350-l1', 'Testing that finds real defects', 'Unit, property-based, integration, fuzzing.', 50, 'A', ['Write a property-based test', 'Distinguish coverage from confidence'], 'Property-test your AVL tree against a sorted-list reference model.'),
        L('cs350-l2', 'Architecture and boundaries', 'Coupling, interfaces, failure domains.', 50, 'B', ['Draw a failure domain diagram'], 'Refactor a monolithic script into testable modules with injected dependencies.'),
        L('cs350-l3', 'System design under constraints', 'Latency budgets, capacity estimation, tradeoffs.', 60, 'B', ['Do a back-of-envelope capacity estimate'], 'Design a URL shortener at 10k writes/sec; justify storage and cache choices.'),
      ]},
    ],
  },
  {
    id: 'cs401', code: 'CS401', title: 'Machine Learning', year: 3, level: 'B', area: 'AI/ML', credits: 4,
    description: 'Supervised and unsupervised learning, optimisation, generalisation and honest evaluation.',
    prerequisites: ['math110', 'cs301'],
    resources: [
      { label: 'Mathematics for Machine Learning', url: 'https://mml-book.github.io/' },
      { label: 'The Elements of Statistical Learning', url: 'https://hastie.su.domains/ElemStatLearn/' },
    ],
    modules: [
      { id: 'cs401-m1', title: 'Core learning theory and practice', lessons: [
        L('cs401-l1', 'Linear and logistic regression from scratch', 'Loss, gradients, regularisation, conditioning.', 60, 'B', ['Derive the gradient by hand'], 'Implement logistic regression with NumPy; match scikit-learn to 1e-4.'),
        L('cs401-l2', 'Bias, variance and evaluation', 'Cross-validation, leakage, metric choice.', 55, 'B', ['Detect leakage in a pipeline', 'Pick a metric for imbalanced data'], 'Build an experiment where a leaky split inflates accuracy by 10 points.'),
        L('cs401-l3', 'Trees, ensembles and clustering', 'Splitting criteria, bagging, boosting, k-means limits.', 55, 'B', ['Explain why boosting overfits differently'], 'Implement a decision tree and gradient boosting on stumps.'),
        L('cs401-l4', 'Optimisation for learning', 'SGD, momentum, Adam, learning-rate behaviour.', 55, 'B', ['Diagnose a divergent training curve'], 'Implement SGD, momentum and Adam; compare on an ill-conditioned quadratic.'),
      ]},
    ],
  },
  {
    id: 'cs410', code: 'CS410', title: 'Deep Learning', year: 3, level: 'B', area: 'AI/ML', credits: 4,
    description: 'Backpropagation, CNNs, sequence models, attention, transformers, generative models and representation learning.',
    prerequisites: ['cs401'],
    resources: [
      { label: 'Deep Learning Book (Goodfellow et al.)', url: 'https://www.deeplearningbook.org/' },
      { label: 'Stanford CS231n', url: 'https://cs231n.stanford.edu/' },
    ],
    modules: [
      { id: 'cs410-m1', title: 'From backprop to transformers', lessons: [
        L('cs410-l1', 'Autograd and backpropagation', 'Reverse-mode differentiation as a graph algorithm.', 65, 'B', ['Derive backprop for a two-layer net'], 'Write a 200-line autograd engine and train MNIST-scale data with it.'),
        L('cs410-l2', 'Convolutional networks', 'Receptive fields, normalisation, residual connections.', 55, 'B', ['Explain why residuals help optimisation'], 'Implement a small ResNet; ablate the skip connections.'),
        L('cs410-l3', 'Attention and transformers', 'Scaled dot-product attention, positional information, cost.', 65, 'B', ['Derive attention complexity in n and d'], 'Implement multi-head attention from scratch and verify against a reference.'),
        L('cs410-l4', 'Generative models', 'Autoregressive models, VAEs, diffusion intuition.', 60, 'B', ['Compare likelihood-based and score-based views'], 'Train a tiny diffusion model on 2-D toy data and visualise the reverse process.'),
      ]},
    ],
  },
  {
    id: 'cs450', code: 'CS450', title: 'Research Methodology and Reproduction', year: 4, level: 'C', area: 'Research', credits: 4,
    description: 'Reading papers, literature reviews, experimental design, ablations, statistics, reproduction and writing.',
    prerequisites: ['cs401'],
    resources: [
      { label: 'NeurIPS Reproducibility Checklist', url: 'https://neurips.cc/public/guides/PaperChecklist' },
      { label: 'How to Read a Paper (Keshav)', url: 'https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf' },
    ],
    modules: [
      { id: 'cs450-m1', title: 'Doing science', lessons: [
        L('cs450-l1', 'Reading a paper in three passes', 'Extracting claim, evidence and gap.', 45, 'C', ['Summarise a paper without its abstract'], 'Write a one-page critical summary of a paper with its weakest claim identified.'),
        L('cs450-l2', 'Experimental design and ablations', 'Controls, confounds, seeds, compute-matched comparison.', 60, 'C', ['Design an ablation that isolates one factor'], 'Reproduce a small published result and run one ablation.'),
        L('cs450-l3', 'Statistics for honest claims', 'Variance across seeds, confidence intervals, significance misuse.', 55, 'C', ['Report a result with uncertainty'], 'Re-run an experiment across 10 seeds and report intervals, not a single number.'),
        L('cs450-l4', 'Writing and peer review', 'Claim structure, related work, reviewer expectations.', 55, 'C', ['Review a paper against explicit criteria'], 'Write a full referee report on a paper you have reproduced.'),
      ]},
    ],
  },
  {
    id: 'cs460', code: 'CS460', title: 'Distributed and Parallel Systems', year: 4, level: 'B', area: 'Systems', credits: 4,
    description: 'Consistency, consensus, replication, parallelism, GPUs and the economics of scale.',
    prerequisites: ['cs320', 'cs340'],
    resources: [
      { label: 'MIT 6.5840 Distributed Systems', url: 'https://pdos.csail.mit.edu/6.824/' },
      { label: 'Raft paper', url: 'https://raft.github.io/raft.pdf' },
    ],
    modules: [
      { id: 'cs460-m1', title: 'Agreement and scale', lessons: [
        L('cs460-l1', 'Time, order and consistency models', 'Linearisability, causality, eventual consistency.', 60, 'B', ['Classify an anomaly by consistency model'], 'Implement vector clocks and detect concurrent updates.'),
        L('cs460-l2', 'Consensus', 'Replicated logs, leader election, safety vs liveness.', 70, 'B', ['Explain why a majority quorum is needed'], 'Implement Raft leader election and log replication for 3 nodes.', 'Argue why two leaders cannot both commit in the same term.'),
        L('cs460-l3', 'Parallelism and accelerators', 'Data vs task parallelism, memory bandwidth, GPU execution model.', 60, 'B', ['Compute arithmetic intensity'], 'Write a tiled matrix multiply and measure against a BLAS baseline.'),
      ]},
    ],
  },
]

export const tracks = [
  { id: 'aiml', title: 'AI / Machine Learning', courses: ['cs401', 'cs410', 'cs450'] },
  { id: 'systems', title: 'Computer Systems', courses: ['cs320', 'cs340', 'cs460'] },
  { id: 'arch', title: 'Computer Architecture and Semiconductors', courses: ['cs210', 'cs460'] },
  { id: 'theory', title: 'Theoretical Computer Science', courses: ['math110', 'cs301'] },
  { id: 'distsys', title: 'Distributed Systems', courses: ['cs460', 'cs330'] },
  { id: 'research', title: 'Research Track', courses: ['cs450', 'cs410'] },
]

export const courseById = (id: string) => courses.find(c => c.id === id)
export const allLessons = courses.flatMap(c => c.modules.flatMap(m => m.lessons.map(l => ({ ...l, courseId: c.id, courseCode: c.code, module: m.title }))))
export type FlatLesson = ReturnType<typeof allLessons.slice>[number]
