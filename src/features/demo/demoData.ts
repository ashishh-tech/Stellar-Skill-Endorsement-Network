export interface DemoPeer {
  address: string;
  name: string;
  role: 'Admin' | 'Verifier' | 'User';
  reputation: number;
  avatarSeed: string;
  bio: string;
  joinedAt: string;
  skills: {
    name: string;
    category: string;
    endorsementsCount: number;
    totalWeight: number;
    endorsers: { name: string; address: string; weight: number; message: string; date: string }[];
  }[];
  receivedEndorsementsCount: number;
  givenEndorsementsCount: number;
  verifiedStatus: boolean;
  socials?: { github?: string; twitter?: string; stellarExpert?: string };
}

export interface DemoEvent {
  id: string;
  type: 'endorsement' | 'profile_registered' | 'skill_added' | 'role_assigned';
  title: string;
  description: string;
  actor: string;
  target?: string;
  skill?: string;
  weight?: number;
  ledger: number;
  timestamp: number;
  txHash: string;
  contractId: string;
  payload: Record<string, any>;
}

export interface DemoTransaction {
  id: string;
  hash: string;
  method: string;
  contractId: string;
  contractName: string;
  status: 'confirmed' | 'simulating' | 'signing' | 'submitting' | 'failed';
  timestamp: number;
  ledger: number;
  gasFee: string;
  simulatedFootprint: {
    readOnlyKeys: number;
    readWriteKeys: number;
    cpuInstructions: number;
    memoryBytes: number;
  };
  authTree: string[];
}

export const INITIAL_DEMO_PEERS: DemoPeer[] = [
  {
    address: 'GCLWGMS57W6K64CM24H2W6TYXW225XZQZDFCGHRWJ62H3ZJ2N6Q2ALICE',
    name: 'Alice Vance',
    role: 'Admin',
    reputation: 345,
    avatarSeed: 'alice',
    bio: 'Lead Soroban Smart Contract Architect & Core Contributor to Stellar SkillNet.',
    joinedAt: '2026-05-12',
    verifiedStatus: true,
    socials: { github: 'alicevance', twitter: 'alice_soroban', stellarExpert: 'GCLWGMS57W6K64CM24H2W6TYXW225XZQZDFCGHRWJ62H3ZJ2N6Q2ALICE' },
    skills: [
      {
        name: 'Rust Smart Contracts',
        category: 'Blockchain',
        endorsementsCount: 14,
        totalWeight: 1820,
        endorsers: [
          { name: 'Bob Zhang', address: 'GDM64B7WNYU5W9J54XG7K9B2DHF76SDF234KSDF8923NKSDF23BOB', weight: 145, message: 'Exceptional Rust contract memory safety and audit-ready architecture.', date: '2026-08-18' },
          { name: 'Charlie Miller', address: 'GBK923NKSDF2389SFD7623KSDF8934LKSDF90234KSDF234CHARLIE', weight: 110, message: 'Pioneered cross-contract invocation patterns on Soroban.', date: '2026-08-16' },
        ],
      },
      {
        name: 'Soroban SDK',
        category: 'Blockchain',
        endorsementsCount: 18,
        totalWeight: 2140,
        endorsers: [
          { name: 'Diana Prince', address: 'GCP987234KSDF234KSDF89234KSDF89234KSDF89234KSDFDIANA', weight: 95, message: 'Deep understanding of Soroban instance vs persistent storage.', date: '2026-08-14' },
        ],
      },
      {
        name: 'Zero-Knowledge Proofs',
        category: 'Cryptography',
        endorsementsCount: 6,
        totalWeight: 720,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 38,
    givenEndorsementsCount: 22,
  },
  {
    address: 'GDM64B7WNYU5W9J54XG7K9B2DHF76SDF234KSDF8923NKSDF23BOB',
    name: 'Bob Zhang',
    role: 'Verifier',
    reputation: 260,
    avatarSeed: 'bob',
    bio: 'Security Researcher & Formal Verification specialist for Stellar DeFi protocols.',
    joinedAt: '2026-06-01',
    verifiedStatus: true,
    socials: { github: 'bobzhang-sec', twitter: 'bob_stellar_sec' },
    skills: [
      {
        name: 'Security Auditing',
        category: 'Security',
        endorsementsCount: 11,
        totalWeight: 1430,
        endorsers: [
          { name: 'Alice Vance', address: 'GCLWGMS57W6K64CM24H2W6TYXW225XZQZDFCGHRWJ62H3ZJ2N6Q2ALICE', weight: 180, message: 'Discovered reentrancy vectors and protected protocol state.', date: '2026-08-15' },
        ],
      },
      {
        name: 'Formal Verification',
        category: 'Security',
        endorsementsCount: 8,
        totalWeight: 960,
        endorsers: [],
      },
      {
        name: 'Rust Optimization',
        category: 'Programming',
        endorsementsCount: 12,
        totalWeight: 1320,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 31,
    givenEndorsementsCount: 17,
  },
  {
    address: 'GBK923NKSDF2389SFD7623KSDF8934LKSDF90234KSDF234CHARLIE',
    name: 'Charlie Miller',
    role: 'User',
    reputation: 195,
    avatarSeed: 'charlie',
    bio: 'Fullstack Web3 Engineer building seamless dApp UIs with Next.js & Stellar SDK.',
    joinedAt: '2026-06-19',
    verifiedStatus: true,
    socials: { github: 'charliemiller-dev' },
    skills: [
      {
        name: 'TypeScript & Next.js',
        category: 'Frontend',
        endorsementsCount: 15,
        totalWeight: 1650,
        endorsers: [
          { name: 'Alice Vance', address: 'GCLWGMS57W6K64CM24H2W6TYXW225XZQZDFCGHRWJ62H3ZJ2N6Q2ALICE', weight: 180, message: 'Crafted world-class Web3 user interfaces and transaction flows.', date: '2026-08-17' },
        ],
      },
      {
        name: 'Stellar SDK & Freighter',
        category: 'Blockchain',
        endorsementsCount: 9,
        totalWeight: 980,
        endorsers: [],
      },
      {
        name: 'TailwindCSS & Framer Motion',
        category: 'Frontend',
        endorsementsCount: 13,
        totalWeight: 1240,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 37,
    givenEndorsementsCount: 14,
  },
  {
    address: 'GCP987234KSDF234KSDF89234KSDF89234KSDF89234KSDFDIANA',
    name: 'Diana Prince',
    role: 'Verifier',
    reputation: 210,
    avatarSeed: 'diana',
    bio: 'Decentralized Identity (DID) & Verifiable Credentials protocol engineer.',
    joinedAt: '2026-07-04',
    verifiedStatus: true,
    socials: { github: 'dianaprince-id' },
    skills: [
      {
        name: 'Decentralized Identity (DID)',
        category: 'Identity',
        endorsementsCount: 10,
        totalWeight: 1100,
        endorsers: [],
      },
      {
        name: 'Sybil Resistance Algorithms',
        category: 'Identity',
        endorsementsCount: 8,
        totalWeight: 920,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 18,
    givenEndorsementsCount: 12,
  },
  {
    address: 'GEK48234908SKDF90234KSDF09234KSDF09234KSDF09234ELENA',
    name: 'Elena Rostova',
    role: 'User',
    reputation: 160,
    avatarSeed: 'elena',
    bio: 'Solidity to Soroban bridge specialist and developer relations advocate.',
    joinedAt: '2026-07-15',
    verifiedStatus: false,
    socials: { twitter: 'elena_soroban' },
    skills: [
      {
        name: 'EVM to Soroban Migration',
        category: 'Blockchain',
        endorsementsCount: 7,
        totalWeight: 740,
        endorsers: [],
      },
      {
        name: 'Technical Writing & DevRel',
        category: 'Community',
        endorsementsCount: 9,
        totalWeight: 880,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 16,
    givenEndorsementsCount: 8,
  },
  {
    address: 'GFX712398471293847192834719283471928347192834FELIX',
    name: 'Felix Gomez',
    role: 'User',
    reputation: 130,
    avatarSeed: 'felix',
    bio: 'Junior Soroban developer eager to learn and contribute to open-source protocols.',
    joinedAt: '2026-08-01',
    verifiedStatus: false,
    skills: [
      {
        name: 'Rust Fundamentals',
        category: 'Programming',
        endorsementsCount: 5,
        totalWeight: 450,
        endorsers: [],
      },
      {
        name: 'GitHub Actions & CI/CD',
        category: 'DevOps',
        endorsementsCount: 4,
        totalWeight: 380,
        endorsers: [],
      },
    ],
    receivedEndorsementsCount: 9,
    givenEndorsementsCount: 5,
  },
];

export const INITIAL_DEMO_EVENTS: DemoEvent[] = [
  {
    id: 'evt-1',
    type: 'endorsement',
    title: 'Skill Endorsement Executed',
    description: 'Alice Vance endorsed Bob Zhang for "Security Auditing" (+180 trust weight)',
    actor: 'GCLWGMS57W6K64CM24H2W6TYXW225XZQZDFCGHRWJ62H3ZJ2N6Q2ALICE',
    target: 'GDM64B7WNYU5W9J54XG7K9B2DHF76SDF234KSDF8923NKSDF23BOB',
    skill: 'Security Auditing',
    weight: 180,
    ledger: 582491,
    timestamp: Date.now() - 1000 * 60 * 3,
    txHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    payload: {
      endorser: 'Alice Vance',
      endorsee: 'Bob Zhang',
      skill: 'Security Auditing',
      weightCalculated: 180,
      interContractCall: 'ProfileRegistry::get_reputation -> 345',
    },
  },
  {
    id: 'evt-2',
    type: 'endorsement',
    title: 'Skill Endorsement Executed',
    description: 'Bob Zhang endorsed Charlie Miller for "TypeScript & Next.js" (+145 trust weight)',
    actor: 'GDM64B7WNYU5W9J54XG7K9B2DHF76SDF234KSDF8923NKSDF23BOB',
    target: 'GBK923NKSDF2389SFD7623KSDF8934LKSDF90234KSDF234CHARLIE',
    skill: 'TypeScript & Next.js',
    weight: 145,
    ledger: 582488,
    timestamp: Date.now() - 1000 * 60 * 12,
    txHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    payload: {
      endorser: 'Bob Zhang',
      endorsee: 'Charlie Miller',
      skill: 'TypeScript & Next.js',
      weightCalculated: 145,
      interContractCall: 'ProfileRegistry::get_reputation -> 260',
    },
  },
  {
    id: 'evt-3',
    type: 'skill_added',
    title: 'New Skill Registered',
    description: 'Charlie Miller registered a new skill: "TailwindCSS & Framer Motion"',
    actor: 'GBK923NKSDF2389SFD7623KSDF8934LKSDF90234KSDF234CHARLIE',
    skill: 'TailwindCSS & Framer Motion',
    ledger: 582482,
    timestamp: Date.now() - 1000 * 60 * 25,
    txHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
    payload: {
      owner: 'Charlie Miller',
      skill: 'TailwindCSS & Framer Motion',
      category: 'Frontend',
    },
  },
  {
    id: 'evt-4',
    type: 'profile_registered',
    title: 'On-Chain Profile Created',
    description: 'Felix Gomez created a new profile with base reputation 100',
    actor: 'GFX712398471293847192834719283471928347192834FELIX',
    ledger: 582470,
    timestamp: Date.now() - 1000 * 60 * 45,
    txHash: '7c963282ebfa7cd9b25916f1a8cc394142f1a04d2e8b09337ff86ff3b9991cb9',
    contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
    payload: {
      name: 'Felix Gomez',
      role: 'User',
      initialReputation: 100,
    },
  },
];

export const INITIAL_DEMO_TRANSACTIONS: DemoTransaction[] = [
  {
    id: 'tx-1',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    method: 'endorse_skill',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    contractName: 'EndorsementEngine',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 3,
    ledger: 582491,
    gasFee: '0.00015 XLM',
    simulatedFootprint: {
      readOnlyKeys: 3,
      readWriteKeys: 2,
      cpuInstructions: 184520,
      memoryBytes: 49200,
    },
    authTree: [
      'GCLWGMS57W...::require_auth()',
      'EndorsementEngine -> ProfileRegistry::get_reputation()',
      'EndorsementEngine -> ProfileRegistry::increment_endorsement_count()',
    ],
  },
  {
    id: 'tx-2',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    method: 'add_skill',
    contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
    contractName: 'ProfileRegistry',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 12,
    ledger: 582488,
    gasFee: '0.00008 XLM',
    simulatedFootprint: {
      readOnlyKeys: 1,
      readWriteKeys: 2,
      cpuInstructions: 95400,
      memoryBytes: 28400,
    },
    authTree: [
      'GBK923NKSD...::require_auth()',
      'ProfileRegistry::storage::persistent::set(SkillKey)',
    ],
  },
  {
    id: 'tx-3',
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    method: 'register_profile',
    contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
    contractName: 'ProfileRegistry',
    status: 'confirmed',
    timestamp: Date.now() - 1000 * 60 * 25,
    ledger: 582482,
    gasFee: '0.00012 XLM',
    simulatedFootprint: {
      readOnlyKeys: 1,
      readWriteKeys: 3,
      cpuInstructions: 112000,
      memoryBytes: 34100,
    },
    authTree: [
      'GFX7123984...::require_auth()',
      'ProfileRegistry::storage::instance::set(UserCount)',
      'ProfileRegistry::storage::persistent::set(ProfileData)',
    ],
  },
];
