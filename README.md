# AnimeWord - Jogo de Adivinhação de Animes

<p align="center">
  <img src="public/images/logo.png" alt="AnimeWord Logo" width="350" />
</p>

## Descrição

AnimeWord é um jogo de adivinhação de palavras estilo "forca" com temática de anime. Os jogadores tentam adivinhar nomes de animes, personagens, estúdios e termos relacionados ao universo dos animes, baseando-se em dicas. Desenvolvido com Next.js e React, o jogo oferece uma experiência divertida para os fãs de cultura japonesa.

## Funcionalidades

- **Multijogador Local**: Jogue com até 5 amigos no mesmo dispositivo
- **Diferentes Níveis de Dificuldade**: Fácil, Médio e Difícil
- **Modos de Jogo Variados**:
  - Padrão: Ao errar, passa a vez para o próximo jogador
  - Fixo: Cada jogador joga uma rodada inteira
  - Contínuo: Ao acertar, continua jogando
- **Temas Visuais Personalizáveis**:
  - Padrão
  - Modo Escuro
  - Neon
  - Retrô
- **Banco de Dados com mais de 50 palavras** relacionadas a animes, estúdios e terminologias
- **Sistema de Pontuação** para competição entre amigos
- **Avatares Customizáveis** para cada jogador

## Como Jogar

1. Selecione o número de jogadores (1-5)
2. Configure os nomes e avatares dos jogadores
3. Defina a pontuação necessária para vencer
4. Escolha o modo de jogo e o tema visual
5. Clique em "INICIAR DESAFIO"
6. Cada jogador tenta adivinhar letras da palavra ou arriscar a palavra completa
7. Ganhe pontos acertando letras e palavras
8. O primeiro jogador a atingir a pontuação definida vence!

## Regras

- Acertar uma letra = +1 ponto por ocorrência da letra
- Acertar a palavra completa = +10 pontos
- Errar uma letra = -5 pontos
- Errar um palpite de palavra completa = -50 pontos
- Cada jogador tem um limite de 5 erros por rodada
- O timer limita o tempo de cada jogada em 60 segundos

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) para componentes acessíveis
- [Lucide React](https://lucide.dev/) para ícones
- [Next Themes](https://github.com/pacocoursey/next-themes) para gerenciamento de temas

## Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/animeword.git

# Entre no diretório do projeto
cd animeword

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install

# Execute o servidor de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse `http://localhost:3000` no seu navegador para jogar.

## Estrutura do Projeto

- `app/` - Rotas e layout principal
- `components/` - Componentes React reutilizáveis
- `context/` - Context API para gerenciamento de estado global
- `public/` - Arquivos estáticos (imagens, etc.)
- `styles/` - Estilos CSS globais

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Créditos

Desenvolvido por Cria e Ettym durante um lapso de burnout.

---

<p align="center">
  Divirta-se adivinhando palavras do mundo dos animes! 🎮 🎯 🎭
</p>
