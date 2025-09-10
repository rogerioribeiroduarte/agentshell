// src/services/apiService.ts
import axios from 'axios';
import { useConfigurationStore } from '@/stores/configuration';
import { useConversationStore } from '@/stores/conversation';
import type { Message } from '@/types';

export async function sendMessage(newMessage: string) {
    const configStore = useConfigurationStore();
    const convoStore = useConversationStore();

    // 1. Validar se há um agente ativo
    const activeAgent = configStore.activeAgent;
    if (!activeAgent) {
        throw new Error('Nenhum agente ativo selecionado.');
    }

    // 2. Adicionar mensagem do usuário e ativar loading
    convoStore.addMessage({ type: 'user', text: newMessage });
    convoStore.setLoading(true);

    try {
        // 3. Montar a requisição
        const headers = {
            'Content-Type': 'application/json',
        };

                // Regra 1: Adiciona os modelos como headers 'model_0', 'model_1', ...
        activeAgent.models.forEach((modelName, index) => {
            headers[`model${index}`] = modelName;
        });

        // Regra 2: Adiciona as variáveis compartilhadas (Shared Variables)
        // Para eficiência, criamos um mapa para busca rápida das variáveis
        const sharedVarsMap = new Map(
            configStore.sharedVariables.map(sv => [sv.key, sv.value])
        );
        
        activeAgent.sharedVariables.forEach(variableKey => {
            const value = sharedVarsMap.get(variableKey);
            if (value) { // Adiciona apenas se a chave compartilhada for encontrada
                headers[variableKey] = value;
            }
        });

        // Regra 3: Adiciona as variáveis específicas do agente (Agent Variables)
        activeAgent.variables.forEach(variable => {
            headers[variable.key] = variable.value;
        });
        
        // Passo A: Encontrar todos os provedores únicos baseados nos modelos do agente
        const providerNames = activeAgent.models.map(modelName => {
            const modelInfo = configStore.models.find(m => m.model === modelName);
            return modelInfo?.provider;
        }).filter((provider): provider is string => !!provider); // Filtra nulos/undefined e ajusta o tipo

        const uniqueProviderNames = [...new Set(providerNames)];

        // Passo B: Para cada provedor único, encontrar sua accessKey e adicionar ao header
        uniqueProviderNames.forEach(providerName => {
            const providerInfo = configStore.providers.find(p => p.provider === providerName);
            if (providerInfo && providerInfo.accessKey) {
                // Criamos um header dinâmico, ex: "Authorization-openai"
                const headerName = `Authorization-${providerInfo.provider}`;
                headers[headerName] = providerInfo.accessKey;
            }
        });

        const body = {
            // Reenviando as mensagens anteriores + a nova
            messages: [...convoStore.messages],
            // Adicionar aqui os links do agente ativo
        };

        // 4. Fazer a chamada com Axios
        const response = await axios.post(activeAgent.agentUrl, body, { headers });
        console.log(response.data);
        const agentResponse: Message = { type: 'agent', text: response.data.text }; // Ajuste conforme o retorno da sua API

        // 5. Adicionar resposta do agente ao store
        convoStore.addMessage(agentResponse);

    } catch (error) {
        console.error("Erro ao chamar o agente:", error);
        convoStore.addMessage({ type: 'agent', text: 'Desculpe, ocorreu um erro.' });
    } finally {
        // 6. Desativar o loading
        convoStore.setLoading(false);
    }
}