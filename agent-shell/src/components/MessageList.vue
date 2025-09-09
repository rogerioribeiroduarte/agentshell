<template>
  <div class="message-container" ref="messageContainer">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="message-wrapper"
      :class="message.type === 'user' ? 'user-message' : 'agent-message'"
    >
      <v-card
        :theme="message.type === 'user' ? 'dark' : 'light'"
        class="message-bubble"
        elevation="2"
      >
        <v-card-text>
          {{ message.text }}
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Message } from '@/types';

// O componente recebe as mensagens como uma propriedade (prop)
const props = defineProps<{
  messages: Message[]
}>();

const messageContainer = ref<HTMLElement | null>(null);

// Função para rolar para o final do container
const scrollToBottom = () => {
  // nextTick garante que o DOM foi atualizado antes de tentarmos rolar
  nextTick(() => {
    const container = messageContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

// Observa qualquer mudança na lista de mensagens e rola para o final
watch(
  () => props.messages,
  () => {
    scrollToBottom();
  },
  { deep: true } // 'deep' garante que a mudança dentro do array seja detectada
);
</script>

<style scoped>
.message-container {
  flex-grow: 1; /* Faz o container ocupar o espaço disponível */
  padding: 16px;
  overflow-y: auto; /* Adiciona scroll se o conteúdo passar da altura */
  height: 65vh; /* Defina uma altura para o chat */
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  display: flex;
  margin-bottom: 12px;
}

.message-bubble {
  max-width: 80%;
  border-radius: 16px !important;
}

.user-message {
  justify-content: flex-end; /* Alinha a mensagem do usuário à direita */
}

.agent-message {
  justify-content: flex-start; /* Alinha a mensagem do agente à esquerda */
}

/* Pequeno ajuste para a cor do card do usuário */
.user-message .v-card {
  background-color: #1976D2; /* Um azul padrão do Vuetify */
  color: white;
}
</style>