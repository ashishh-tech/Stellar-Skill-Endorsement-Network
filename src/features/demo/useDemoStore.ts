'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  INITIAL_DEMO_PEERS,
  INITIAL_DEMO_EVENTS,
  INITIAL_DEMO_TRANSACTIONS,
  type DemoPeer,
  type DemoEvent,
  type DemoTransaction,
} from './demoData';

interface DemoState {
  isDemoMode: boolean;
  activeDemoUser: DemoPeer;
  peers: DemoPeer[];
  events: DemoEvent[];
  transactions: DemoTransaction[];
  selectedPeerForDossier: DemoPeer | null;

  // Actions
  toggleDemoMode: (enabled?: boolean) => void;
  setActiveDemoUser: (user: DemoPeer) => void;
  setSelectedPeerForDossier: (peer: DemoPeer | null) => void;
  addDemoSkill: (skillName: string, category: string) => void;
  submitDemoEndorsement: (
    endorseeAddress: string,
    skillName: string,
    message: string
  ) => { success: boolean; weight: number; message: string };
  registerDemoProfile: (name: string, bio: string) => void;
  resetDemoData: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      isDemoMode: false, // Default to false so wallet prompt is shown, with 1-click Reviewer Demo Mode toggle
      activeDemoUser: INITIAL_DEMO_PEERS[0],
      peers: INITIAL_DEMO_PEERS,
      events: INITIAL_DEMO_EVENTS,
      transactions: INITIAL_DEMO_TRANSACTIONS,
      selectedPeerForDossier: null,

      toggleDemoMode: (enabled) => {
        set((state) => ({
          isDemoMode: enabled !== undefined ? enabled : !state.isDemoMode,
        }));
      },

      setActiveDemoUser: (user) => {
        set({ activeDemoUser: user });
      },

      setSelectedPeerForDossier: (peer) => {
        set({ selectedPeerForDossier: peer });
      },

      addDemoSkill: (skillName, category) => {
        const { activeDemoUser, peers, events, transactions } = get();
        const existingSkill = activeDemoUser.skills.find(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (existingSkill) {
          throw new Error(`Skill "${skillName}" is already registered on your profile.`);
        }

        const newSkill = {
          name: skillName,
          category,
          endorsementsCount: 0,
          totalWeight: 0,
          endorsers: [],
        };

        const updatedUser = {
          ...activeDemoUser,
          skills: [...activeDemoUser.skills, newSkill],
        };

        const updatedPeers = peers.map((p) =>
          p.address === activeDemoUser.address ? updatedUser : p
        );

        const newTxHash = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const newEvent: DemoEvent = {
          id: `evt-${Date.now()}`,
          type: 'skill_added',
          title: 'Skill Added to Profile',
          description: `${activeDemoUser.name} registered a new skill: "${skillName}"`,
          actor: activeDemoUser.address,
          skill: skillName,
          ledger: 582495 + Math.floor(Math.random() * 10),
          timestamp: Date.now(),
          txHash: newTxHash,
          contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
          payload: {
            owner: activeDemoUser.name,
            skill: skillName,
            category,
          },
        };

        const newTx: DemoTransaction = {
          id: `tx-${Date.now()}`,
          hash: newTxHash,
          method: 'add_skill',
          contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
          contractName: 'ProfileRegistry',
          status: 'confirmed',
          timestamp: Date.now(),
          ledger: newEvent.ledger,
          gasFee: '0.00008 XLM',
          simulatedFootprint: {
            readOnlyKeys: 1,
            readWriteKeys: 2,
            cpuInstructions: 96000,
            memoryBytes: 28900,
          },
          authTree: [
            `${activeDemoUser.address.slice(0, 10)}...::require_auth()`,
            'ProfileRegistry::storage::persistent::set(SkillKey)',
          ],
        };

        set({
          activeDemoUser: updatedUser,
          peers: updatedPeers,
          events: [newEvent, ...events],
          transactions: [newTx, ...transactions],
        });
      },

      submitDemoEndorsement: (endorseeAddress, skillName, message) => {
        const { activeDemoUser, peers, events, transactions } = get();

        if (endorseeAddress === activeDemoUser.address) {
          throw new Error('Self-endorsement is rejected by smart contract policy.');
        }

        const endorsee = peers.find((p) => p.address === endorseeAddress);
        if (!endorsee) {
          throw new Error('Target endorsee profile not found.');
        }

        // Trust-weight calculation: base weight proportional to endorser reputation
        const weight = Math.max(10, Math.round(activeDemoUser.reputation * 0.5));

        const updatedSkills = endorsee.skills.map((skill) => {
          if (skill.name.toLowerCase() === skillName.toLowerCase()) {
            return {
              ...skill,
              endorsementsCount: skill.endorsementsCount + 1,
              totalWeight: skill.totalWeight + weight,
              endorsers: [
                {
                  name: activeDemoUser.name,
                  address: activeDemoUser.address,
                  weight,
                  message: message || 'Verified peer endorsement',
                  date: new Date().toISOString().split('T')[0],
                },
                ...skill.endorsers,
              ],
            };
          }
          return skill;
        });

        // If skill doesn't exist yet on endorsee, add it
        const skillFound = endorsee.skills.some(
          (s) => s.name.toLowerCase() === skillName.toLowerCase()
        );
        if (!skillFound) {
          updatedSkills.push({
            name: skillName,
            category: 'Blockchain',
            endorsementsCount: 1,
            totalWeight: weight,
            endorsers: [
              {
                name: activeDemoUser.name,
                address: activeDemoUser.address,
                weight,
                message: message || 'Verified peer endorsement',
                date: new Date().toISOString().split('T')[0],
              },
            ],
          });
        }

        const updatedEndorsee: DemoPeer = {
          ...endorsee,
          skills: updatedSkills,
          reputation: endorsee.reputation + Math.round(weight * 0.1),
          receivedEndorsementsCount: endorsee.receivedEndorsementsCount + 1,
        };

        const updatedActiveUser: DemoPeer = {
          ...activeDemoUser,
          givenEndorsementsCount: activeDemoUser.givenEndorsementsCount + 1,
        };

        const updatedPeers = peers.map((p) => {
          if (p.address === endorsee.address) return updatedEndorsee;
          if (p.address === activeDemoUser.address) return updatedActiveUser;
          return p;
        });

        const newTxHash = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const newEvent: DemoEvent = {
          id: `evt-${Date.now()}`,
          type: 'endorsement',
          title: 'Skill Endorsement Executed',
          description: `${activeDemoUser.name} endorsed ${endorsee.name} for "${skillName}" (+${weight} trust weight)`,
          actor: activeDemoUser.address,
          target: endorsee.address,
          skill: skillName,
          weight,
          ledger: 582496 + Math.floor(Math.random() * 10),
          timestamp: Date.now(),
          txHash: newTxHash,
          contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          payload: {
            endorser: activeDemoUser.name,
            endorsee: endorsee.name,
            skill: skillName,
            weightCalculated: weight,
            interContractCall: `ProfileRegistry::get_reputation -> ${activeDemoUser.reputation}`,
          },
        };

        const newTx: DemoTransaction = {
          id: `tx-${Date.now()}`,
          hash: newTxHash,
          method: 'endorse_skill',
          contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
          contractName: 'EndorsementEngine',
          status: 'confirmed',
          timestamp: Date.now(),
          ledger: newEvent.ledger,
          gasFee: '0.00015 XLM',
          simulatedFootprint: {
            readOnlyKeys: 3,
            readWriteKeys: 2,
            cpuInstructions: 188400,
            memoryBytes: 49800,
          },
          authTree: [
            `${activeDemoUser.address.slice(0, 10)}...::require_auth()`,
            'EndorsementEngine -> ProfileRegistry::get_reputation()',
            'EndorsementEngine -> ProfileRegistry::increment_endorsement_count()',
          ],
        };

        set({
          activeDemoUser: updatedActiveUser,
          peers: updatedPeers,
          events: [newEvent, ...events],
          transactions: [newTx, ...transactions],
        });

        return {
          success: true,
          weight,
          message: `Endorsement recorded! Inter-contract call executed. Assigned weight: +${weight}.`,
        };
      },

      registerDemoProfile: (name, bio) => {
        const { activeDemoUser, peers, events, transactions } = get();
        const updatedUser: DemoPeer = {
          ...activeDemoUser,
          name,
          bio,
        };

        const updatedPeers = peers.map((p) =>
          p.address === activeDemoUser.address ? updatedUser : p
        );

        const newTxHash = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');

        const newEvent: DemoEvent = {
          id: `evt-${Date.now()}`,
          type: 'profile_registered',
          title: 'Profile Updated',
          description: `${name} updated profile details on Stellar Testnet`,
          actor: activeDemoUser.address,
          ledger: 582498,
          timestamp: Date.now(),
          txHash: newTxHash,
          contractId: 'CA3D5UBQXIK7OTKN6TLWPEL5QUZNNDON7W72HIJMSW6Y7WCISDQDHET3',
          payload: { name, bio },
        };

        set({
          activeDemoUser: updatedUser,
          peers: updatedPeers,
          events: [newEvent, ...events],
        });
      },

      resetDemoData: () => {
        set({
          peers: INITIAL_DEMO_PEERS,
          activeDemoUser: INITIAL_DEMO_PEERS[0],
          events: INITIAL_DEMO_EVENTS,
          transactions: INITIAL_DEMO_TRANSACTIONS,
          selectedPeerForDossier: null,
        });
      },
    }),
    {
      name: 'stellar_skillnet_demo_storage',
    }
  )
);
