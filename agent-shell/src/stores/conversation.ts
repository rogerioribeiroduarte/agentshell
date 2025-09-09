// src/stores/conversation.ts
import { defineStore } from 'pinia';
import type { Message } from '@/types';

export const useConversationStore = defineStore('conversation', {
    state: () => ({
        messages: [] as Message[],
        isLoading: false,
    }),
    actions: {
        addMessage(message: Message) {
            this.messages.push(message);
        },
        clearMessages() {
            this.messages = [];
        },
        setLoading(status: boolean) {
            this.isLoading = status;
        }
    }
});