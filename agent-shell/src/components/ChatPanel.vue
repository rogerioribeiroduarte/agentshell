<template>
  <v-card class="chat-panel-card" elevation="4">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-robot-happy-outline"></v-icon>
      <span>{{ activeAgentName }}</span>
    </v-card-title>

    <v-divider></v-divider>

    <MessageList :messages="conversationStore.messages" />

    <v-progress-linear
      :active="conversationStore.isLoading"
      indeterminate
      color="primary"
    ></v-progress-linear>

    <v-divider></v-divider>

    <MessageInput />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';
import { useConversationStore } from '@/stores/conversation';

// Importando os componentes filhos
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';

// Acessando nossos stores
const configurationStore = useConfigurationStore();
const conversationStore = useConversationStore();

// Propriedade computada para obter o nome do agente ativo de forma reativa
const activeAgentName = computed(() => {
  return configurationStore.activeAgent?.name || 'Nenhum agente selecionado';
});
</script>

<style scoped>
.chat-panel-card {
  height: 85vh; /* Ocupa uma boa parte da altura da tela */
  display: flex;
  flex-direction: column;
}
</style>