// src/stores/configuration.ts
import { defineStore } from 'pinia';
import type { Agent, Provider, Model, SharedVariable, SharedLink } from '@/types';

// Interface para o objeto de configuração completo
interface AppConfig {
  agents: Agent[];
  providers: Provider[];
  models: Model[];
  sharedVariables: SharedVariable[];
  sharedLinks: SharedLink[];
}

export const useConfigurationStore = defineStore('configuration', {
  state: () => ({
    agents: [] as Agent[],
    providers: [] as Provider[],
    models: [] as Model[],
    sharedVariables: [] as SharedVariable[],
    sharedLinks: [] as SharedLink[],
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
    /**
     * NOVA ACTION: Substitui o estado atual pelo conteúdo de um arquivo de configuração.
     * @param newConfig O objeto de configuração lido do arquivo JSON.
     */
    loadConfigFromFile(newConfig: Partial<AppConfig>) {
      // Usamos `|| []` como uma salvaguarda contra arquivos malformados
      this.agents = newConfig.agents || [];
      this.providers = newConfig.providers || [];
      this.models = newConfig.models || [];
      this.sharedVariables = newConfig.sharedVariables || [];
      this.sharedLinks = newConfig.sharedLinks || [];
      
      // Reseta o agente ativo pois a lista mudou
      this.activeAgentId = null; 

      // Salva a nova configuração no LocalStorage
      this.saveConfiguration();
      
      // Opcional: Recarrega a página para garantir que toda a UI reflita o novo estado
      window.location.reload();
    },

    saveConfiguration() {
      // Modificamos para salvar todos os campos do estado
      const configToSave = {
        agents: this.agents,
        providers: this.providers,
        models: this.models,
        sharedVariables: this.sharedVariables,
        sharedLinks: this.sharedLinks,
      };
      localStorage.setItem('agentShellConfig', JSON.stringify(configToSave));
    },

    loadConfiguration() {
      const savedConfig = localStorage.getItem('agentShellConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.agents = config.agents || [];
        this.providers = config.providers || [];
        this.models = config.models || [];
        this.sharedVariables = config.sharedVariables || [];
        this.sharedLinks = config.sharedLinks || [];        
      }
    },
    setActiveAgent(agentId: string) {
      this.activeAgentId = agentId;
    },
  },
});