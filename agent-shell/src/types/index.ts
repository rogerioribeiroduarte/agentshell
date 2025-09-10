export interface SharedVariable {
  name: string;
  key: string;
  value: string;
}

export interface SharedLink {
  name: string;
  key: string;
  URL: string;
}

export interface Provider {
  provider: string;
  accessKey: string;
}

export interface Model {
  model: string;
  provider: string;
}

// Mensagem para a conversa
export interface Message {
  type: 'user' | 'agent';
  text: string;
}

export interface Agent {
  id: string; // Adicionar um ID único é uma boa prática
  name: string; // E um nome para exibição
  agentUrl: string;
  welcomeText: string;
  models: string[];
  sharedVariables: string[];
  sharedLinks: string[];
  variables: { key: string; value: string }[];
  links: { key: string; URL: string }[];
}