export type Difficulty = 'Undergraduate' | 'Advanced Undergraduate' | 'Graduate' | 'Research'
export type Paper = {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  category: string
  url: string
  arxiv?: string
  doi?: string
  difficulty: Difficulty
  prerequisites: string[]
  prereqLessons: string[]
  thirtySeconds: string
  fiveMinutes: string
  deep: string
  before: string
  contribution: string
  math: string
  setup: string
  results: string
  limitations: string
  questions: string[]
  implement: string
  opportunities: string[]
  reproduce: { dataset: string; baseline: string; steps: string[]; originalResult: string }
  related: string[]
  bibtex: string
}

export const paperCategories = ['AI', 'Machine Learning', 'Robotics', 'Computer Vision', 'NLP', 'Systems', 'Architecture', 'Security', 'Algorithms', 'Theory', 'HCI', 'Scientific Computing', 'Semiconductors']

export const papers: Paper[] = [
  {
    id: 'transformer', title: 'Attention Is All You Need',
    authors: 'Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin',
    venue: 'NeurIPS', year: 2017, category: 'NLP', url: 'https://arxiv.org/abs/1706.03762', arxiv: '1706.03762',
    difficulty: 'Graduate',
    prerequisites: ['Linear algebra: matrix products, softmax', 'Backpropagation', 'Sequence models (RNN/LSTM)'],
    prereqLessons: ['cs410-l1', 'cs401-l1'],
    thirtySeconds: 'Replaces recurrence and convolution with self-attention alone, giving a fully parallel sequence model that trains faster and translates better.',
    fiveMinutes: 'Encoder-decoder stacks of multi-head scaled dot-product attention plus position-wise feed-forward layers, residual connections and layer normalisation. Position is injected with sinusoidal encodings because attention is permutation-invariant. Multi-head attention lets different heads attend to different relations in parallel subspaces.',
    deep: 'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V. The 1/sqrt(d_k) scaling keeps dot products out of the saturated region of softmax as dimension grows. Multi-head projects into h subspaces of dimension d_k = d_model/h, attends independently, concatenates and projects back — same parameter budget, more relational capacity. Self-attention has O(n^2 d) time and O(1) sequential steps, versus O(n d^2) time and O(n) sequential steps for recurrence: the paper trades total FLOPs for parallelism and path length between any two tokens, which is what makes long-range dependency learning tractable.',
    before: 'State of the art in machine translation was deep LSTM or GRU encoder-decoders with attention bolted on, plus convolutional alternatives (ByteNet, ConvS2S). All were sequentially bottlenecked in the sequence length.',
    contribution: 'A pure-attention architecture, multi-head scaled dot-product attention, and the demonstration that removing recurrence improves both quality and training cost.',
    math: 'Softmax over scaled inner products is a differentiable, content-based lookup: keys index memory, queries probe it, values are the retrieved payload. Positional encodings use sin/cos at geometric frequencies so relative offsets are expressible as linear functions of the encoding.',
    setup: 'WMT 2014 English-German (4.5M sentence pairs) and English-French (36M), byte-pair encoding, 8 P100 GPUs, Adam with warmup, label smoothing 0.1, beam search width 4.',
    results: '28.4 BLEU EN-DE and 41.8 BLEU EN-FR, exceeding prior best ensembles while training in a fraction of the compute.',
    limitations: 'Quadratic cost in sequence length; evaluated on translation only; no analysis of very long contexts; sinusoidal positions were later shown to extrapolate poorly.',
    questions: ['Why is attention quadratic and what would sub-quadratic require?', 'What breaks if you remove the sqrt(d_k) scaling?', 'Why does the decoder need masking and what would leak without it?'],
    implement: 'Implement scaled dot-product attention and multi-head attention from scratch in NumPy, then verify your output matches a framework implementation to 1e-5.',
    opportunities: ['Measure how head redundancy grows with model width', 'Compare positional schemes on length extrapolation under a fixed compute budget'],
    reproduce: { dataset: 'Multi30k EN-DE (small enough for one GPU)', baseline: 'A 2-layer LSTM encoder-decoder with attention', steps: ['Tokenise with BPE and build vocabularies', 'Train the LSTM baseline to convergence', 'Implement a 2-layer transformer with the same parameter count', 'Compare BLEU across 3 seeds and report intervals', 'Ablate multi-head down to single-head'], originalResult: '28.4 BLEU on WMT14 EN-DE (not comparable to Multi30k; compare relative to your own baseline only)' },
    related: ['bert', 'flashattention'],
    bibtex: '@inproceedings{vaswani2017attention,title={Attention Is All You Need},author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, Lukasz and Polosukhin, Illia},booktitle={Advances in Neural Information Processing Systems},year={2017}}',
  },
  {
    id: 'resnet', title: 'Deep Residual Learning for Image Recognition',
    authors: 'He, Zhang, Ren, Sun', venue: 'CVPR', year: 2016, category: 'Computer Vision',
    url: 'https://arxiv.org/abs/1512.03385', arxiv: '1512.03385', doi: '10.1109/CVPR.2016.90',
    difficulty: 'Advanced Undergraduate',
    prerequisites: ['Convolutions', 'Backpropagation and gradient flow', 'Batch normalisation'],
    prereqLessons: ['cs410-l1'],
    thirtySeconds: 'Adding identity skip connections lets networks hundreds of layers deep actually train, because each block only needs to learn a residual.',
    fiveMinutes: 'Plain deep networks degraded with depth — worse training error, not overfitting. Residual blocks compute F(x)+x, so the identity is free and gradients have a short path to early layers. This enabled 152-layer networks that won ILSVRC 2015.',
    deep: 'If the optimal mapping is close to identity, learning F(x)=H(x)-x is better conditioned than learning H(x) directly. The skip path makes the Jacobian of a block I + dF/dx, keeping the product of Jacobians over many layers near unity and preventing vanishing signal. Bottleneck blocks (1x1, 3x3, 1x1) keep FLOPs manageable at depth.',
    before: 'VGG and Inception pushed depth to 16-22 layers; deeper plain stacks got worse even on training data — an optimisation failure, not a capacity failure.',
    contribution: 'The residual block, evidence that the degradation problem is optimisation-related, and a family of architectures still used as backbones today.',
    math: 'Gradient of a residual stack telescopes: dL/dx_l = dL/dx_L * prod(I + dF_i/dx). Additive identity terms keep the product from collapsing to zero.',
    setup: 'ImageNet ILSVRC 2012 (1.28M images), SGD momentum 0.9, batch 256, weight decay 1e-4, standard augmentation; also CIFAR-10 with up to 1202 layers.',
    results: '3.57% top-5 error on ImageNet test with an ensemble; 1st place ILSVRC 2015 classification, detection and localisation.',
    limitations: 'Very deep variants give diminishing returns; batch normalisation dependence couples results to batch size; no theory of when residuals are necessary.',
    questions: ['Is the benefit from gradient flow, from ensembling shallow paths, or both?', 'What happens if the skip is scaled by 0.5?'],
    implement: 'Implement a ResNet-20 for CIFAR-10 from scratch and train the identical network with skips removed; plot both training curves.',
    opportunities: ['Quantify degradation onset depth as a function of normalisation choice'],
    reproduce: { dataset: 'CIFAR-10', baseline: 'Plain 20-layer CNN without skips', steps: ['Build ResNet-20 and Plain-20 with matched parameters', 'Train both for 100 epochs, 3 seeds', 'Report final train and test error with intervals', 'Ablate: remove BN, then scale the skip'], originalResult: '8.75% test error for ResNet-20 on CIFAR-10' },
    related: ['adam'],
    bibtex: '@inproceedings{he2016deep,title={Deep Residual Learning for Image Recognition},author={He, Kaiming and Zhang, Xiangyu and Ren, Shaoqing and Sun, Jian},booktitle={CVPR},year={2016}}',
  },
  {
    id: 'adam', title: 'Adam: A Method for Stochastic Optimization',
    authors: 'Kingma, Ba', venue: 'ICLR', year: 2015, category: 'Machine Learning',
    url: 'https://arxiv.org/abs/1412.6980', arxiv: '1412.6980',
    difficulty: 'Advanced Undergraduate',
    prerequisites: ['Gradient descent', 'Exponential moving averages', 'Basic convex optimisation'],
    prereqLessons: ['cs401-l1'],
    thirtySeconds: 'Per-parameter adaptive step sizes from bias-corrected first and second gradient moments; robust defaults made it the field default optimiser.',
    fiveMinutes: 'Adam maintains m_t (mean) and v_t (uncentred variance) of gradients as EMAs, corrects their initialisation bias, and steps by m_hat / (sqrt(v_hat)+eps). This normalises the step by recent gradient scale, so badly scaled or sparse coordinates still move.',
    deep: 'm_t = b1 m_{t-1} + (1-b1) g_t; v_t = b2 v_{t-1} + (1-b2) g_t^2; m_hat = m_t/(1-b1^t); v_hat = v_t/(1-b2^t); theta -= a * m_hat/(sqrt(v_hat)+eps). The bias correction matters because EMAs start at zero, which otherwise makes early steps far too small. The effective step is bounded roughly by the learning rate, giving scale invariance to gradient rescaling.',
    before: 'SGD with momentum needed careful per-problem tuning; AdaGrad decayed learning rates monotonically to zero; RMSProp fixed decay but lacked bias correction and momentum together.',
    contribution: 'The algorithm, bias correction analysis, a regret bound in the convex setting, and empirical robustness across architectures.',
    math: 'The convergence proof assumes convexity and bounded gradients; the original regret analysis was later corrected (AMSGrad), a good example of a published proof with a gap.',
    setup: 'Logistic regression on MNIST/IMDB, MLPs, and CNNs on CIFAR-10, compared against SGD-Nesterov, AdaGrad and RMSProp.',
    results: 'Faster convergence in training cost across tasks with default b1=0.9, b2=0.999, eps=1e-8.',
    limitations: 'Can generalise worse than tuned SGD on vision; original convergence proof was flawed; sensitive to eps placement and weight decay coupling (fixed by AdamW).',
    questions: ['Why does decoupled weight decay behave differently from L2 added to the loss?', 'When does the second-moment normalisation hurt?'],
    implement: 'Implement Adam in ~20 lines of NumPy and reproduce the classic non-convergence counterexample that motivated AMSGrad.',
    opportunities: ['Compare Adam and SGD generalisation gap under matched training loss, not matched epochs'],
    reproduce: { dataset: 'MNIST', baseline: 'SGD with momentum, tuned learning rate', steps: ['Train the same MLP with SGD-momentum, Adam and AdamW', 'Sweep learning rates over a decade for each', 'Plot best training loss vs step and test accuracy', 'Report seed variance'], originalResult: 'Adam reaches lower training cost per iteration than AdaGrad/RMSProp/SGD on MNIST logistic regression' },
    related: ['resnet'],
    bibtex: '@inproceedings{kingma2015adam,title={Adam: A Method for Stochastic Optimization},author={Kingma, Diederik P and Ba, Jimmy},booktitle={ICLR},year={2015}}',
  },
  {
    id: 'bert', title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Devlin, Chang, Lee, Toutanova', venue: 'NAACL', year: 2019, category: 'NLP',
    url: 'https://arxiv.org/abs/1810.04805', arxiv: '1810.04805',
    difficulty: 'Graduate',
    prerequisites: ['Transformer architecture', 'Language modelling objectives', 'Transfer learning'],
    prereqLessons: ['cs410-l1'],
    thirtySeconds: 'Masked language modelling lets a transformer encoder condition on both directions, and fine-tuning that single pre-trained encoder beats task-specific architectures.',
    fiveMinutes: 'Pre-train on unlabeled text with two objectives — masked token prediction (15% of tokens) and next-sentence prediction — then fine-tune the whole model with one added output layer per task. This replaced feature-based transfer (ELMo) with full-model fine-tuning.',
    deep: 'Left-to-right LMs cannot see future context; naive bidirectionality leaks the target. Masking solves this by making the target invisible in the input, at the cost of a pre-train/fine-tune mismatch (masks never appear downstream), partially mitigated by the 80/10/10 replacement scheme. Only ~15% of tokens contribute loss per step, so MLM is less sample-efficient per token than causal LM — a trade later work revisits.',
    before: 'ELMo produced frozen contextual features; GPT-1 fine-tuned a unidirectional decoder. Both underused bidirectional context.',
    contribution: 'MLM pre-training at scale, fine-tuning as the default transfer recipe, and large gains across 11 NLP benchmarks.',
    math: 'Objective is the expected cross-entropy over masked positions under a random masking distribution — a denoising autoencoder over discrete tokens.',
    setup: 'BooksCorpus + English Wikipedia (3.3B words), BERT-base 110M and BERT-large 340M parameters, evaluated on GLUE, SQuAD 1.1/2.0, SWAG.',
    results: 'GLUE 80.5 (7.7 point absolute gain), SQuAD 1.1 F1 93.2, SWAG accuracy 86.3.',
    limitations: 'NSP was later shown largely unhelpful (RoBERTa); masking mismatch; English-only evaluation; compute cost not accessible to most labs at the time.',
    questions: ['Is bidirectionality or scale responsible for the gains?', 'Why did NSP fail to help?'],
    implement: 'Implement masked language modelling on a 5MB text corpus with a 4-layer encoder; measure how masking rate changes convergence.',
    opportunities: ['Sweep masking rate against compute at fixed data budget'],
    reproduce: { dataset: 'WikiText-2', baseline: 'Causal LM of identical size', steps: ['Train a small MLM and a small causal LM at matched compute', 'Fine-tune both on SST-2', 'Compare accuracy across 3 seeds', 'Ablate NSP'], originalResult: 'GLUE average 80.5 for BERT-large (your small-scale numbers are not comparable)' },
    related: ['transformer', 'cot'],
    bibtex: '@inproceedings{devlin2019bert,title={BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding},author={Devlin, Jacob and Chang, Ming-Wei and Lee, Kenton and Toutanova, Kristina},booktitle={NAACL},year={2019}}',
  },
  {
    id: 'flashattention', title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: 'Dao, Fu, Ermon, Rudra, Ré', venue: 'NeurIPS', year: 2022, category: 'Systems',
    url: 'https://arxiv.org/abs/2205.14135', arxiv: '2205.14135',
    difficulty: 'Research',
    prerequisites: ['GPU memory hierarchy (HBM vs SRAM)', 'Attention mechanism', 'Tiling and kernel fusion'],
    prereqLessons: ['cs460-l3', 'cs210-l1'],
    thirtySeconds: 'Attention is memory-bandwidth bound, not compute bound; tiling it to avoid writing the N×N matrix to HBM makes it several times faster with exact results.',
    fiveMinutes: 'Standard attention materialises the full attention matrix in HBM. FlashAttention tiles Q, K, V into SRAM-sized blocks, computes softmax online with running max and sum, and recomputes the matrix during the backward pass instead of storing it — trading FLOPs for memory traffic.',
    deep: 'The online softmax rescaling identity lets partial block results be merged without ever holding a full row: keep running m (max) and l (sum), rescale accumulated output when m increases. IO complexity drops from O(N^2 + Nd) HBM accesses to O(N^2 d^2 / M) where M is SRAM size. Recomputation in the backward pass increases FLOPs but reduces wall-clock time because the kernel was bandwidth-bound — the central lesson of the paper.',
    before: 'Approximate attention (Linformer, Performer, sparse patterns) reduced asymptotic FLOPs but often failed to beat exact attention in wall-clock time because the bottleneck was memory movement.',
    contribution: 'An IO-aware exact attention algorithm, an IO complexity analysis, and 2-4x end-to-end speedups enabling longer context training.',
    math: 'Numerically stable streaming softmax: softmax over a concatenation can be computed from per-block max and sum with a rescale factor exp(m_old - m_new).',
    setup: 'BERT-large and GPT-2 training on A100 GPUs; long-range arena; comparisons against PyTorch attention and approximate baselines.',
    results: '3x speedup on GPT-2 training, 15% end-to-end BERT-large speedup over MLPerf 1.1, sequence lengths up to 64K enabled.',
    limitations: 'Hardware-specific tuning; requires custom CUDA; benefits depend on head dimension and SRAM size; no gain for very small sequences.',
    questions: ['Why can adding FLOPs reduce runtime?', 'How would the analysis change on hardware with larger on-chip memory?'],
    implement: 'Implement online (streaming) softmax and verify it matches a naive softmax to 1e-6 on random blocks; then write a tiled attention in plain Python and count memory reads.',
    opportunities: ['Model the crossover sequence length where tiling starts to win for a given SRAM size'],
    reproduce: { dataset: 'Random tensors at several sequence lengths', baseline: 'Naive PyTorch attention', steps: ['Implement tiled attention with online softmax', 'Verify exactness against the baseline', 'Measure peak memory and runtime across N = 512..16384', 'Plot the crossover point'], originalResult: 'Up to 3x wall-clock speedup and 10-20x memory reduction at long sequence lengths' },
    related: ['transformer'],
    bibtex: '@inproceedings{dao2022flashattention,title={FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness},author={Dao, Tri and Fu, Daniel Y and Ermon, Stefano and Rudra, Atri and R{\\\'e}, Christopher},booktitle={NeurIPS},year={2022}}',
  },
  {
    id: 'raft', title: 'In Search of an Understandable Consensus Algorithm (Raft)',
    authors: 'Ongaro, Ousterhout', venue: 'USENIX ATC', year: 2014, category: 'Systems',
    url: 'https://raft.github.io/raft.pdf',
    difficulty: 'Graduate',
    prerequisites: ['Replicated state machines', 'Failure models and quorums', 'Logical time'],
    prereqLessons: ['cs460-l1', 'cs460-l2'],
    thirtySeconds: 'A consensus algorithm designed for understandability: strong leadership, terms, and log matching give Paxos-equivalent safety with a teachable structure.',
    fiveMinutes: 'Raft decomposes consensus into leader election, log replication and safety. Time is divided into terms with at most one leader each; the leader appends entries and commits once a majority has them; election restriction guarantees a new leader holds all committed entries.',
    deep: 'The Log Matching Property (if two logs contain an entry with the same index and term, all preceding entries are identical) is maintained by the AppendEntries consistency check. The Leader Completeness Property follows from the election restriction: a candidate cannot win without an up-to-date log, so committed entries survive leader changes. Safety proof rests on the quorum intersection argument — any two majorities share a member.',
    before: 'Paxos was the reference algorithm but notoriously hard to teach and to implement correctly; production systems used undocumented variants.',
    contribution: 'Raft itself, a proven safety argument, membership change and log compaction mechanisms, and a user study on understandability.',
    math: 'Quorum intersection: two subsets of size > n/2 of an n-set must intersect, so conflicting commits in the same term are impossible.',
    setup: 'A 43-student user study comparing Raft and Paxos comprehension; latency measurements of leader election on a 5-node cluster.',
    results: 'Students scored higher on Raft; election typically completes well under a second with randomised timeouts.',
    limitations: 'Strong leader is a throughput bottleneck; assumes non-Byzantine failures; performance under partition and reconfiguration needs care.',
    questions: ['Why must a leader not commit an entry from a previous term by counting replicas alone?', 'What breaks with fixed rather than randomised election timeouts?'],
    implement: 'Implement leader election with randomised timeouts for 3 simulated nodes, inject partitions and assert no two leaders in one term.',
    opportunities: ['Measure election latency distribution against timeout range under lossy links'],
    reproduce: { dataset: 'Simulated 3 and 5 node clusters', baseline: 'Single-node log (no replication)', steps: ['Implement terms, election and AppendEntries', 'Add a fault injector for drops and partitions', 'Assert the five Raft safety properties as test invariants', 'Measure election time vs timeout range'], originalResult: 'Median election time under ~300ms for 150-300ms randomised timeouts' },
    related: ['flashattention'],
    bibtex: '@inproceedings{ongaro2014raft,title={In Search of an Understandable Consensus Algorithm},author={Ongaro, Diego and Ousterhout, John},booktitle={USENIX Annual Technical Conference},year={2014}}',
  },
  {
    id: 'ddpm', title: 'Denoising Diffusion Probabilistic Models',
    authors: 'Ho, Jain, Abbeel', venue: 'NeurIPS', year: 2020, category: 'Machine Learning',
    url: 'https://arxiv.org/abs/2006.11239', arxiv: '2006.11239',
    difficulty: 'Research',
    prerequisites: ['Variational inference and the ELBO', 'Gaussian processes of noise', 'Score matching intuition'],
    prereqLessons: ['cs401-l1', 'cs410-l1'],
    thirtySeconds: 'Learn to reverse a fixed Gaussian noising process; a simplified noise-prediction loss makes diffusion models competitive image generators.',
    fiveMinutes: 'A forward process gradually adds Gaussian noise over T steps until data becomes noise. A network learns the reverse transitions. The key practical result is that the variational bound simplifies to predicting the added noise with an MSE loss, which trains stably.',
    deep: 'q(x_t|x_0) = N(sqrt(a_bar_t) x_0, (1-a_bar_t) I) allows sampling any timestep directly. The ELBO decomposes into per-step KL terms between Gaussians, each with closed form. Reparameterising the mean in terms of predicted noise eps_theta yields L_simple = E||eps - eps_theta(x_t,t)||^2, an unweighted variant of the bound that empirically works better than the exact weighting — a case where deviating from the principled objective helps.',
    before: 'GANs led image quality but trained unstably with mode collapse; VAEs were stable but blurry; earlier diffusion work had not reached competitive sample quality.',
    contribution: 'The simplified training objective, the connection to score matching and Langevin dynamics, and high-quality unconditional samples.',
    math: 'Gaussian KL closed forms plus the reparameterisation trick; the reverse process variance can be fixed rather than learned.',
    setup: 'CIFAR-10 and LSUN, U-Net backbone with time embeddings, T=1000, linear beta schedule.',
    results: 'CIFAR-10 unconditional FID 3.17 and Inception score 9.46, state of the art at publication.',
    limitations: 'Sampling requires hundreds to thousands of network evaluations; log-likelihoods are not competitive; no conditioning mechanism in this paper.',
    questions: ['Why does the simplified loss beat the exact ELBO weighting?', 'What determines the minimum number of sampling steps?'],
    implement: 'Train a small DDPM on MNIST with T=200 and plot sample quality against number of reverse steps.',
    opportunities: ['Quantify the quality/step trade-off curve for different beta schedules at fixed compute'],
    reproduce: { dataset: 'MNIST or CIFAR-10', baseline: 'A convolutional VAE of similar size', steps: ['Implement the forward noising and closed-form q(x_t|x_0)', 'Train eps-prediction U-Net', 'Sample with 1000, 200 and 50 steps', 'Compare FID against the VAE baseline'], originalResult: 'FID 3.17 on CIFAR-10 with a much larger model than a small reproduction' },
    related: ['adam', 'resnet'],
    bibtex: '@inproceedings{ho2020denoising,title={Denoising Diffusion Probabilistic Models},author={Ho, Jonathan and Jain, Ajay and Abbeel, Pieter},booktitle={NeurIPS},year={2020}}',
  },
  {
    id: 'cot', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    authors: 'Wei, Wang, Schuurmans, Bosma, Ichter, Xia, Chi, Le, Zhou',
    venue: 'NeurIPS', year: 2022, category: 'AI',
    url: 'https://arxiv.org/abs/2201.11903', arxiv: '2201.11903',
    difficulty: 'Advanced Undergraduate',
    prerequisites: ['Language model prompting', 'Benchmark evaluation methodology'],
    prereqLessons: ['cs450-l1'],
    thirtySeconds: 'Prompting a large model with worked intermediate steps unlocks multi-step reasoning that direct answering fails at — and only at sufficient scale.',
    fiveMinutes: 'Few-shot exemplars containing reasoning steps let the model generate its own steps before answering. Gains are large on arithmetic, commonsense and symbolic reasoning, and appear only above roughly 100B parameters in the models tested.',
    deep: 'The claim is empirical, not mechanistic: extra decoded tokens give more serial computation before commitment, and the exemplars condition the output distribution toward decomposition. Scale-dependence means small-model results do not transfer, which is a real threat to reproducibility for anyone without frontier-scale access. Evaluation is sensitive to exemplar choice and to answer extraction, so reported gains carry substantial prompt variance.',
    before: 'Standard few-shot prompting plateaued on multi-step arithmetic; the fix assumed was fine-tuning on rationales, which needs labelled reasoning data.',
    contribution: 'A prompting method needing no training, evidence of emergence with scale, and analysis across three reasoning families.',
    math: 'None formal; results are accuracy comparisons on benchmark suites.',
    setup: 'GSM8K, SVAMP, ASDiv, CSQA, StrategyQA and symbolic tasks, on GPT-3, LaMDA and PaLM at multiple sizes.',
    results: 'PaLM 540B with chain-of-thought reached 57% on GSM8K versus about 18% with standard prompting.',
    limitations: 'No guarantee the stated reasoning reflects the computation actually performed; emergence claim depends on the metric; heavy prompt sensitivity; no small-model path.',
    questions: ['Are the written steps causal for the answer, or post-hoc?', 'How much of the gain survives a change of exemplars?'],
    implement: 'Build an evaluation harness that scores an open model on 100 GSM8K items with and without chain-of-thought, across 3 exemplar sets.',
    opportunities: ['Measure faithfulness by perturbing intermediate steps and observing answer change'],
    reproduce: { dataset: 'GSM8K (100-item subset)', baseline: 'Standard few-shot prompting, same exemplars without rationales', steps: ['Fix a model and decoding settings', 'Run both prompt styles across 3 exemplar sets', 'Report mean and range, not a single number', 'Perturb one reasoning step and measure answer flips'], originalResult: '57% GSM8K with PaLM 540B chain-of-thought vs ~18% standard' },
    related: ['bert', 'transformer'],
    bibtex: '@inproceedings{wei2022chain,title={Chain-of-Thought Prompting Elicits Reasoning in Large Language Models},author={Wei, Jason and Wang, Xuezhi and Schuurmans, Dale and Bosma, Maarten and Ichter, Brian and Xia, Fei and Chi, Ed and Le, Quoc and Zhou, Denny},booktitle={NeurIPS},year={2022}}',
  },
]

export const readingStages = ['Abstract', 'Introduction', 'Related Work', 'Method', 'Experiments', 'Results', 'Limitations', 'Conclusion'] as const

export const stageQuestions: Record<string, string> = {
  Abstract: 'In one sentence, what problem does this paper claim to solve, and what is the claimed evidence?',
  Introduction: 'What existed before, and what specific gap do the authors say they close?',
  'Related Work': 'Name the closest prior method and state the one difference that matters.',
  Method: 'Describe the method precisely enough that someone could implement it. What is the core equation or mechanism?',
  Experiments: 'What is the baseline, what is controlled, and what confound would you worry about?',
  Results: 'Which reported number actually supports the headline claim, and how large is the effect?',
  Limitations: 'What claim would you refuse to accept from this evidence?',
  Conclusion: 'Without looking at the paper, explain the whole contribution in your own words.',
}

export const paperById = (id: string) => papers.find(p => p.id === id)
