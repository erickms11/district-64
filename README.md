# 🏹 District 64 (Xadrez Arena Mobile P2P)

Jogo de xadrez para celular baseado na estética de arena e sobrevivência de *Jogos Vorazes (Hunger Games)*.
Desenvolvido como um **PWA (Progressive Web App)** de alto desempenho com partidas multiplayer online ponto-a-ponto via **PeerJS (WebRTC)**.

---

## 🚀 Funcionalidades do MVP

- ♟️ **Lógica Oficial do Xadrez:** 100% das regras da FIDE validadas com `chess.js` (roque, *en passant*, promoção de peões, xeque, xeque-mate e empate por afogamento).
- 🤖 **Batalha Contra a Capital (CPU Offline):**
  - Motor de IA embarcado rodando via algoritmo **Minimax com Poda Alfa-Beta** e tabelas de valor posicional (*Piece-Square Tables*).
  - 3 Níveis de dificuldade:
    - **Fácil (Recruta do Distrito):** Comete pequenos erros táticos e foca em trocas básicas.
    - **Médio (Pacificador da Capital):** Visão de 2 lances, avaliação posicional sólida.
    - **Difícil (Sentinela de Elite):** Visão tática profunda, controle de centro e segurança do Rei.
  - Escolha de lado: jogue com as Brancas (Distrito) ou Pretas (Infiltrado).
- 🌐 **Multiplayer P2P sem Servidor Central:**
  - O Jogador 1 clica em **Criar Sala Online** $\rightarrow$ gera um código curto (ex: `K8X2A`) ou link direto com parâmetro `?room=...`.
  - O Jogador 2 clica no link ou digita o código e conecta imediatamente por WebRTC.
  - Zero custo de backend de partida e latência mínima.
- 📱 **Mobile First & PWA:**
  - Instale direto na tela inicial do celular como aplicativo nativo (`standalone`).
  - Prevenção de gestos acidentais de zoom/arrasto com suporte a toque duplo preciso (*tap piece* $\rightarrow$ *tap target*).
  - Rotação dinâmica do tabuleiro para o jogador com as Pretas (ou manual via botão).
- 🔊 **Efeitos Sonoros Sintetizados (Web Audio API):**
  - Movimento de peças, capturas e alerta de xeque.
  - O clássico "Canhão dos Tributos Caídos" ao fim de cada partida.
  - Botão de mutar/desmutar a qualquer momento.
- 👥 **Modo Local (Pass & Play):**
  - Jogue com um amigo no mesmo celular alternando as jogadas.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **PWA:** `vite-plugin-pwa`
- **Rede P2P:** [PeerJS](https://peerjs.com/) (WebRTC DataChannels)
- **Motor de Xadrez:** [chess.js](https://github.com/jhlywa/chess.js)
- **Ícones & Efeitos:** `lucide-react`, `canvas-confetti`

---

## 🎯 Executando o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (acessível no celular via Wi-Fi)
npm run dev -- --host

# Build de produção (PWA com Service Worker)
npm run build
```

---

## 🔮 Próximos Passos (Evolução 3D)

Como a base foi construída em React + TypeScript com a camada de regras (`chess.js`) e rede (`peerService.ts`) totalmente desacopladas da interface:
1. Integrar **Three.js** via `@react-three/fiber` e `@react-three/drei`.
2. Substituir a grade 2D do `<Board />` por um cenário 3D com a Arena da Capital/Distrito 64.
3. Carregar modelos `.glb`/`.gltf` personalizados para as peças.
