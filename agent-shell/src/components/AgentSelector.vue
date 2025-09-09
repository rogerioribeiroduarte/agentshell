<template>
  <v-select
    label="Selecione um Agente"
    :items="configurationStore.agents"
    item-title="name"
    item-value="id"
    :model-value="configurationStore.activeAgentId"
    @update:model-value="handleAgentChange"
  ></v-select>
</template>

<script setup lang="ts">
import { useConfigurationStore } from '@/stores/configuration';
import { useConversationStore } from '@/stores/conversation';

const configurationStore = useConfigurationStore();
const conversationStore = useConversationStore();

const handleAgentChange = (agentId: string) => {
  configurationStore.setActiveAgent(agentId);

  // Limpa a conversa e adiciona a mensagem de boas-vindas
  conversationStore.clearMessages();
  const welcomeText = configurationStore.activeAgent?.welcomeText;
  if (welcomeText) {
      conversationStore.addMessage({ type: 'agent', text: welcomeText });
  }
};
</script>