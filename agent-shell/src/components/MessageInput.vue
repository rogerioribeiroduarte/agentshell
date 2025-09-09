<template>
  <div class="input-container">
    <v-text-field
      v-model="newMessage"
      label="Digite sua mensagem..."
      variant="solo"
      hide-details
      :loading="conversationStore.isLoading"
      :disabled="conversationStore.isLoading"
      @keydown.enter.prevent="submit"
    ></v-text-field>

    <v-btn
      icon="mdi-send"
      color="primary"
      class="ml-3"
      size="large"
      :loading="conversationStore.isLoading"
      :disabled="conversationStore.isLoading || newMessage.trim() === ''"
      @click="submit"
    ></v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConversationStore } from '@/stores/conversation';
import { sendMessage } from '@/services/apiService';

const newMessage = ref('');
const conversationStore = useConversationStore();

const submit = async () => {
  const messageText = newMessage.value.trim();
  if (messageText === '' || conversationStore.isLoading) {
    return;
  }

  // Limpa o campo de input imediatamente para uma melhor experiência do usuário
  newMessage.value = '';

  try {
    // Chama a função do nosso serviço de API
    await sendMessage(messageText);
  } catch (error) {
    console.error("Falha ao enviar mensagem a partir do componente:", error);
    // O erro já é tratado no service, mas podemos adicionar um feedback extra aqui se quisermos
  }
};
</script>

<style scoped>
.input-container {
  padding: 16px;
  display: flex;
  align-items: center;
}
</style>