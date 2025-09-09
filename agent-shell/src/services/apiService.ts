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
            // Adicionar aqui a lógica para pegar chaves e variáveis do configStore
            // Ex: 'Authorization': `Bearer ${provider.accessKey}`
        };

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