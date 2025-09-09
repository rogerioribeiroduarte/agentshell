// src/stores/configuration.ts
import { defineStore } from 'pinia';
import type { Agent, Provider, Model } from '@/types';

export const useConfigurationStore = defineStore('configuration', {
  state: () => ({
    agents: [] as Agent[],
    providers: [] as Provider[],
    models: [] as Model[],
    activeAgentId: null as string | null,
  }),
  getters: {
    // Um getter é como uma propriedade computada para o seu store
    activeAgent: (state): Agent | undefined => {
      return state.agents.find(agent => agent.id === state.activeAgentId);
    },
  },
  actions: {
    // Ações são métodos que podem modificar o estado
    loadConfiguration() {
      const savedConfig = localStorage.getItem('agentShellConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.agents = config.agents || [];
        this.providers = config.providers || [];
        this.models = config.models || [];
      }
    },
    saveConfiguration() {
      const config = {
        agents: this.agents,
        providers: this.providers,
        models: this.models,
      };
      localStorage.setItem('agentShellConfig', JSON.stringify(config));
    },
    setActiveAgent(agentId: string) {
      this.activeAgentId = agentId;
    },
  },
});