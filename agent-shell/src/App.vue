<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="2">
            <ConfigManager /> 
            </v-col>
          <v-col cols="12" md="10">
            <AgentSelector />
            <ChatPanel />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useConfigurationStore } from '@/stores/configuration';
import AgentSelector from '@/components/AgentSelector.vue';
import ChatPanel from '@/components/ChatPanel.vue';
import ConfigManager from '@/components/ConfigManager.vue';

const configurationStore = useConfigurationStore();

onMounted(() => {
  configurationStore.loadConfiguration();
});
</script>