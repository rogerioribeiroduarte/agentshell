# agentshell

Sample State
{
  "providers": [
    {
      "provider": "openai",
      "accessKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    {
      "provider": "google",
      "accessKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  ],
  "models": [
    {
      "model": "gpt-4o",
      "provider": "openai"
    },
    {
      "model": "gpt-3.5-turbo",
      "provider": "openai"
    },
    {
      "model": "gemini-1.5-pro",
      "provider": "google"
    }
  ],
  "sharedVariables": [
    {
      "name": "ID da Organização",
      "key": "X-Org-ID",
      "value": "ORG-ABC12345"
    }
  ],
  "sharedLinks": [
    {
      "name": "Documentação da API",
      "key": "doc_api_interna",
      "URL": "https://docs.suaempresa.com/api/v1"
    }
  ],
  "agents": [
    {
      "id": "agente-suporte-geral-01",
      "name": "Agente de Suporte Geral",
      "agentUrl": "https://f0a4a352000e.ngrok-free.app/echo",
      "welcomeText": "Olá! Sou o agente de suporte da Sua Empresa. Como posso ajudar você hoje?",
      "models": [
        "gpt-4o",
        "gpt-3.5-turbo"
      ],
      "sharedVariables": [
        "X-Org-ID"
      ],
      "sharedLinks": [
        "doc_api_interna"
      ],
      "variables": [
        {
          "key": "X-Department",
          "value": "Support"
        }
      ],
      "links": [
        {
          "key": "abrir_faq",
          "url": "https://suaempresa.com/faq"
        }
      ]
    }
  ]
}