<template>
  <v-card variant="tonal" class="pa-4 mt-4">
    <div class="text-h6 mb-3">Configuração</div>
    <div class="d-flex ga-3">
      <v-btn
        @click="downloadConfig"
        color="blue"
        block
      >
        Baixar
      </v-btn>
    </div> 
    <div class="d-flex ga-3 mt-3">
      <v-btn
        @click="triggerFileUpload"
        color="blue-grey"
        block
      >
        Carregar
      </v-btn>

      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".json"
        style="display: none"
      />
    </div>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';

const store = useConfigurationStore();
const fileInput = ref<HTMLInputElement | null>(null);

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
});

/**
 * Pega o estado atual do store, converte para JSON e inicia o download.
 */
const downloadConfig = () => {
  // Criamos um objeto apenas com os dados que queremos salvar
  const configData = {
    providers: store.providers,
    models: store.models,
    sharedVariables: store.sharedVariables,
    sharedLinks: store.sharedLinks,
    agents: store.agents,
  };

  const jsonString = JSON.stringify(configData, null, 2); // `null, 2` formata o JSON para ficar legível
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `agent-shell-config_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();

  // Limpeza
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  snackbar.text = 'Arquivo de configuração gerado!';
  snackbar.color = 'success';
  snackbar.show = true;
};

/**
 * Simula um clique no input de arquivo escondido.
 */
const triggerFileUpload = () => {
  fileInput.value?.click();
};

/**
 * Lida com o arquivo selecionado pelo usuário.
 */
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsedJson = JSON.parse(content);

      // Chama a action do store para carregar os novos dados
      store.loadConfigFromFile(parsedJson);

      // Não precisamos de snackbar aqui porque a página será recarregada
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      snackbar.text = 'Erro: O arquivo não é um JSON válido.';
      snackbar.color = 'error';
      snackbar.show = true;
    }
  };

  reader.onerror = () => {
    console.error('Erro ao ler o arquivo.');
    snackbar.text = 'Erro ao ler o arquivo selecionado.';
    snackbar.color = 'error';
    snackbar.show = true;
  };

  reader.readAsText(file);

  // Limpa o valor do input para permitir carregar o mesmo arquivo novamente
  target.value = '';
};
</script>