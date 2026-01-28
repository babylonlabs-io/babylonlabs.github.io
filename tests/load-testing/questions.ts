/**
 * Question bank for AI Chatbot load testing.
 *
 * Questions are organized by category to test different aspects
 * of the Babylon documentation and AI capabilities.
 */

export interface TestQuestion {
  id: string;
  category: string;
  question: string;
  /** Expected keywords that should appear in the response */
  expectedKeywords?: string[];
}

/**
 * Comprehensive question bank covering various Babylon documentation topics.
 * Each question is designed to test different aspects of the AI's knowledge.
 */
export const questionBank: TestQuestion[] = [
  // === Protocol Overview ===
  {
    id: 'overview-1',
    category: 'Protocol Overview',
    question: 'What is Babylon?',
    expectedKeywords: ['Bitcoin', 'staking', 'protocol'],
  },
  {
    id: 'overview-2',
    category: 'Protocol Overview',
    question: 'How does Bitcoin staking work on Babylon?',
    expectedKeywords: ['stake', 'BTC', 'security'],
  },
  {
    id: 'overview-3',
    category: 'Protocol Overview',
    question: 'What are Bitcoin Supercharged Networks (BSNs)?',
    expectedKeywords: ['BSN', 'security', 'Bitcoin'],
  },
  {
    id: 'overview-4',
    category: 'Protocol Overview',
    question: 'Explain the Babylon Genesis architecture',
    expectedKeywords: ['architecture', 'chain'],
  },
  {
    id: 'overview-5',
    category: 'Protocol Overview',
    question: 'What is the BABY token used for?',
    expectedKeywords: ['BABY', 'token', 'governance'],
  },

  // === Staking ===
  {
    id: 'staking-1',
    category: 'Staking',
    question: 'How do I stake BTC on Babylon?',
    expectedKeywords: ['stake', 'BTC', 'wallet'],
  },
  {
    id: 'staking-2',
    category: 'Staking',
    question: 'What is the minimum amount required to stake?',
    expectedKeywords: ['minimum', 'stake'],
  },
  {
    id: 'staking-3',
    category: 'Staking',
    question: 'How long is the unbonding period for staked BTC?',
    expectedKeywords: ['unbonding', 'period'],
  },
  {
    id: 'staking-4',
    category: 'Staking',
    question: 'What are the risks of staking Bitcoin on Babylon?',
    expectedKeywords: ['risk', 'slashing'],
  },
  {
    id: 'staking-5',
    category: 'Staking',
    question: 'What is liquid staking on Babylon?',
    expectedKeywords: ['liquid', 'staking', 'LST'],
  },
  {
    id: 'staking-6',
    category: 'Staking',
    question: 'How do I choose a Finality Provider to stake with?',
    expectedKeywords: ['Finality Provider', 'stake'],
  },
  {
    id: 'staking-7',
    category: 'Staking',
    question: 'Can I stake from a hardware wallet?',
    expectedKeywords: ['wallet', 'stake'],
  },
  {
    id: 'staking-8',
    category: 'Staking',
    question: 'What happens if my Finality Provider gets slashed?',
    expectedKeywords: ['slashing', 'Finality Provider'],
  },

  // === Finality Providers ===
  {
    id: 'fp-1',
    category: 'Finality Providers',
    question: 'What is a Finality Provider in Babylon?',
    expectedKeywords: ['Finality Provider', 'BTC', 'security'],
  },
  {
    id: 'fp-2',
    category: 'Finality Providers',
    question: 'How do I become a Finality Provider?',
    expectedKeywords: ['Finality Provider', 'setup', 'run'],
  },
  {
    id: 'fp-3',
    category: 'Finality Providers',
    question: 'What are the hardware requirements to run a Finality Provider?',
    expectedKeywords: ['hardware', 'requirements'],
  },
  {
    id: 'fp-4',
    category: 'Finality Providers',
    question: 'What is the commission structure for Finality Providers?',
    expectedKeywords: ['commission', 'Finality Provider'],
  },
  {
    id: 'fp-5',
    category: 'Finality Providers',
    question: 'How does slashing work for Finality Providers?',
    expectedKeywords: ['slashing', 'penalty'],
  },

  // === Node Operation ===
  {
    id: 'node-1',
    category: 'Node Operation',
    question: 'How do I run a Babylon full node?',
    expectedKeywords: ['node', 'run', 'setup'],
  },
  {
    id: 'node-2',
    category: 'Node Operation',
    question: 'What are the system requirements for running a Babylon node?',
    expectedKeywords: ['requirements', 'CPU', 'memory'],
  },
  {
    id: 'node-3',
    category: 'Node Operation',
    question: 'How do I become a Babylon validator?',
    expectedKeywords: ['validator', 'stake'],
  },
  {
    id: 'node-4',
    category: 'Node Operation',
    question: 'What is a vigilante service in Babylon?',
    expectedKeywords: ['vigilante', 'service'],
  },
  {
    id: 'node-5',
    category: 'Node Operation',
    question: 'How do I set up the covenant emulator?',
    expectedKeywords: ['covenant', 'emulator', 'setup'],
  },

  // === Development ===
  {
    id: 'dev-1',
    category: 'Development',
    question: 'How do I build a dApp on Babylon?',
    expectedKeywords: ['dApp', 'build', 'develop'],
  },
  {
    id: 'dev-2',
    category: 'Development',
    question: 'What APIs are available for Babylon developers?',
    expectedKeywords: ['API', 'developer'],
  },
  {
    id: 'dev-3',
    category: 'Development',
    question: 'How do I integrate Bitcoin staking into my application?',
    expectedKeywords: ['integrate', 'staking', 'application'],
  },
  {
    id: 'dev-4',
    category: 'Development',
    question: 'What SDKs does Babylon provide?',
    expectedKeywords: ['SDK'],
  },
  {
    id: 'dev-5',
    category: 'Development',
    question: 'How do I connect to the Babylon testnet?',
    expectedKeywords: ['testnet', 'connect'],
  },
  {
    id: 'dev-6',
    category: 'Development',
    question: 'What block explorers are available for Babylon?',
    expectedKeywords: ['explorer', 'block'],
  },

  // === Wallet ===
  {
    id: 'wallet-1',
    category: 'Wallet',
    question: 'Which wallets support Babylon staking?',
    expectedKeywords: ['wallet', 'support'],
  },
  {
    id: 'wallet-2',
    category: 'Wallet',
    question: 'How do I set up a wallet for Babylon?',
    expectedKeywords: ['wallet', 'setup'],
  },
  {
    id: 'wallet-3',
    category: 'Wallet',
    question: 'Can I use MetaMask with Babylon?',
    expectedKeywords: ['MetaMask', 'wallet'],
  },

  // === Governance ===
  {
    id: 'gov-1',
    category: 'Governance',
    question: 'How does governance work on Babylon?',
    expectedKeywords: ['governance', 'vote'],
  },
  {
    id: 'gov-2',
    category: 'Governance',
    question: 'How do I participate in Babylon governance?',
    expectedKeywords: ['governance', 'participate', 'vote'],
  },
  {
    id: 'gov-3',
    category: 'Governance',
    question: 'What can be changed through governance proposals?',
    expectedKeywords: ['governance', 'proposal'],
  },

  // === Security ===
  {
    id: 'security-1',
    category: 'Security',
    question: 'Has Babylon been audited?',
    expectedKeywords: ['audit', 'security'],
  },
  {
    id: 'security-2',
    category: 'Security',
    question: 'Does Babylon have a bug bounty program?',
    expectedKeywords: ['bug bounty', 'security'],
  },
  {
    id: 'security-3',
    category: 'Security',
    question: 'How is staked Bitcoin secured?',
    expectedKeywords: ['secure', 'Bitcoin', 'custody'],
  },

  // === Networks ===
  {
    id: 'network-1',
    category: 'Networks',
    question: 'What is the Babylon mainnet?',
    expectedKeywords: ['mainnet'],
  },
  {
    id: 'network-2',
    category: 'Networks',
    question: 'How do I get testnet tokens?',
    expectedKeywords: ['testnet', 'faucet'],
  },
  {
    id: 'network-3',
    category: 'Networks',
    question: 'What is the chain ID for Babylon mainnet?',
    expectedKeywords: ['chain', 'ID'],
  },

  // === Technical Deep Dives ===
  {
    id: 'tech-1',
    category: 'Technical',
    question: 'How does the timestamping protocol work?',
    expectedKeywords: ['timestamp', 'Bitcoin'],
  },
  {
    id: 'tech-2',
    category: 'Technical',
    question: 'What consensus mechanism does Babylon use?',
    expectedKeywords: ['consensus'],
  },
  {
    id: 'tech-3',
    category: 'Technical',
    question: 'How are BTC staking transactions constructed?',
    expectedKeywords: ['transaction', 'BTC'],
  },
  {
    id: 'tech-4',
    category: 'Technical',
    question: 'What is the role of covenants in Babylon?',
    expectedKeywords: ['covenant'],
  },

  // === General/Edge Cases ===
  {
    id: 'general-1',
    category: 'General',
    question: 'Where can I find Babylon documentation?',
    expectedKeywords: ['documentation', 'docs'],
  },
  {
    id: 'general-2',
    category: 'General',
    question: 'How can I get help with Babylon?',
    expectedKeywords: ['help', 'support', 'Discord'],
  },
  {
    id: 'general-3',
    category: 'General',
    question: 'What is the roadmap for Babylon?',
    expectedKeywords: ['roadmap'],
  },
  {
    id: 'general-4',
    category: 'General',
    question: 'Tell me about Babylon Labs',
    expectedKeywords: ['Babylon'],
  },
  {
    id: 'general-5',
    category: 'General',
    question: 'What makes Babylon different from other staking protocols?',
    expectedKeywords: ['Bitcoin', 'staking'],
  },

  // === CLI Commands ===
  {
    id: 'cli-1',
    category: 'CLI',
    question: 'What commands does the Babylon CLI support?',
    expectedKeywords: ['CLI', 'command'],
  },
  {
    id: 'cli-2',
    category: 'CLI',
    question: 'How do I check my staking balance using CLI?',
    expectedKeywords: ['CLI', 'balance'],
  },

  // === API ===
  {
    id: 'api-1',
    category: 'API',
    question: 'How do I use the Babylon Staking API?',
    expectedKeywords: ['API', 'staking'],
  },
  {
    id: 'api-2',
    category: 'API',
    question: 'What endpoints does the gRPC API provide?',
    expectedKeywords: ['gRPC', 'API', 'endpoint'],
  },

  // === Edge Cases / Stress Tests ===
  {
    id: 'edge-1',
    category: 'Edge Case',
    question: 'What happens if the Bitcoin network is congested?',
    expectedKeywords: ['Bitcoin', 'network'],
  },
  {
    id: 'edge-2',
    category: 'Edge Case',
    question: 'Can I cancel a staking transaction?',
    expectedKeywords: ['cancel', 'transaction'],
  },
  {
    id: 'edge-3',
    category: 'Edge Case',
    question: 'What if I lose access to my staking wallet?',
    expectedKeywords: ['wallet', 'access'],
  },
];

/**
 * Get a random subset of questions for testing.
 *
 * @param count - Number of questions to select
 * @param categories - Optional list of categories to filter by
 * @returns Array of randomly selected questions
 */
export function getRandomQuestions(
  count: number,
  categories?: string[]
): TestQuestion[] {
  let pool = [...questionBank];

  // Filter by categories if specified
  if (categories && categories.length > 0) {
    pool = pool.filter((q) => categories.includes(q.category));
  }

  // Shuffle using Fisher-Yates algorithm
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Return requested count (or all if count exceeds pool size)
  return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Get questions in sequential order (for reproducible tests).
 *
 * @param count - Number of questions to select
 * @returns Array of questions in order
 */
export function getSequentialQuestions(count: number): TestQuestion[] {
  // Repeat questions if count exceeds bank size
  const result: TestQuestion[] = [];
  while (result.length < count) {
    const remaining = count - result.length;
    result.push(...questionBank.slice(0, Math.min(remaining, questionBank.length)));
  }
  return result;
}

/**
 * Get all unique categories in the question bank.
 */
export function getCategories(): string[] {
  return [...new Set(questionBank.map((q) => q.category))];
}

/**
 * Get questions grouped by category.
 */
export function getQuestionsByCategory(): Record<string, TestQuestion[]> {
  return questionBank.reduce(
    (acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = [];
      }
      acc[q.category].push(q);
      return acc;
    },
    {} as Record<string, TestQuestion[]>
  );
}
