"use client";

import type React from "react";
import { createContext, useState, useEffect } from "react";
import { useContext } from "react";

// Tipos
export type Difficulty = "Fácil" | "Médio" | "Difícil";
export type GameMode =
  | "Padrão (Erro = Próximo Jogador)"
  | "Fixo (cada jogador joga uma rodada inteira)"
  | "Contínuo (acerto = continua jogando)";
export type Theme = "Padrão" | "Modo Escuro" | "Neon" | "Retrô";

export type Player = {
  id: number;
  name: string;
  avatar: string;
  score: number;
  errors: number;
};

export type GameQuestion = {
  word: string;
  hint: string;
  difficulty: Difficulty;
};

// Banco de perguntas
const getGameQuestions = (): GameQuestion[] => {
  return [
    {
      word: "Log Horizon",
      hint: "MMORPG realista e estratégico",
      difficulty: "Médio",
    },
    {
      word: "Higurashi no Naku Koro ni",
      hint: "Mistérios em looping violento",
      difficulty: "Difícil",
    },
    {
      word: "Dantalian no Shoka",
      hint: "Demônios e biblioteca mágica",
      difficulty: "Médio",
    },
    {
      word: "Darwins Game",
      hint: "Casais em jogo de sobrevivência",
      difficulty: "Fácil",
    },
    {
      word: "Koukaku Kidoutai",
      hint: "Guerra entre ciborgues e humanos",
      difficulty: "Difícil",
    },
    {
      word: "Mahou Shoujo Madoka Magica",
      hint: "Garotas mágicas e sacrifícios",
      difficulty: "Médio",
    },
    {
      word: "Detective Conan",
      hint: "Detetive mirim e mistérios",
      difficulty: "Fácil",
    },
    {
      word: "Plastic Memories",
      hint: "Amor entre humanos e androides",
      difficulty: "Médio",
    },
    {
      word: "ReCreators",
      hint: "Personagens de histórias ganham vida",
      difficulty: "Difícil",
    },
    {
      word: "Shinya Shokudou",
      hint: "Restaurante só abre à meia-noite",
      difficulty: "Fácil",
    },
    {
      word: "Hataraku Maou sama",
      hint: "Rei demônio em Tóquio",
      difficulty: "Médio",
    },
    {
      word: "Kill la Kill",
      hint: "Uniformes com poderes e revolta",
      difficulty: "Difícil",
    },
    {
      word: "Aldnoah Zero",
      hint: "Conspiração militar e alienígenas",
      difficulty: "Médio",
    },
    {
      word: "Sen to Chihiro no Kamikakushi",
      hint: "Menina em mundo de espíritos",
      difficulty: "Fácil",
    },
    {
      word: "ReZero kara Hajimeru Isekai Seikatsu",
      hint: "Garoto preso em loop temporal com poderes",
      difficulty: "Difícil",
    },
    {
      word: "One Piece",
      hint: "Garoto quer ser o rei dos piratas",
      difficulty: "Fácil",
    },
    {
      word: "Mobile Suit Gundam",
      hint: "Robôs gigantes em guerra ideológica",
      difficulty: "Médio",
    },
    {
      word: "Tokyo Ghoul",
      hint: "Garoto com olhos amaldiçoados",
      difficulty: "Difícil",
    },
    {
      word: "Boku no Hero Academia",
      hint: "Escola de heróis com superpoderes",
      difficulty: "Fácil",
    },
    {
      word: "Naruto",
      hint: "Ninjas e bestas com cauda",
      difficulty: "Médio",
    },
    {
      word: "Shingeki no Kyojin",
      hint: "Espadachins contra titãs",
      difficulty: "Difícil",
    },
    {
      word: "Death Note",
      hint: "Garoto com caderno da morte",
      difficulty: "Médio",
    },
    {
      word: "Saiki Kusuo no Psi nan",
      hint: "Menina com poderes psíquicos é controlada pelo governo",
      difficulty: "Fácil",
    },
    {
      word: "Yakusoku no Neverland",
      hint: "Crianças tentam fugir de orfanato sinistro",
      difficulty: "Difícil",
    },
    {
      word: "Tensei Shitara Slime Datta Ken",
      hint: "Isekai com slime fofo",
      difficulty: "Médio",
    },
    {
      word: "Kono Subarashii Sekai ni Shukufuku wo",
      hint: "Garoto invocado em outro mundo com uma deusa",
      difficulty: "Fácil",
    },
    {
      word: "Soul Eater",
      hint: "Armas vivas que viram pessoas",
      difficulty: "Médio",
    },
    {
      word: "Steins Gate",
      hint: "Cientista louco e viagem no tempo",
      difficulty: "Difícil",
    },
    {
      word: "Sword Art Online",
      hint: "Jogo de realidade virtual mortal",
      difficulty: "Médio",
    },
    {
      word: "Jujutsu Kaisen",
      hint: "Garoto amaldiçoado por dedo demoníaco",
      difficulty: "Fácil",
    },
    {
      word: "Tokyo Ghoul",
      hint: "Cidade dominada por ghouls",
      difficulty: "Difícil",
    },
    {
      word: "Death Note",
      hint: "Garoto inteligente enfrenta um deus da destruição",
      difficulty: "Médio",
    },
    {
      word: "Noragami",
      hint: "Garoto e espírito do trovão se unem",
      difficulty: "Fácil",
    },
    {
      word: "Ao no Exorcist",
      hint: "Gêmeos exorcistas enfrentam demônios",
      difficulty: "Médio",
    },
    {
      word: "Darling in the FranXX",
      hint: "Meninas pilotam mechas em guerra",
      difficulty: "Difícil",
    },
    {
      word: "Violet Evergarden",
      hint: "Garota aprende sobre emoções entregando cartas",
      difficulty: "Médio",
    },
    {
      word: "Hunter x Hunter",
      hint: "Jovem perde tudo e luta em torneio de artes marciais",
      difficulty: "Fácil",
    },
    {
      word: "Fullmetal Alchemist Brotherhood",
      hint: "Dois irmãos tentam recuperar seus corpos",
      difficulty: "Médio",
    },
    {
      word: "Dororo",
      hint: "Samurai amaldiçoado busca vingança",
      difficulty: "Difícil",
    },
    {
      word: "Higurashi no Naku Koro ni",
      hint: "Garota vive looping de mortes",
      difficulty: "Médio",
    },
    {
      word: "Erased",
      hint: "Garoto viaja para tentar salvar amigos mortos",
      difficulty: "Fácil",
    },
    {
      word: "Fate Zero",
      hint: "Lutadores competem por um desejo",
      difficulty: "Difícil",
    },
    {
      word: "Mahou Shoujo Madoka Magica",
      hint: "Garotas mágicas enfrentam tragédias",
      difficulty: "Médio",
    },
    {
      word: "Shingeki no Kyojin",
      hint: "Humanos enfrentam titãs com equipamento especial",
      difficulty: "Fácil",
    },
    {
      word: "Tensei Shitara Slime Datta Ken",
      hint: "Reencarnação com poderes overpowered",
      difficulty: "Médio",
    },
    {
      word: "Ansatsu Kyoushitsu",
      hint: "Aluno morto vira professor de assassinos",
      difficulty: "Difícil",
    },
    {
      word: "Charlotte",
      hint: "Estudantes com superpoderes aleatórios",
      difficulty: "Médio",
    },
    {
      word: "Knights of Sidonia",
      hint: "Robôs gigantes no fundo do oceano",
      difficulty: "Fácil",
    },
    {
      word: "Spy x Family",
      hint: "Família de espiões improváveis",
      difficulty: "Médio",
    },
    {
      word: "Mirai Nikki",
      hint: "Jovens se matam por causa de app de celular",
      difficulty: "Difícil",
    },
    {
      word: "Code Geass",
      hint: "Jovens pilotam mechas em guerra civil",
      difficulty: "Médio",
    },
    {
      word: "No Game No Life",
      hint: "Garoto gênio perde tudo em jogo",
      difficulty: "Fácil",
    },
    {
      word: "Plastic Memories",
      hint: "Andróide que aprende a amar",
      difficulty: "Médio",
    },
    {
      word: "Shokugeki no Souma",
      hint: "Lutas de comida exageradas",
      difficulty: "Difícil",
    },
    {
      word: "Kekkai Sensen",
      hint: "Jovens vivem em cidade dividida por corações",
      difficulty: "Médio",
    },
    {
      word: "Kobayashi san Chi no Maid Dragon",
      hint: "Jovem e garota dragão convivem juntos",
      difficulty: "Fácil",
    },
    {
      word: "Elfen Lied",
      hint: "Garoto com vários braços invisíveis",
      difficulty: "Médio",
    },
    {
      word: "Koutetsujou no Kabaneri",
      hint: "Exército contra zumbis em trem blindado",
      difficulty: "Difícil",
    },
    {
      word: "Gintama",
      hint: "Samurais e aliens no Japão feudal futurista",
      difficulty: "Médio",
    },
    {
      word: "Danganronpa",
      hint: "Sobrevivência entre alunos sádicos",
      difficulty: "Fácil",
    },
    {
      word: "FLCL",
      hint: "Robô gigante com plug de música",
      difficulty: "Médio",
    },
    {
      word: "Chobits",
      hint: "Namorada é uma IA perfeita",
      difficulty: "Difícil",
    },
    {
      word: "Natsume Yuujinchou",
      hint: "Garoto ajuda fantasmas com seu diário",
      difficulty: "Médio",
    },
    {
      word: "Granblue Fantasy",
      hint: "Deusa e guerreira são invocadas para lutar",
      difficulty: "Fácil",
    },
    {
      word: "Astra Lost in Space",
      hint: "Criança alienígena é adotada por casal",
      difficulty: "Médio",
    },
    {
      word: "Detective School Q",
      hint: "Trio de garotas resolve crimes em Tóquio",
      difficulty: "Difícil",
    },
    {
      word: "Sora wo Miageru Shoujo no Hitomi ni Utsuru Sekai",
      hint: "Equipe de garotas viaja pelo espaço",
      difficulty: "Médio",
    },
    {
      word: "Pocket Monsters",
      hint: "Jovem quer ser mestre Pokémon",
      difficulty: "Fácil",
    },
    {
      word: "Nanatsu no Taizai",
      hint: "Estudante vira demônio e começa a guerra santa",
      difficulty: "Médio",
    },
    {
      word: "Sakurada Reset",
      hint: "Adolescente com poder de apagar memórias",
      difficulty: "Difícil",
    },
    {
      word: "Chihayafuru",
      hint: "Estudantes descobrem o valor da poesia",
      difficulty: "Médio",
    },
    {
      word: "Rurouni Kenshin",
      hint: "Espadachim amaldiçoado busca redenção",
      difficulty: "Fácil",
    },
    {
      word: "Grimgar Ashes and Illusions",
      hint: "Jovem acorda sem memória em mundo de fantasia",
      difficulty: "Médio",
    },
    {
      word: "Zombieland Saga",
      hint: "Idols virtuais conquistam o mundo",
      difficulty: "Difícil",
    },
    {
      word: "Idoly Pride",
      hint: "Jovem treina para se tornar idol de sucesso",
      difficulty: "Médio",
    },
    {
      word: "The Price of Smiles",
      hint: "Donzela busca vingança com ajuda de robôs",
      difficulty: "Fácil",
    },
    {
      word: "Maoujou de Oyasumi",
      hint: "Garota é sequestrada para casar com um rei demônio",
      difficulty: "Médio",
    },
    {
      word: "Bungou Stray Dogs",
      hint: "Jovem com habilidades estranhas luta contra organizações secretas",
      difficulty: "Difícil",
    },
    {
      word: "ReLIFE",
      hint: "Garoto revive a mesma semana para salvar a amiga",
      difficulty: "Médio",
    },
    {
      word: "Haruhi Suzumiya no Yuuutsu",
      hint: "Jovem repete seu dia várias vezes sem querer",
      difficulty: "Fácil",
    },
    {
      word: "Shoujo Shuumatsu Ryokou",
      hint: "Garotas vivem em mundo pós-apocalíptico",
      difficulty: "Médio",
    },
    {
      word: "Kyoukai no Kanata",
      hint: "Jovem com poderes espirituais ajuda fantasmas",
      difficulty: "Difícil",
    },
    {
      word: "Guilty Crown",
      hint: "Casal adolescente sobrevive em ilha misteriosa",
      difficulty: "Médio",
    },
    {
      word: "Persona 5 The Animation",
      hint: "Ladrões roubam corações corruptos",
      difficulty: "Fácil",
    },
    {
      word: "Angel Beats",
      hint: "Garoto em coma vive em mundo alternativo",
      difficulty: "Médio",
    },
    {
      word: "Ajin",
      hint: "Jovem começa a ver monstros após quase morrer",
      difficulty: "Difícil",
    },
    {
      word: "Kimetsu no Yaiba",
      hint: "Jovem possui poderes ocultos herdados",
      difficulty: "Médio",
    },
    {
      word: "Tales of Zestiria the X",
      hint: "Família viaja entre mundos resolvendo crimes mágicos",
      difficulty: "Fácil",
    },
    {
      word: "Soul Eater",
      hint: "Mundo onde as pessoas viram armas",
      difficulty: "Médio",
    },
    {
      word: "Planetarian",
      hint: "Menina faz amizade com IA de uma nave espacial",
      difficulty: "Difícil",
    },
    {
      word: "Cardcaptor Sakura",
      hint: "Jovem se torna mestre de cartas mágicas",
      difficulty: "Médio",
    },
    {
      word: "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai",
      hint: "Jovem lida com morte de sua melhor amiga",
      difficulty: "Fácil",
    },
    {
      word: "Made in Abyss",
      hint: "Jovens precisam explorar uma prisão vertical",
      difficulty: "Médio",
    },
    {
      word: "Senki Zesshou Symphogear",
      hint: "Jovem com armadura mágica enfrenta vilões",
      difficulty: "Difícil",
    },
    {
      word: "Aokana Four Rhythm Across the Blue",
      hint: "Escola só para garotas com superpoderes",
      difficulty: "Médio",
    },
    {
      word: "To LOVE Ru",
      hint: "Estudante se envolve com alienígenas misteriosos",
      difficulty: "Fácil",
    },
    {
      word: "Youkai Apartment no Yuuga na Nichijou",
      hint: "Jovem e criaturas sobrenaturais convivem no mesmo templo",
      difficulty: "Médio",
    },
    {
      word: "Tamayura",
      hint: "Jovem tenta se tornar o melhor fotógrafo",
      difficulty: "Difícil",
    },
    {
      word: "Rage of Bahamut Genesis",
      hint: "Jovem sobrevive em mundo medieval com dragões",
      difficulty: "Médio",
    },
    {
      word: "Hamefura Otome Game no Hametsu Flag",
      hint: "Donzela reencarna como vilã de otome game",
      difficulty: "Fácil",
    },
    {
      word: "Irozuku Sekai no Ashita kara",
      hint: "Menina vive em cidade sem cores",
      difficulty: "Médio",
    },
    {
      word: "Infinite Dendrogram",
      hint: "Jovem descobre que está preso em simulação de jogo",
      difficulty: "Difícil",
    },
    {
      word: "Inuyashiki",
      hint: "Idoso se transforma em herói sobre-humano",
      difficulty: "Médio",
    },
    {
      word: "Sola",
      hint: "Jovem encontra clone de sua amada morta",
      difficulty: "Fácil",
    },
    {
      word: "Karas",
      hint: "Garoto revive após ser morto por robô",
      difficulty: "Médio",
    },
    {
      word: "Juuni Taisen",
      hint: "Jovens enfrentam dilemas filosóficos em duelos",
      difficulty: "Difícil",
    },
    {
      word: "High Score Girl",
      hint: "Grupo de garotas tenta salvar loja de arcade",
      difficulty: "Médio",
    },
    {
      word: "Isekai Maou to Shoukan Shoujo no Dorei Majutsu",
      hint: "Jovem se torna lorde de demônios por acidente",
      difficulty: "Fácil",
    },
    {
      word: "Bakumatsu",
      hint: "Samurai moderno busca vingança em Tóquio",
      difficulty: "Médio",
    },
    {
      word: "Kamisama no Inai Nichiyoubi",
      hint: "Jovem vira amigo de um espírito kitsune",
      difficulty: "Difícil",
    },
    {
      word: "Magical Girl Raising Project",
      hint: "Garota é forçada a entrar em reality show mortal",
      difficulty: "Médio",
    },
    {
      word: "Parasyte the maxim",
      hint: "Jovens enfrentam parasitas espaciais",
      difficulty: "Fácil",
    },
    {
      word: "Jibaku Shounen Hanako kun",
      hint: "Garota começa a ver demônios após acidente",
      difficulty: "Médio",
    },
    {
      word: "Redline",
      hint: "Jovens correm em corridas futuristas ilegais",
      difficulty: "Difícil",
    },
    {
      word: "Uchuu Kyoudai",
      hint: "Menina lida com a morte do pai astronauta",
      difficulty: "Médio",
    },
    {
      word: "Tenjou Tenge",
      hint: "Jovem herda dojo e rivaliza com gangues",
      difficulty: "Fácil",
    },
    {
      word: "Great Teacher Onizuka",
      hint: "Estudante é confundido com delinquente",
      difficulty: "Médio",
    },
    {
      word: "Enen no Shouboutai",
      hint: "Jovem acorda com poderes de fogo",
      difficulty: "Difícil",
    },
    {
      word: "Kimetsu Gakuen Monogatari",
      hint: "Garoto busca a cura para sua irmã demoníaca",
      difficulty: "Médio",
    },
    {
      word: "Symphogear GX",
      hint: "Robôs são movidos a música",
      difficulty: "Fácil",
    },
    {
      word: "C Control",
      hint: "Jovem tenta impedir o fim do mundo com aplicativo",
      difficulty: "Médio",
    },
    {
      word: "Terra e",
      hint: "Jovem acorda em outro planeta e luta para sobreviver",
      difficulty: "Difícil",
    },
    {
      word: "Boogiepop wa Warawanai",
      hint: "Jovens enfrentam criaturas nas sombras",
      difficulty: "Médio",
    },
    {
      word: "Ushio to Tora",
      hint: "Jovem com braço amaldiçoado enfrenta monstros",
      difficulty: "Fácil",
    },
    {
      word: "Yu Gi Oh",
      hint: "Jovem quer ser o rei dos duelistas",
      difficulty: "Médio",
    },
    {
      word: "Shaman King",
      hint: "Lutadores protegem relíquias ancestrais",
      difficulty: "Difícil",
    },
    {
      word: "Magical Girl Site",
      hint: "Garota tenta escapar de mundo de tortura",
      difficulty: "Médio",
    },
    {
      word: "Sidonia no Kishi",
      hint: "Jovem entra no exército espacial",
      difficulty: "Fácil",
    },
    {
      word: "Katanagatari",
      hint: "Samurais vivem em mundo alternativo após grande catástrofe",
      difficulty: "Médio",
    },
    {
      word: "Maou Gakuin no Futekigousha",
      hint: "Jovem e princesa demônio fogem juntos",
      difficulty: "Difícil",
    },
    {
      word: "Kanata no Astra",
      hint: "Viagem espacial com passageiros em sono criogênico",
      difficulty: "Médio",
    },
    {
      word: "Ninja Slayer from Animation",
      hint: "Luta de ninjas com animações experimentais",
      difficulty: "Fácil",
    },
    {
      word: "Kaiba",
      hint: "Grupo de garotas descobre antiga civilização subterrânea",
      difficulty: "Médio",
    },
    {
      word: "Patema Inverted",
      hint: "Jovem tenta proteger cidade flutuante",
      difficulty: "Difícil",
    },
    {
      word: "Bleach",
      hint: "Garoto se torna shinigami substituto",
      difficulty: "Médio",
    },
    {
      word: "Eizouken ni wa Te wo Dasu na",
      hint: "Jovens correm atrás de sonhos em estúdio de animação",
      difficulty: "Fácil",
    },
    {
      word: "Mob Psycho 100",
      hint: "Garoto é amaldiçoado por espírito vingativo",
      difficulty: "Médio",
    },
    {
      word: "Dance in the Vampire Bund",
      hint: "Jovem luta contra lobisomens modernos",
      difficulty: "Difícil",
    },
    {
      word: "Heat Guy J",
      hint: "Jovem e cão-robô investigam crimes",
      difficulty: "Médio",
    },
    {
      word: "InuYasha",
      hint: "Estudante viaja para o Japão feudal",
      difficulty: "Fácil",
    },
    {
      word: "Tsukuyomi Moon Phase",
      hint: "Jovem se apaixona por uma vampira",
      difficulty: "Médio",
    },
    {
      word: "Phantom Requiem for the Phantom",
      hint: "Dupla de assassinos com memória perdida",
      difficulty: "Difícil",
    },
    {
      word: "Air Gear",
      hint: "Lutadores controlam elementos em arena de batalha",
      difficulty: "Médio",
    },
    {
      word: "Desert Punk",
      hint: "Garoto busca a verdade em mundo desértico",
      difficulty: "Fácil",
    },
    {
      word: "Dimension W",
      hint: "Jovens descobrem portais para mundos paralelos",
      difficulty: "Médio",
    },
    {
      word: "Gantz",
      hint: "Investigadores enfrentam seres invisíveis",
      difficulty: "Difícil",
    },
    {
      word: "Zegapain",
      hint: "Crianças pilotam robôs gigantes em guerra",
      difficulty: "Médio",
    },
    {
      word: "ReCreators",
      hint: "Garoto revive dentro de videogame antigo",
      difficulty: "Fácil",
    },
    {
      word: "Scrapped Princess",
      hint: "Jovem perde tudo após ataque de criaturas mágicas",
      difficulty: "Médio",
    },
    {
      word: "Planet With",
      hint: "Garoto acorda como o último humano vivo",
      difficulty: "Difícil",
    },
    {
      word: "Beelzebub",
      hint: "Jovem é treinado por demônio em artes marciais",
      difficulty: "Médio",
    },
    {
      word: "Kimi no Na wa",
      hint: "Dois jovens trocam de corpo sem explicação",
      difficulty: "Fácil",
    },
    {
      word: "Ga Rei Zero",
      hint: "Jovem é escolhido por relíquia maldita",
      difficulty: "Médio",
    },
    {
      word: "Planetes",
      hint: "Garota vive sozinha em estação espacial abandonada",
      difficulty: "Difícil",
    },
    {
      word: "Kemono no Souja Erin",
      hint: "Jovem encontra ser divino em floresta isolada",
      difficulty: "Médio",
    },
    {
      word: "Busou Renkin",
      hint: "Jovem deseja reviver sua irmã por meio da alquimia",
      difficulty: "Fácil",
    },
    {
      word: "Ghost Hunt",
      hint: "Estudantes investigam mistérios com sobrenatural",
      difficulty: "Médio",
    },
    {
      word: "Tensei Oujo to Tensai Reijou no Mahou Kakumei",
      hint: "Garota renasce em mundo de fantasia como nobre",
      difficulty: "Difícil",
    },
    {
      word: "Kujira no Kora wa Sajou ni Utau",
      hint: "Jovem ajuda espíritos a descansar em paz",
      difficulty: "Médio",
    },
    {
      word: "Chobits",
      hint: "Robôs pequenos com personalidade própria",
      difficulty: "Fácil",
    },
    {
      word: "Tengen Toppa Gurren Lagann",
      hint: "Jovem entra em torneio intergaláctico",
      difficulty: "Médio",
    },
    {
      word: "Ikkitousen",
      hint: "Garota luta contra invasores de outra dimensão",
      difficulty: "Difícil",
    },
    {
      word: "Macross Frontier",
      hint: "Jovem tenta impedir invasão alienígena com música",
      difficulty: "Médio",
    },
    {
      word: "Last Exile",
      hint: "Jovens enfrentam desafios em navio voador",
      difficulty: "Difícil",
    },
    {
      word: "Black Cat",
      hint: "Caçadores enfrentam monstros de aluguel",
      difficulty: "Difícil",
    },
    {
      word: "Shiroi Suna no Aquatope",
      hint: "Garota vira gerente de aquário",
      difficulty: "Difícil",
    },
    {
      word: "Sora no Woto",
      hint: "Garota se comunica com alienígena por rádio antigo",
      difficulty: "Difícil",
    },
    {
      word: "Violet Evergarden",
      hint: "Menina sem emoções em guerra",
      difficulty: "Médio",
    },
    {
      word: "Deadman Wonderland",
      hint: "Prisão flutuante e batalhas violentas",
      difficulty: "Médio",
    },
    {
      word: "Baka to Test to Shoukanjuu",
      hint: "Alunos lutam com poderes",
      difficulty: "Fácil",
    },
    {
      word: "Shuumatsu no Walküre",
      hint: "Deuses contra humanos",
      difficulty: "Médio",
    },
    {
      word: "Fune wo Amu",
      hint: "Dicionário muda vidas",
      difficulty: "Difícil",
    },
    {
      word: "Samurai Champloo",
      hint: "Samurais com hip hop",
      difficulty: "Médio",
    },
    {
      word: "Tasogare Otome x Amnesia",
      hint: "Vídeos amaldiçoados",
      difficulty: "Médio",
    },
    {
      word: "Shinsekai Yori",
      hint: "Mundo governado por 'fiends'",
      difficulty: "Difícil",
    },
    {
      word: "Shiroi Suna no Aquatope",
      hint: "Amizade em aquário tropical",
      difficulty: "Fácil",
    },
    {
      word: "Texhnolyze",
      hint: "Robôs e filosofia",
      difficulty: "Difícil",
    },
    {
      word: "Girls und Panzer",
      hint: "Meninas pilotam tanques",
      difficulty: "Fácil",
    },
    {
      word: "Shigatsu wa Kimi no Uso",
      hint: "Músico cego prodígio",
      difficulty: "Médio",
    },
    {
      word: "Bakuman",
      hint: "Vida de mangakás iniciantes",
      difficulty: "Fácil",
    },
    {
      word: "Subete ga F ni Naru",
      hint: "Crimes resolvidos com lógica",
      difficulty: "Difícil",
    },
    {
      word: "Ergo Proxy",
      hint: "Mundo sombrio e existencialismo",
      difficulty: "Difícil",
    },
    {
      word: "Tokyo Tribe 2",
      hint: "Gangues em Tóquio futurista",
      difficulty: "Médio",
    },
    {
      word: "FLCL",
      hint: "Humor insano e experimental",
      difficulty: "Difícil",
    },
    {
      word: "Beastars",
      hint: "Animais antropomorfizados",
      difficulty: "Fácil",
    },
    {
      word: "K-On!",
      hint: "Garotas e música fofa",
      difficulty: "Fácil",
    },
    {
      word: "Made in Abyss",
      hint: "Aventura em abismo misterioso",
      difficulty: "Médio",
    },
    {
      word: "Higurashi no Naku Koro ni",
      hint: "Assassinatos em looping temporal",
      difficulty: "Difícil",
    },
    {
      word: "3-gatsu no Lion",
      hint: "Xadrez japonês e drama",
      difficulty: "Médio",
    },
    {
      word: "Soul Eater Not!",
      hint: "Meninas em colégio excêntrico",
      difficulty: "Fácil",
    },
    {
      word: "Boku dake ga Inai Machi",
      hint: "Criança volta ao passado pra evitar crime",
      difficulty: "Médio",
    },
    {
      word: "Gochuumon wa Usagi Desu ka?",
      hint: "Cafeteria com garotas adoráveis",
      difficulty: "Fácil",
    },
    {
      word: "Fractale",
      hint: "Liberdade contra sistema digital",
      difficulty: "Difícil",
    },
    {
      word: "Kakumeiki Valvrave",
      hint: "Realidade aumentada + guerra",
      difficulty: "Médio",
    },
    {
      word: "Seirei no Moribito",
      hint: "Guarda-costas e espíritos",
      difficulty: "Médio",
    },
    {
      word: "Eve no Jikan",
      hint: "Androids e emoções humanas",
      difficulty: "Difícil",
    },
    {
      word: "Ben-To",
      hint: "Lutas por comida em supermercado",
      difficulty: "Fácil",
    },
    {
      word: "Mahoutsukai no Yome",
      hint: "Magia, dragões e noivas",
      difficulty: "Médio",
    },
    {
      word: "Hai to Gensou no Grimgar",
      hint: "Fantasia realista de RPG",
      difficulty: "Médio",
    },
    {
      word: "Yuri!!! on Ice",
      hint: "Patinação artística com drama",
      difficulty: "Fácil",
    },
    {
      word: "Hataraku Maou-sama!",
      hint: "Rei demônio trabalha em fast-food",
      difficulty: "Fácil",
    },
    {
      word: "Strike Witches",
      hint: "Aviões e garotas mágicas",
      difficulty: "Médio",
    },
    {
      word: "Mirai Nikki",
      hint: "Celulares e jogo mortal",
      difficulty: "Médio",
    },
    {
      word: "Natsume Yuujinchou",
      hint: "Jovem vê e ajuda espíritos",
      difficulty: "Fácil",
    },
    {
      word: "Kuroshitsuji",
      hint: "Mordomo demoníaco",
      difficulty: "Médio",
    },
    {
      word: "Shoujo Shuumatsu Ryokou",
      hint: "Amizade em mundo arruinado",
      difficulty: "Médio",
    },
    {
      word: "Prince of Tennis",
      hint: "Tênis ao estilo superpoderes",
      difficulty: "Fácil",
    },
    {
      word: "Ansatsu Kyoushitsu",
      hint: "Escola para assassinos",
      difficulty: "Fácil",
    },
    {
      word: "Rakuen Tsuihou",
      hint: "IA protegendo a Terra",
      difficulty: "Médio",
    },
    {
      word: "Dragon Crisis!",
      hint: "Dragões e humanos em escola",
      difficulty: "Fácil",
    },
    {
      word: "Chihayafuru",
      hint: "Poesia japonesa como esporte",
      difficulty: "Médio",
    },
    {
      word: "Mujin Wakusei Survive",
      hint: "Sobrevivência em planeta isolado",
      difficulty: "Médio",
    },
    {
      word: "Noragami",
      hint: "Deus menor busca fiéis",
      difficulty: "Fácil",
    },
    {
      word: "Kantai Collection",
      hint: "Garotas-navio em batalha",
      difficulty: "Médio",
    },
    {
      word: "Gintama",
      hint: "Samurai cômico em Tóquio alternativo",
      difficulty: "Fácil",
    },
    {
      word: "Chaos;Head",
      hint: "Garoto com múltiplas personalidades",
      difficulty: "Difícil",
    },
    {
      word: "Mahouka Koukou no Rettousei",
      hint: "Garota controla gravidade",
      difficulty: "Médio",
    },
    {
      word: "Bungou Stray Dogs",
      hint: "Escritores com superpoderes",
      difficulty: "Fácil",
    },
    {
      word: "Karas",
      hint: "Teatro de fantoches amaldiçoado",
      difficulty: "Difícil",
    },
    {
      word: "No Game No Life",
      hint: "Irmãos gênios em outro mundo",
      difficulty: "Fácil",
    },
    {
      word: "Guilty Crown",
      hint: "Vírus transforma humanos em armas",
      difficulty: "Médio",
    },
    {
      word: "Campione!",
      hint: "Deuses duelam por culinária",
      difficulty: "Médio",
    },
    {
      word: "Ao no Exorcist",
      hint: "Exorcistas adolescentes",
      difficulty: "Fácil",
    },
    {
      word: "Eureka Seven",
      hint: "Robô gigante em forma animal",
      difficulty: "Médio",
    },
    {
      word: "Yuuki Yuuna wa Yuusha de Aru",
      hint: "Garotas e poderes místicos",
      difficulty: "Médio",
    },
    {
      word: "Shirobako",
      hint: "Dublagem e bastidores do anime",
      difficulty: "Fácil",
    },
    {
      word: "Kaiji",
      hint: "Jogo de apostas e desespero",
      difficulty: "Médio",
    },
    {
      word: "Serial Experiments Lain",
      hint: "Existencialismo em rede virtual",
      difficulty: "Difícil",
    },
    {
      word: "Kamisama Hajimemashita",
      hint: "Deuses e humanos juntos",
      difficulty: "Fácil",
    },
    {
      word: "Senki Zesshou Symphogear",
      hint: "Música como arma",
      difficulty: "Médio",
    },
    {
      word: "Tensei Shitara Slime Datta Ken",
      hint: "Anime do garoto que vira um slime",
      difficulty: "Fácil",
    },
    {
      word: "Wolf's Rain",
      hint: "Garotos convivem com lobos em um mundo pós-apocalíptico",
      difficulty: "Médio",
    },
    {
      word: "Blame!",
      hint: "Robô e garota em mundo destruído",
      difficulty: "Difícil",
    },
    {
      word: "Psycho-Pass",
      hint: "Detetive e IA em uma sociedade autoritária",
      difficulty: "Médio",
    },
    {
      word: "Gakkou Gurashi!",
      hint: "Zumbis invadem colégio de garotas",
      difficulty: "Fácil",
    },
    {
      word: "Toriko",
      hint: "Culinária + artes marciais",
      difficulty: "Fácil",
    },
    {
      word: "C: The Money of Soul and Possibility Control",
      hint: "Garoto entra em mundo econômico espiritual",
      difficulty: "Difícil",
    },
    {
      word: "Elfen Lied",
      hint: "Menina com braços invisíveis assassinos",
      difficulty: "Médio",
    },
    {
      word: "Kakegurui",
      hint: "Apostas escolares bizarras",
      difficulty: "Fácil",
    },
    {
      word: "Mahou Shoujo Site",
      hint: "Garotas mágicas em versão sombria",
      difficulty: "Médio",
    },
  ];
};

// Avatares disponíveis
export const avatars = [
  "/images/avatars/devFront.png",
  "/images/avatars/devJs.png",
  "/images/avatars/devRust.png",
  "/images/avatars/analistadeRedes.png",
  "/images/avatars/analistadeDados.png",
  "/images/avatars/nerdola.png",
  "/images/avatars/irritado.png",
  "/images/avatars/dracula.png",
  "/images/avatars/homemTranquilo.png",
];

// Interface do contexto
interface GameContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
  pointsToWin: number;
  setPointsToWin: React.Dispatch<React.SetStateAction<number>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  visualTheme: Theme;
  setVisualTheme: React.Dispatch<React.SetStateAction<Theme>>;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  currentQuestion: GameQuestion | null;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<GameQuestion | null>>;
  guessedLetters: string[];
  setGuessedLetters: React.Dispatch<React.SetStateAction<string[]>>;
  wrongLetters: string[];
  setWrongLetters: React.Dispatch<React.SetStateAction<string[]>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  getRandomQuestion: () => GameQuestion;
  checkWin: () => boolean;
  makeGuess: (letter: string) => void;
  guessWord: (word: string) => void;
  nextPlayer: () => void;
  resetGame: () => void;
  startNewRound: () => void;
  applyTheme: () => void;
  getCurrentPlayerErrors: () => number;
  getRandomAvatar: () => string;
  usedQuestions: string[];
  setUsedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
}

// Função para obter um avatar aleatório
const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

// Criação do contexto
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider do contexto
export function GameProvider({ children }: { children: React.ReactNode }) {
  // Inicializar as perguntas apenas quando o componente é montado
  const [questions] = useState(getGameQuestions);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Jogador 1",
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    },
    {
      id: 2,
      name: "Jogador 2",
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    },
  ]);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [pointsToWin, setPointsToWin] = useState(100);
  const [gameMode, setGameMode] = useState<GameMode>(
    "Padrão (Erro = Próximo Jogador)"
  );
  const [visualTheme, setVisualTheme] = useState<Theme>("Padrão");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
    null
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("Médio");
  // Adicionar estado para controlar o modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Aplicar tema visual
  const applyTheme = () => {
    const root = document.documentElement;

    // Remover todas as classes de tema
    root.classList.remove("dark", "neon", "retro", "gartic");

    // Aplicar o tema selecionado
    switch (visualTheme) {
      case "Modo Escuro":
        root.classList.add("dark");
        break;
      case "Neon":
        root.classList.add("neon");
        break;
      case "Retrô":
        root.classList.add("retro");
        break;
      default:
        // Tema padrão, adicionar gartic como padrão
        root.classList.add("gartic");
        break;
    }
  };

  // Efeito para aplicar o tema quando ele mudar
  useEffect(() => {
    applyTheme();
  }, [visualTheme]);

  // Obter uma pergunta aleatória
  const getRandomQuestion = (): GameQuestion => {
    // Filtrar perguntas que ainda não foram usadas (sem filtrar por dificuldade)
    let filteredQuestions = questions.filter(
      (q) => !usedQuestions.includes(q.word)
    );

    // Se todas as perguntas já foram usadas
    if (filteredQuestions.length === 0) {
      // Se não houver mais perguntas disponíveis
      // Remover as últimas 3 perguntas usadas para evitar repetição imediata
      const lastThreeQuestions = usedQuestions.slice(-3);
      filteredQuestions = questions.filter(
        (q) => !lastThreeQuestions.includes(q.word)
      );

      // Se ainda não houver perguntas disponíveis, resetar completamente
      if (filteredQuestions.length === 0) {
        setUsedQuestions([]);
        filteredQuestions = questions;
      }
    }

    // Embaralhar as perguntas filtradas para maior aleatoriedade
    const shuffledQuestions = [...filteredQuestions].sort(
      () => Math.random() - 0.5
    );

    // Selecionar uma pergunta aleatória
    const question = shuffledQuestions[0];

    // Adicionar a palavra à lista de perguntas usadas
    setUsedQuestions((prev) => [...prev, question.word]);

    // Limpar a palavra para remover possíveis caracteres de nova linha e converter para maiúsculo
    return {
      ...question,
      word: question.word.trim().toUpperCase(),
    };
  };

  // Função para testar a distribuição de perguntas
  const testQuestionDistribution = () => {
    const testResults = {
      totalQuestions: 0,
      repeatedQuestions: 0,
      lastThreeQuestions: [] as string[],
      distribution: {} as Record<string, number>,
    };

    // Simular 100 perguntas
    for (let i = 0; i < 100; i++) {
      const question = getRandomQuestion();
      testResults.totalQuestions++;

      // Verificar repetição nas últimas 3 perguntas
      if (testResults.lastThreeQuestions.includes(question.word)) {
        testResults.repeatedQuestions++;
      }

      // Atualizar últimas 3 perguntas
      testResults.lastThreeQuestions = [
        question.word,
        ...testResults.lastThreeQuestions.slice(0, 2),
      ];

      // Contar distribuição
      testResults.distribution[question.word] =
        (testResults.distribution[question.word] || 0) + 1;
    }

    console.log("Resultados do teste de distribuição:", testResults);
    return testResults;
  };

  // Obter o número de erros do jogador atual
  const getCurrentPlayerErrors = () => {
    // Verificar se o índice é válido e se o jogador existe
    if (
      currentPlayerIndex >= 0 &&
      currentPlayerIndex < players.length &&
      players[currentPlayerIndex]
    ) {
      return players[currentPlayerIndex].errors;
    }
    return 0; // Retornar 0 como valor padrão se o jogador não existir
  };

  // Verificar se o jogador ganhou
  const checkWin = (): boolean => {
    if (!currentQuestion) return false;

    return currentQuestion.word
      .toUpperCase()
      .split("")
      .every((letter) => letter === " " || guessedLetters.includes(letter));
  };

  // Modificar a função makeGuess para incluir diretamente a lógica de erros máximos
  const makeGuess = (letter: string) => {
    // Converter a letra para maiúsculo
    const upperCaseLetter = letter.toUpperCase();

    if (
      guessedLetters.includes(upperCaseLetter) ||
      wrongLetters.includes(upperCaseLetter)
    ) {
      return;
    }

    if (
      currentQuestion &&
      currentQuestion.word.toUpperCase().includes(upperCaseLetter)
    ) {
      setGuessedLetters([...guessedLetters, upperCaseLetter]);

      // Adicionar pontos ao jogador atual
      const occurrences = currentQuestion.word
        .toUpperCase()
        .split("")
        .filter((l) => l === upperCaseLetter).length;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += occurrences;

      // Verificar se o jogador atingiu a pontuação para vitória
      if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
        setPlayers(updatedPlayers);
        setGameOver(true);
        return;
      }

      setPlayers(updatedPlayers);

      // Verificar se ganhou a rodada
      // Modificado para ignorar espaços na verificação de vitória
      if (
        currentQuestion.word
          .toUpperCase()
          .split("")
          .every(
            (l) =>
              l === " " || guessedLetters.includes(l) || l === upperCaseLetter
          )
      ) {
        // Adicionar pontos bônus por completar a palavra
        updatedPlayers[currentPlayerIndex].score += 10;

        // Verificar novamente se o jogador atingiu a pontuação para vitória após o bônus
        if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
          setPlayers(updatedPlayers);
          setGameOver(true);
          return;
        }

        setPlayers(updatedPlayers);

        // Mostrar modal de sucesso
        setShowSuccessModal(true);
      }

      // Se o modo for "Contínuo", o jogador continua
      // Se for "Padrão" ou "Fixo", depende da lógica abaixo
    } else {
      setWrongLetters([...wrongLetters, upperCaseLetter]);

      // Subtrair pontos por erro - ALTERADO PARA -1 PONTO
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score = Math.max(
        0,
        updatedPlayers[currentPlayerIndex].score - 1
      );

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1;
      setPlayers(updatedPlayers);

      // Verificar se o jogador atingiu o número máximo de erros baseado na dificuldade
      const maxErrors =
        difficulty === "Fácil" ? 8 : difficulty === "Médio" ? 6 : 4;
      if (updatedPlayers[currentPlayerIndex].errors >= maxErrors) {
        setGameOver(true);
        return;
      }

      // No modo padrão, passa para o próximo jogador ao errar
      if (gameMode === "Padrão (Erro = Próximo Jogador)") {
        nextPlayer();
      }
    }
  };

  // Modificar a função guessWord para incluir diretamente a lógica de erros máximos
  const guessWord = (word: string) => {
    // Converter a palavra digitada para maiúsculo
    const upperCaseWord = word.toUpperCase();

    if (
      currentQuestion &&
      upperCaseWord === currentQuestion.word.toUpperCase()
    ) {
      // Acertou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10; // Bônus por acertar a palavra completa

      // Verificar se o jogador atingiu a pontuação para vitória
      if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
        setPlayers(updatedPlayers);
        setGameOver(true);
        return;
      }

      setPlayers(updatedPlayers);

      // Mostrar modal de sucesso
      setShowSuccessModal(true);
    } else {
      // Errou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score = Math.max(
        0,
        updatedPlayers[currentPlayerIndex].score - 50
      );

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1;
      setPlayers(updatedPlayers);

      // Verificar se o jogador atingiu o número máximo de erros baseado na dificuldade
      const maxErrors =
        difficulty === "Fácil" ? 8 : difficulty === "Médio" ? 6 : 4;
      if (updatedPlayers[currentPlayerIndex].errors >= maxErrors) {
        setGameOver(true);
        return;
      }

      // Passa para o próximo jogador
      nextPlayer();
    }
  };

  // Atualizar a função resetGame para considerar a dificuldade
  const resetGame = () => {
    setCurrentQuestion(getRandomQuestion());
    setGuessedLetters([]);
    setWrongLetters([]);
    setTimeLeft(60);
    setGameOver(false);
    setUsedQuestions([]); // Limpar perguntas usadas ao reiniciar

    // Resetar apenas os erros, mantendo os pontos
    setPlayers(players.map((player) => ({ ...player, errors: 0 })));
  };

  // Modificar a função startNewRound para usar um timeout
  const startNewRound = () => {
    // Verificar se algum jogador atingiu a pontuação para vitória
    const winner = players.find((player) => player.score >= pointsToWin);
    if (winner) {
      setGameOver(true);
      return;
    }

    // Usar setTimeout para garantir que o modal esteja fechado antes de mostrar a nova pergunta
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setGuessedLetters([]);
      setWrongLetters([]);
      setTimeLeft(60);
      setShowSuccessModal(false);

      // Resetar os erros de todos os jogadores para a nova rodada
      const updatedPlayers = [...players];
      updatedPlayers.forEach((player) => {
        player.errors = 0;
      });
      setPlayers(updatedPlayers);
    }, 300); // 300ms de delay para garantir que o modal esteja fechado
  };

  // Passar para o próximo jogador
  const nextPlayer = () => {
    // Verificar se algum jogador atingiu a pontuação para vitória
    const winner = players.find((player) => player.score >= pointsToWin);
    if (winner) {
      setGameOver(true);
      return;
    }

    // Passar para o próximo jogador
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setTimeLeft(60);
  };

  // Efeito para inicializar o jogo
  useEffect(() => {
    // Atualizar o array de jogadores quando o número de jogadores mudar
    const newPlayers = Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: i + 1,
      name: `Jogador ${i + 1}`,
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    }));

    setPlayers(newPlayers);
  }, [numberOfPlayers]);

  // Efeito para o timer
  useEffect(() => {
    if (!currentQuestion || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          nextPlayer();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, currentPlayerIndex, gameOver]);

  // Adicionar showSuccessModal, startNewRound e getCurrentPlayerErrors ao valor do contexto
  const value = {
    players,
    setPlayers,
    numberOfPlayers,
    setNumberOfPlayers,
    pointsToWin,
    setPointsToWin,
    gameMode,
    setGameMode,
    visualTheme,
    setVisualTheme,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    currentQuestion,
    setCurrentQuestion,
    guessedLetters,
    setGuessedLetters,
    wrongLetters,
    setWrongLetters,
    timeLeft,
    setTimeLeft,
    gameOver,
    setGameOver,
    difficulty,
    setDifficulty,
    showSuccessModal,
    setShowSuccessModal,
    getRandomQuestion,
    checkWin,
    makeGuess,
    guessWord,
    nextPlayer,
    resetGame,
    startNewRound,
    applyTheme,
    getCurrentPlayerErrors,
    getRandomAvatar,
    usedQuestions,
    setUsedQuestions,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook para usar o contexto
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
