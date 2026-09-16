// SEEDED DEMONSTRATION DATA.
// Every item links to a primary source. Nothing here is a live feed: the app labels
// all of it as seeded so it is never confused with retrieved, dated evidence.

export type Action = 'IGNORE' | 'SKIM' | 'READ' | 'STUDY' | 'BUILD'
export type Reliability = 'Primary source' | 'Official technical report' | 'Peer-reviewed' | 'Reputable journalism'

export type NewsItem = {
  id: string
  title: string
  category: string
  happened: string
  significance: string
  whyMatters: string
  who: string
  changed: string
  learn: string
  paper?: string
  engineering: string
  source: { label: string; url: string; reliability: Reliability }
  importance: 1 | 2 | 3 | 4 | 5
  action: Action
  curriculum: { courseId: string; lessonId: string; label: string }[]
}

export const news: NewsItem[] = [
  {
    id: 'n1', title: 'Attention-based architectures remain the substrate of frontier models', category: 'Research',
    happened: 'The transformer architecture published in 2017 is still the backbone of essentially every frontier language, vision and multimodal model shipped since.',
    significance: 'Architecture research has moved from replacing attention to making it cheaper: tiling, KV-cache compression, sparsity and hardware co-design.',
    whyMatters: 'Your study time compounds if you learn attention deeply rather than chasing architecture novelty.',
    who: 'Google Brain (original authors); the entire model-training ecosystem since.',
    changed: 'The bottleneck moved from modelling capacity to memory bandwidth and serving cost.',
    learn: 'Scaled dot-product attention, KV cache mechanics, arithmetic intensity.',
    paper: 'transformer',
    engineering: 'Serving cost is dominated by memory movement — profile bandwidth before adding FLOPs.',
    source: { label: 'Attention Is All You Need (arXiv:1706.03762)', url: 'https://arxiv.org/abs/1706.03762', reliability: 'Peer-reviewed' },
    importance: 5, action: 'STUDY',
    curriculum: [{ courseId: 'cs410', lessonId: 'cs410-l1', label: 'Deep Learning: attention and transformers' }],
  },
  {
    id: 'n2', title: 'IO-aware kernels became the standard way to speed up attention', category: 'Systems',
    happened: 'FlashAttention showed exact attention could be made several times faster by tiling to avoid HBM traffic, and the technique is now standard in training stacks.',
    significance: 'Confirms that many ML workloads are bandwidth bound, so asymptotic FLOP reductions can lose to memory-aware exact algorithms.',
    whyMatters: 'It is the clearest modern example of computer architecture knowledge beating algorithmic cleverness.',
    who: 'Stanford (Dao et al.) and subsequently every major training framework.',
    changed: 'Long-context training became affordable.',
    learn: 'GPU memory hierarchy, tiling, online softmax, roofline analysis.',
    paper: 'flashattention',
    engineering: 'Measure HBM traffic, not just FLOPs, before optimising a kernel.',
    source: { label: 'FlashAttention (arXiv:2205.14135)', url: 'https://arxiv.org/abs/2205.14135', reliability: 'Peer-reviewed' },
    importance: 5, action: 'BUILD',
    curriculum: [{ courseId: 'cs460', lessonId: 'cs460-l3', label: 'Parallelism and accelerators' }],
  },
  {
    id: 'n3', title: 'Reasoning-style prompting and post-training reshaped evaluation practice', category: 'AI',
    happened: 'Chain-of-thought prompting demonstrated large multi-step reasoning gains at scale, and evaluation moved toward reasoning benchmarks with reported variance.',
    significance: 'Highlighted that benchmark numbers depend heavily on prompt, decoding and extraction choices.',
    whyMatters: 'You cannot judge model claims without knowing the evaluation protocol.',
    who: 'Google Research; subsequently the whole evaluation community.',
    changed: 'Prompt and decoding configuration became part of a reported result.',
    learn: 'Evaluation methodology, variance reporting, faithfulness of stated reasoning.',
    paper: 'cot',
    engineering: 'Pin prompts, seeds and decoding settings in any evaluation harness you build.',
    source: { label: 'Chain-of-Thought Prompting (arXiv:2201.11903)', url: 'https://arxiv.org/abs/2201.11903', reliability: 'Peer-reviewed' },
    importance: 4, action: 'READ',
    curriculum: [{ courseId: 'cs450', lessonId: 'cs450-l1', label: 'Research Methodology: reading critically' }],
  },
  {
    id: 'n4', title: 'Consensus algorithms still gate every serious distributed product', category: 'Systems',
    happened: 'Raft remains the practical basis for replicated logs in databases, coordination services and control planes.',
    significance: 'Distributed correctness is a small set of deep ideas — quorums, terms, log matching — not an endless catalogue.',
    whyMatters: 'Implementing Raft once is worth ten distributed-systems blog posts.',
    who: 'Stanford (Ongaro, Ousterhout); adopted widely in industry infrastructure.',
    changed: 'Consensus became teachable and implementable outside research labs.',
    learn: 'Quorum intersection, leader election, log replication safety.',
    paper: 'raft',
    engineering: 'Test distributed code by asserting safety invariants under injected partitions.',
    source: { label: 'Raft paper (USENIX ATC 2014)', url: 'https://raft.github.io/raft.pdf', reliability: 'Peer-reviewed' },
    importance: 4, action: 'BUILD',
    curriculum: [{ courseId: 'cs460', lessonId: 'cs460-l2', label: 'Consensus' }],
  },
  {
    id: 'n5', title: 'Diffusion models set the template for modern generative media', category: 'Machine Learning',
    happened: 'Denoising diffusion probabilistic models reached competitive image quality with a simple noise-prediction objective, and the family now underpins image, audio and video generation.',
    significance: 'A principled objective plus a pragmatic simplification beat adversarial training on stability.',
    whyMatters: 'It shows how to read a paper where the working loss deviates from the derived bound.',
    who: 'UC Berkeley (Ho, Jain, Abbeel).',
    changed: 'Generative modelling shifted from GANs to iterative denoising.',
    learn: 'ELBO decomposition, reparameterisation, sampling-step trade-offs.',
    paper: 'ddpm',
    engineering: 'Inference cost scales with sampling steps — treat step count as a product decision.',
    source: { label: 'Denoising Diffusion Probabilistic Models (arXiv:2006.11239)', url: 'https://arxiv.org/abs/2006.11239', reliability: 'Peer-reviewed' },
    importance: 4, action: 'READ',
    curriculum: [{ courseId: 'cs410', lessonId: 'cs410-l1', label: 'Deep Learning foundations' }],
  },
]

export const briefing = {
  study: 'Scaled dot-product attention, derived by hand including the sqrt(d_k) scaling.',
  read: 'FlashAttention, Section 3 (the algorithm and its IO analysis).',
  revise: 'Amortized analysis — the accounting method on dynamic array growth.',
  build: 'A tiled matrix multiply, benchmarked against a library BLAS call.',
}

export type RadarStatus = 'Emerging' | 'Growing' | 'Mature' | 'Declining' | 'Research-only'
export type RadarItem = { id: string; name: string; domain: string; status: RadarStatus; why: string; source: { label: string; url: string } }

export const radar: RadarItem[] = [
  { id: 'r1', name: 'Attention/transformer architectures', domain: 'AI', status: 'Mature', why: 'Nine years of continuous production use across every modality; research has shifted to efficiency rather than replacement.', source: { label: 'arXiv:1706.03762', url: 'https://arxiv.org/abs/1706.03762' } },
  { id: 'r2', name: 'IO-aware GPU kernels', domain: 'AI infrastructure', status: 'Growing', why: 'Adopted into mainstream training frameworks after demonstrating wall-clock wins on exact attention.', source: { label: 'arXiv:2205.14135', url: 'https://arxiv.org/abs/2205.14135' } },
  { id: 'r3', name: 'Diffusion generative models', domain: 'AI', status: 'Growing', why: 'Broad deployment in image/audio/video generation; active work on reducing sampling steps.', source: { label: 'arXiv:2006.11239', url: 'https://arxiv.org/abs/2006.11239' } },
  { id: 'r4', name: 'Raft-based replication', domain: 'Distributed systems', status: 'Mature', why: 'Standard building block for replicated logs in production infrastructure since 2014.', source: { label: 'raft.github.io', url: 'https://raft.github.io/' } },
  { id: 'r5', name: 'RISC-V', domain: 'Semiconductors', status: 'Growing', why: 'Open ISA with a ratified specification and growing commercial silicon; still trailing incumbents in software ecosystem depth.', source: { label: 'RISC-V specifications', url: 'https://riscv.org/technical/specifications/' } },
  { id: 'r6', name: 'Formal verification of systems code', domain: 'Theory in practice', status: 'Research-only', why: 'Demonstrated on kernels and compilers (seL4, CompCert) but engineering cost keeps it out of mainstream practice.', source: { label: 'seL4 project', url: 'https://sel4.systems/' } },
  { id: 'r7', name: 'Post-quantum cryptography', domain: 'Cybersecurity', status: 'Growing', why: 'NIST has standardised initial algorithms, so migration work is now an engineering programme rather than research.', source: { label: 'NIST PQC project', url: 'https://csrc.nist.gov/projects/post-quantum-cryptography' } },
  { id: 'r8', name: 'Fault-tolerant quantum computing', domain: 'Quantum', status: 'Research-only', why: 'Error-corrected logical qubits remain far below the counts needed for the advertised applications.', source: { label: 'Quantum Error Correction (Nielsen & Chuang, ch. 10)', url: 'https://en.wikipedia.org/wiki/Quantum_error_correction' } },
]

export type Repo = { id: string; name: string; url: string; purpose: string; language: string; architecture: string; contribute: string; relatedLesson: string }

export const repos: Repo[] = [
  { id: 'o1', name: 'pytorch/pytorch', url: 'https://github.com/pytorch/pytorch', purpose: 'Tensor library and autograd engine used for most deep learning research.', language: 'C++/Python', architecture: 'Python front end over an ATen tensor library, dispatcher, autograd graph and backend kernels.', contribute: 'Start with documentation and small op-level tests; read the dispatcher before touching kernels.', relatedLesson: 'cs410-l1' },
  { id: 'o2', name: 'torvalds/linux', url: 'https://github.com/torvalds/linux', purpose: 'The kernel you should read while studying operating systems.', language: 'C', architecture: 'Monolithic kernel with loadable modules; scheduler, mm, vfs and drivers as subsystems.', contribute: 'Read Documentation/process/submitting-patches.rst; start with coding-style and static-analysis fixes in staging.', relatedLesson: 'cs320-l1' },
  { id: 'o3', name: 'mit-pdos/xv6-riscv', url: 'https://github.com/mit-pdos/xv6-riscv', purpose: 'Teaching operating system used by MIT 6.1810 — small enough to read entirely.', language: 'C', architecture: 'Unix-like kernel for RISC-V: trap handling, paging, file system, ~10k lines.', contribute: 'Not a contribution target — a reading and lab target. Implement the OSTEP labs against it.', relatedLesson: 'cs320-l1' },
  { id: 'o4', name: 'etcd-io/etcd', url: 'https://github.com/etcd-io/etcd', purpose: 'Distributed key-value store with a production Raft implementation.', language: 'Go', architecture: 'raft package (pure state machine) beneath an MVCC store and gRPC API.', contribute: 'Read the raft package as the reference implementation after writing your own; good-first-issue labels exist.', relatedLesson: 'cs460-l2' },
  { id: 'o5', name: 'sqlite/sqlite', url: 'https://github.com/sqlite/sqlite', purpose: 'The most-deployed database engine; exemplary testing culture.', language: 'C', architecture: 'Tokenizer, parser, bytecode VM, B-tree layer, pager, OS interface.', contribute: 'Contributions are tightly controlled; study the test suite and the file format documentation instead.', relatedLesson: 'cs330-l1' },
]
