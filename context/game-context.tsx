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
    // Fácil
    {
      word: "NARUTO",
      hint: "Ninja que sonha em se tornar Hokage",
      difficulty: "Fácil",
    },
    {
      word: "GOKU",
      hint: "Protagonista de Dragon Ball que é um Saiyajin",
      difficulty: "Fácil",
    },
    {
      word: "LIGHT",
      hint: "Estudante que encontra um Death Note",
      difficulty: "Fácil",
    },
    {
      word: "EREN",
      hint: "Jovem que busca vingança contra os Titãs",
      difficulty: "Fácil",
    },
    {
      word: "L",
      hint: "Detetive genial que investiga o caso Kira",
      difficulty: "Fácil",
    },
    {
      word: "SAITAMA",
      hint: "Herói que derrota inimigos com um soco",
      difficulty: "Fácil",
    },
    {
      word: "DEKU",
      hint: "Protagonista de My Hero Academia",
      difficulty: "Fácil",
    },
    {
      word: "TANJIRO",
      hint: "Caçador de demônios que busca curar sua irmã",
      difficulty: "Fácil",
    },
    {
      word: "LEVI",
      hint: "Soldado mais forte da humanidade em Attack on Titan",
      difficulty: "Fácil",
    },
    {
      word: "ZORO",
      hint: "Espadachim que se perde facilmente em One Piece",
      difficulty: "Fácil",
    },
    {
      word: "KONAN",
      hint: "Garota com braços invisíveis assassinos",
      difficulty: "Fácil",
    },
    {
      word: "YUMI",
      hint: "Apostas escolares bizarras",
      difficulty: "Fácil",
    },
    {
      word: "VIOLET",
      hint: "Menina sem emoções em guerra",
      difficulty: "Fácil",
    },
    {
      word: "GINTOKI",
      hint: "Samurai cômico em Tóquio alternativo",
      difficulty: "Fácil",
    },
    {
      word: "KILLUA",
      hint: "Assassino que se torna amigo do protagonista",
      difficulty: "Fácil",
    },
    {
      word: "KONOSUBA",
      hint: "Aventura em mundo de fantasia com deusa inútil",
      difficulty: "Fácil",
    },
    {
      word: "KIMI",
      hint: "Músico cego prodígio",
      difficulty: "Fácil",
    },
    {
      word: "MASHIRO",
      hint: "Vida de mangakás iniciantes",
      difficulty: "Fácil",
    },
    {
      word: "SOHEI",
      hint: "Crimes resolvidos com lógica",
      difficulty: "Fácil",
    },
    {
      word: "REI",
      hint: "Mundo sombrio e existencialismo",
      difficulty: "Fácil",
    },
    {
      word: "CHIHIRO",
      hint: "Menina em mundo de espíritos",
      difficulty: "Fácil",
    },
    {
      word: "SUBARU",
      hint: "Garoto preso em loop temporal com poderes",
      difficulty: "Fácil",
    },
    {
      word: "LUFFY",
      hint: "Garoto quer ser o rei dos piratas",
      difficulty: "Fácil",
    },
    {
      word: "AMURO",
      hint: "Robôs gigantes em guerra ideológica",
      difficulty: "Fácil",
    },
    {
      word: "KANeki",
      hint: "Garoto com olhos amaldiçoados",
      difficulty: "Fácil",
    },
    {
      word: "DEKU",
      hint: "Escola de heróis com superpoderes",
      difficulty: "Fácil",
    },
    {
      word: "NARUTO",
      hint: "Ninjas e bestas com cauda",
      difficulty: "Fácil",
    },
    {
      word: "EREN",
      hint: "Espadachins contra titãs",
      difficulty: "Fácil",
    },
    {
      word: "LIGHT",
      hint: "Garoto com caderno da morte",
      difficulty: "Fácil",
    },
    {
      word: "SAIKI",
      hint: "Menina com poderes psíquicos é controlada pelo governo",
      difficulty: "Fácil",
    },
    {
      word: "BIRDY",
      hint: "Menina vira heroína após ser salva por alienígena",
      difficulty: "Fácil",
    },
    {
      word: "HIKARI",
      hint: "Jovem vive em cidade submersa misteriosa",
      difficulty: "Fácil",
    },
    {
      word: "KASUMI",
      hint: "Jovem reencarna como máquina de venda",
      difficulty: "Fácil",
    },
    {
      word: "TOSHIO",
      hint: "Estudantes descobrem que são monstros",
      difficulty: "Fácil",
    },
    {
      word: "HOTARU",
      hint: "Menina encontra criatura mística no bosque",
      difficulty: "Fácil",
    },
    {
      word: "MAHIRU",
      hint: "Jovem é perseguido por garota obsessiva",
      difficulty: "Fácil",
    },
    {
      word: "SHINPEI",
      hint: "Família se muda para ilha com segredos sobrenaturais",
      difficulty: "Fácil",
    },
    {
      word: "JOTARO",
      hint: "Lutadores usam habilidades chamadas 'Stands'",
      difficulty: "Fácil",
    },
    {
      word: "FUJIYAMA",
      hint: "Samurai cego viaja com propósito oculto",
      difficulty: "Fácil",
    },
    {
      word: "MAKOTO",
      hint: "Jovem se comunica com alienígenas via rádio antigo",
      difficulty: "Fácil",
    },

    // Médio
    {
      word: "EMMA",
      hint: "Crianças tentam fugir de orfanato sinistro",
      difficulty: "Médio",
    },
    {
      word: "RIMURU",
      hint: "Isekai com slime fofo",
      difficulty: "Médio",
    },
    {
      word: "KAZUMA",
      hint: "Garoto invocado em outro mundo com uma deusa",
      difficulty: "Médio",
    },
    {
      word: "MAKA",
      hint: "Armas vivas que viram pessoas",
      difficulty: "Médio",
    },
    {
      word: "OKABE",
      hint: "Cientista louco e viagem no tempo",
      difficulty: "Médio",
    },
    {
      word: "KIRITO",
      hint: "Jogo de realidade virtual mortal",
      difficulty: "Médio",
    },
    {
      word: "YUUJI",
      hint: "Garoto amaldiçoado por dedo demoníaco",
      difficulty: "Médio",
    },
    {
      word: "YATO",
      hint: "Garoto e espírito do trovão se unem",
      difficulty: "Médio",
    },
    {
      word: "RIN",
      hint: "Gêmeos exorcistas enfrentam demônios",
      difficulty: "Médio",
    },
    {
      word: "HIRO",
      hint: "Meninas pilotam mechas em guerra",
      difficulty: "Médio",
    },
    {
      word: "VIOLET",
      hint: "Garota aprende sobre emoções entregando cartas",
      difficulty: "Médio",
    },
    {
      word: "GON",
      hint: "Jovem perde tudo e luta em torneio de artes marciais",
      difficulty: "Médio",
    },
    {
      word: "EDWARD",
      hint: "Dois irmãos tentam recuperar seus corpos",
      difficulty: "Médio",
    },
    {
      word: "HYAKKIMARU",
      hint: "Samurai amaldiçoado busca vingança",
      difficulty: "Médio",
    },
    {
      word: "RENA",
      hint: "Garota vive looping de mortes",
      difficulty: "Médio",
    },
    {
      word: "SATORU",
      hint: "Garoto viaja para tentar salvar amigos mortos",
      difficulty: "Médio",
    },
    {
      word: "KIRITSUGU",
      hint: "Lutadores competem por um desejo",
      difficulty: "Médio",
    },
    {
      word: "MADOKA",
      hint: "Garotas mágicas enfrentam tragédias",
      difficulty: "Médio",
    },
    {
      word: "KOROSENSEI",
      hint: "Aluno morto vira professor de assassinos",
      difficulty: "Médio",
    },
    {
      word: "YU",
      hint: "Estudantes com superpoderes aleatórios",
      difficulty: "Médio",
    },
    {
      word: "ALADDIN",
      hint: "Magos controlam elementos naturais em torneio",
      difficulty: "Médio",
    },
    {
      word: "ICHIKO",
      hint: "Jovem é amaldiçoado por gato fantasma",
      difficulty: "Médio",
    },
    {
      word: "MINATO",
      hint: "Garotas praticam arco e flecha em clube escolar",
      difficulty: "Médio",
    },
    {
      word: "KOTO",
      hint: "Detetive resolve mistérios de forma excêntrica",
      difficulty: "Médio",
    },
    {
      word: "TOUMA",
      hint: "Jovem vive em mundo que mistura magia e ciência",
      difficulty: "Médio",
    },
    {
      word: "AKIRA",
      hint: "Jovem tenta sobreviver ao apocalipse com um caminhão",
      difficulty: "Médio",
    },
    {
      word: "MURASAKI",
      hint: "Cientista cria clones em sociedade distópica",
      difficulty: "Médio",
    },
    {
      word: "FUTABA",
      hint: "Jovem entra em realidade alternativa com sereias",
      difficulty: "Médio",
    },
    {
      word: "CHIERI",
      hint: "Idols enfrentam vilões usando música",
      difficulty: "Médio",
    },
    {
      word: "MERCY",
      hint: "Jovem é guiado por livro falante mágico",
      difficulty: "Médio",
    },
    {
      word: "CIMAN",
      hint: "Garoto e demônio compartilham corpo",
      difficulty: "Médio",
    },
    {
      word: "BAM",
      hint: "Jovens em torre lutam por desejos",
      difficulty: "Médio",
    },
    {
      word: "KATSUHIRA",
      hint: "Humanos transformam sentimentos em armas",
      difficulty: "Médio",
    },
    {
      word: "ITTOKI",
      hint: "Jovem é amaldiçoado a nunca morrer",
      difficulty: "Médio",
    },
    {
      word: "IZAYA",
      hint: "Lenda urbana ganha vida em cidade agitada",
      difficulty: "Médio",
    },

    // Difícil
    {
      word: "NAGATE",
      hint: "Robôs gigantes no fundo do oceano",
      difficulty: "Difícil",
    },
    {
      word: "TWILIGHT",
      hint: "Família de espiões improváveis",
      difficulty: "Difícil",
    },
    {
      word: "YUKITERU",
      hint: "Jovens se matam por causa de app de celular",
      difficulty: "Difícil",
    },
    {
      word: "LELOUCH",
      hint: "Jovens pilotam mechas em guerra civil",
      difficulty: "Difícil",
    },
    {
      word: "SORA",
      hint: "Garoto gênio perde tudo em jogo",
      difficulty: "Difícil",
    },
    {
      word: "TSUKASA",
      hint: "Andróide que aprende a amar",
      difficulty: "Difícil",
    },
    {
      word: "SOUMA",
      hint: "Lutas de comida exageradas",
      difficulty: "Difícil",
    },
    {
      word: "LEONARDO",
      hint: "Jovens vivem em cidade dividida por corações",
      difficulty: "Difícil",
    },
    {
      word: "KOBAYASHI",
      hint: "Jovem e garota dragão convivem juntos",
      difficulty: "Difícil",
    },
    {
      word: "LUCY",
      hint: "Garoto com vários braços invisíveis",
      difficulty: "Difícil",
    },
    {
      word: "IKOMA",
      hint: "Exército contra zumbis em trem blindado",
      difficulty: "Difícil",
    },
    {
      word: "GINTOKI",
      hint: "Samurais e aliens no Japão feudal futurista",
      difficulty: "Difícil",
    },
    {
      word: "MAKOTO",
      hint: "Sobrevivência entre alunos sádicos",
      difficulty: "Difícil",
    },
    {
      word: "NAOTA",
      hint: "Robô gigante com plug de música",
      difficulty: "Difícil",
    },
    {
      word: "HIDEKI",
      hint: "Namorada é uma IA perfeita",
      difficulty: "Difícil",
    },
    {
      word: "NATSUME",
      hint: "Garoto ajuda fantasmas com seu diário",
      difficulty: "Difícil",
    },
    {
      word: "GRAN",
      hint: "Deusa e guerreira são invocadas para lutar",
      difficulty: "Difícil",
    },
    {
      word: "KANATA",
      hint: "Criança alienígena é adotada por casal",
      difficulty: "Difícil",
    },
    {
      word: "KYU",
      hint: "Trio de garotas resolve crimes em Tóquio",
      difficulty: "Difícil",
    },
    {
      word: "HISAKI",
      hint: "Equipe de garotas viaja pelo espaço",
      difficulty: "Difícil",
    },
    {
      word: "ASH",
      hint: "Jovem quer ser mestre Pokémon",
      difficulty: "Difícil",
    },
    {
      word: "MELIODAS",
      hint: "Estudante vira demônio e começa a guerra santa",
      difficulty: "Difícil",
    },
    {
      word: "KEI",
      hint: "Adolescente com poder de apagar memórias",
      difficulty: "Difícil",
    },
    {
      word: "CHIHAYA",
      hint: "Estudantes descobrem o valor da poesia",
      difficulty: "Difícil",
    },
    {
      word: "KENSHIN",
      hint: "Espadachim amaldiçoado busca redenção",
      difficulty: "Difícil",
    },
    {
      word: "HARUHITO",
      hint: "Jovem acorda sem memória em mundo de fantasia",
      difficulty: "Difícil",
    },
    {
      word: "SAKURA",
      hint: "Idols virtuais conquistam o mundo",
      difficulty: "Difícil",
    },
    {
      word: "MANA",
      hint: "Jovem treina para se tornar idol de sucesso",
      difficulty: "Difícil",
    },
    {
      word: "YUKI",
      hint: "Donzela busca vingança com ajuda de robôs",
      difficulty: "Difícil",
    },
    {
      word: "SYALIS",
      hint: "Garota é sequestrada para casar com um rei demônio",
      difficulty: "Difícil",
    },
    {
      word: "ATSUHI",
      hint: "Jovem com habilidades estranhas luta contra organizações secretas",
      difficulty: "Difícil",
    },
    {
      word: "KAIZAKI",
      hint: "Garoto revive a mesma semana para salvar a amiga",
      difficulty: "Difícil",
    },
    {
      word: "Kyon",
      hint: "Jovem repete seu dia várias vezes sem querer",
      difficulty: "Difícil",
    },
    {
      word: "YUU",
      hint: "Garotas vivem em mundo pós-apocalíptico",
      difficulty: "Difícil",
    },
    {
      word: "AKIHITO",
      hint: "Jovem com poderes espirituais ajuda fantasmas",
      difficulty: "Difícil",
    },
    {
      word: "SHU",
      hint: "Casal adolescente sobrevive em ilha misteriosa",
      difficulty: "Difícil",
    },
    {
      word: "REN",
      hint: "Ladrões roubam corações corruptos",
      difficulty: "Difícil",
    },
    {
      word: "OTONASHI",
      hint: "Garoto em coma vive em mundo alternativo",
      difficulty: "Difícil",
    },
    {
      word: "KEI",
      hint: "Jovem começa a ver monstros após quase morrer",
      difficulty: "Difícil",
    },
    {
      word: "TANJIRO",
      hint: "Jovem possui poderes ocultos herdados",
      difficulty: "Difícil",
    },
    {
      word: "SOREY",
      hint: "Família viaja entre mundos resolvendo crimes mágicos",
      difficulty: "Difícil",
    },
    {
      word: "YUMIKO",
      hint: "Menina faz amizade com IA de uma nave espacial",
      difficulty: "Difícil",
    },
    {
      word: "SAKURA",
      hint: "Jovem se torna mestre de cartas mágicas",
      difficulty: "Difícil",
    },
    {
      word: "JINTA",
      hint: "Jovem lida com morte de sua melhor amiga",
      difficulty: "Difícil",
    },
    {
      word: "RIKO",
      hint: "Jovens precisam explorar uma prisão vertical",
      difficulty: "Difícil",
    },
    {
      word: "HIBIKI",
      hint: "Jovem com armadura mágica enfrenta vilões",
      difficulty: "Difícil",
    },
    {
      word: "ASUKA",
      hint: "Escola só para garotas com superpoderes",
      difficulty: "Difícil",
    },
    {
      word: "RITO",
      hint: "Estudante se envolve com alienígenas misteriosos",
      difficulty: "Difícil",
    },
    {
      word: "YUSHI",
      hint: "Jovem e criaturas sobrenaturais convivem no mesmo templo",
      difficulty: "Difícil",
    },
    {
      word: "RYUJI",
      hint: "Jovem precisa vencer jogo da morte para sobreviver",
      difficulty: "Difícil",
    },
    {
      word: "JOE",
      hint: "Robôs lutam em arenas para o entretenimento",
      difficulty: "Difícil",
    },
    {
      word: "YUTARO",
      hint: "Idosa vira heroína em corpo jovem",
      difficulty: "Difícil",
    },
    {
      word: "LAIN",
      hint: "Jovem lida com traumas em mundo cibernético",
      difficulty: "Difícil",
    },
    {
      word: "NARUMI",
      hint: "Casal tenta lidar com a vida adulta juntos",
      difficulty: "Difícil",
    },
    {
      word: "IKTA",
      hint: "Jovem tenta salvar o mundo com estratégia militar",
      difficulty: "Difícil",
    },
    {
      word: "NANAMI",
      hint: "Garota ajuda deuses a recuperar poder",
      difficulty: "Difícil",
    },
    {
      word: "ISAAC",
      hint: "Viagem de trem com espíritos e segredos",
      difficulty: "Difícil",
    },
    {
      word: "KIYOTAKA",
      hint: "Estudantes vivem em simulação social",
      difficulty: "Difícil",
    },
    {
      word: "IKKI",
      hint: "Magia e batalhas por trás de torneios escolares",
      difficulty: "Difícil",
    },
    {
      word: "NATSUMI",
      hint: "Jovem sobrevive sozinho após catástrofe",
      difficulty: "Difícil",
    },
    {
      word: "AKARI",
      hint: "Escola de assassinos disfarçada de comum",
      difficulty: "Difícil",
    },
    {
      word: "EMMA",
      hint: "Dois órfãos planejam fugir de uma fazenda sinistra",
      difficulty: "Difícil",
    },
    {
      word: "TITA",
      hint: "Jovem encontra clone de sua irmã",
      difficulty: "Difícil",
    },
    {
      word: "RULU",
      hint: "Guerreiros lutam em guerras sagradas usando cartas",
      difficulty: "Difícil",
    },
    {
      word: "GORO",
      hint: "Jovens precisam fugir de prisão lunar",
      difficulty: "Difícil",
    },
    {
      word: "KEIICHI",
      hint: "Jovem se envolve em looping com garota misteriosa",
      difficulty: "Difícil",
    },
    {
      word: "JUNPEI",
      hint: "Jovem e gato gigante se tornam detetives",
      difficulty: "Difícil",
    },
    {
      word: "FUU",
      hint: "Jovem tenta se tornar o melhor fotógrafo",
      difficulty: "Difícil",
    },
    {
      word: "FAVARO",
      hint: "Jovem sobrevive em mundo medieval com dragões",
      difficulty: "Difícil",
    },
    {
      word: "KATARINA",
      hint: "Donzela reencarna como vilã de otome game",
      difficulty: "Difícil",
    },
    {
      word: "HITOMI",
      hint: "Menina vive em cidade sem cores",
      difficulty: "Difícil",
    },
    {
      word: "REIJI",
      hint: "Jovem descobre que está preso em simulação de jogo",
      difficulty: "Difícil",
    },
    {
      word: "ICHIZO",
      hint: "Idoso se transforma em herói sobre-humano",
      difficulty: "Difícil",
    },
    {
      word: "YORITO",
      hint: "Jovem encontra clone de sua amada morta",
      difficulty: "Difícil",
    },
    {
      word: "OTHA",
      hint: "Garoto revive após ser morto por robô",
      difficulty: "Difícil",
    },
    {
      word: "RAT",
      hint: "Jovens enfrentam dilemas filosóficos em duelos",
      difficulty: "Difícil",
    },
    {
      word: "HARUO",
      hint: "Grupo de garotas tenta salvar loja de arcade",
      difficulty: "Difícil",
    },
    {
      word: "DIABLO",
      hint: "Jovem se torna lorde de demônios por acidente",
      difficulty: "Difícil",
    },
    {
      word: "RYOMA",
      hint: "Samurai moderno busca vingança em Tóquio",
      difficulty: "Difícil",
    },
    {
      word: "AI",
      hint: "Jovem vira amigo de um espírito kitsune",
      difficulty: "Difícil",
    },
    {
      word: "SNOW",
      hint: "Garota é forçada a entrar em reality show mortal",
      difficulty: "Difícil",
    },
    {
      word: "SHINICHI",
      hint: "Jovens enfrentam parasitas espaciais",
      difficulty: "Difícil",
    },
    {
      word: "NENE",
      hint: "Garota começa a ver demônios após acidente",
      difficulty: "Difícil",
    },
    {
      word: "JP",
      hint: "Jovens correm em corridas futuristas ilegais",
      difficulty: "Difícil",
    },
    {
      word: "MUTTA",
      hint: "Menina lida com a morte do pai astronauta",
      difficulty: "Difícil",
    },
    {
      word: "SOICHIRO",
      hint: "Jovem herda dojo e rivaliza com gangues",
      difficulty: "Difícil",
    },
    {
      word: "ONIZUKA",
      hint: "Estudante é confundido com delinquente",
      difficulty: "Difícil",
    },
    {
      word: "SHINRA",
      hint: "Jovem acorda com poderes de fogo",
      difficulty: "Difícil",
    },
    {
      word: "TANJIRO",
      hint: "Garoto busca a cura para sua irmã demoníaca",
      difficulty: "Difícil",
    },
    {
      word: "HIBIKI",
      hint: "Robôs são movidos a música",
      difficulty: "Difícil",
    },
    {
      word: "KIMIMARO",
      hint: "Jovem tenta impedir o fim do mundo com aplicativo",
      difficulty: "Difícil",
    },
    {
      word: "JIN",
      hint: "Jovem acorda em outro planeta e luta para sobreviver",
      difficulty: "Difícil",
    },
    {
      word: "NAGIRI",
      hint: "Jovens enfrentam criaturas nas sombras",
      difficulty: "Difícil",
    },
    {
      word: "USHIO",
      hint: "Jovem com braço amaldiçoado enfrenta monstros",
      difficulty: "Difícil",
    },
    {
      word: "YUGI",
      hint: "Jovem quer ser o rei dos duelistas",
      difficulty: "Difícil",
    },
    {
      word: "YOH",
      hint: "Lutadores protegem relíquias ancestrais",
      difficulty: "Difícil",
    },
    {
      word: "AYA",
      hint: "Garota tenta escapar de mundo de tortura",
      difficulty: "Difícil",
    },
    {
      word: "NAGATE",
      hint: "Jovem entra no exército espacial",
      difficulty: "Difícil",
    },
    {
      word: "SHICHIKA",
      hint: "Samurais vivem em mundo alternativo após grande catástrofe",
      difficulty: "Difícil",
    },
    {
      word: "ANOS",
      hint: "Jovem e princesa demônio fogem juntos",
      difficulty: "Difícil",
    },
    {
      word: "KANATA",
      hint: "Viagem espacial com passageiros em sono criogênico",
      difficulty: "Difícil",
    },
    {
      word: "KENJI",
      hint: "Luta de ninjas com animações experimentais",
      difficulty: "Difícil",
    },
    {
      word: "KAIBU",
      hint: "Grupo de garotas descobre antiga civilização subterrânea",
      difficulty: "Difícil",
    },
    {
      word: "PATEMA",
      hint: "Jovem tenta proteger cidade flutuante",
      difficulty: "Difícil",
    },
    {
      word: "ICHIGO",
      hint: "Garoto se torna shinigami substituto",
      difficulty: "Difícil",
    },
    {
      word: "MIDORI",
      hint: "Jovens correm atrás de sonhos em estúdio de animação",
      difficulty: "Difícil",
    },
    {
      word: "MOB",
      hint: "Garoto é amaldiçoado por espírito vingativo",
      difficulty: "Difícil",
    },
    {
      word: "AKIRA",
      hint: "Jovem luta contra lobisomens modernos",
      difficulty: "Difícil",
    },
    {
      word: "DINO",
      hint: "Jovem e cão-robô investigam crimes",
      difficulty: "Difícil",
    },
    {
      word: "KAGOME",
      hint: "Estudante viaja para o Japão feudal",
      difficulty: "Difícil",
    },
    {
      word: "KOTARO",
      hint: "Jovem se apaixona por uma vampira",
      difficulty: "Difícil",
    },
    {
      word: "ZWEI",
      hint: "Dupla de assassinos com memória perdida",
      difficulty: "Difícil",
    },
    {
      word: "IKKI",
      hint: "Lutadores controlam elementos em arena de batalha",
      difficulty: "Difícil",
    },
    {
      word: "SUNABOZU",
      hint: "Garoto busca a verdade em mundo desértico",
      difficulty: "Difícil",
    },
    {
      word: "KYOMA",
      hint: "Jovens descobrem portais para mundos paralelos",
      difficulty: "Difícil",
    },
    {
      word: "KEI",
      hint: "Investigadores enfrentam seres invisíveis",
      difficulty: "Difícil",
    },
    {
      word: "KAMINA",
      hint: "Crianças pilotam robôs gigantes em guerra",
      difficulty: "Difícil",
    },
    {
      word: "SOTA",
      hint: "Garoto revive dentro de videogame antigo",
      difficulty: "Difícil",
    },
    {
      word: "PACIFICA",
      hint: "Jovem perde tudo após ataque de criaturas mágicas",
      difficulty: "Difícil",
    },
    {
      word: "SOUYA",
      hint: "Garoto acorda como o último humano vivo",
      difficulty: "Difícil",
    },
    {
      word: "OGA",
      hint: "Jovem é treinado por demônio em artes marciais",
      difficulty: "Difícil",
    },
    {
      word: "TACHI",
      hint: "Dois jovens trocam de corpo sem explicação",
      difficulty: "Difícil",
    },
    {
      word: "YOMI",
      hint: "Jovem é escolhido por relíquia maldita",
      difficulty: "Difícil",
    },
    {
      word: "AI",
      hint: "Garota vive sozinha em estação espacial abandonada",
      difficulty: "Difícil",
    },
    {
      word: "ERIN",
      hint: "Jovem encontra ser divino em floresta isolada",
      difficulty: "Difícil",
    },
    {
      word: "KAZUKI",
      hint: "Jovem deseja reviver sua irmã por meio da alquimia",
      difficulty: "Difícil",
    },
    {
      word: "MAI",
      hint: "Estudantes investigam mistérios com sobrenatural",
      difficulty: "Difícil",
    },
    {
      word: "ANIS",
      hint: "Garota renasce em mundo de fantasia como nobre",
      difficulty: "Difícil",
    },
    {
      word: "CHAKURO",
      hint: "Jovem ajuda espíritos a descansar em paz",
      difficulty: "Difícil",
    },
    {
      word: "HIDEKI",
      hint: "Robôs pequenos com personalidade própria",
      difficulty: "Difícil",
    },
    {
      word: "SIMON",
      hint: "Jovem entra em torneio intergaláctico",
      difficulty: "Difícil",
    },
    {
      word: "HAKUFU",
      hint: "Garota luta contra invasores de outra dimensão",
      difficulty: "Difícil",
    },
    {
      word: "ALTO",
      hint: "Jovem tenta impedir invasão alienígena com música",
      difficulty: "Difícil",
    },
    {
      word: "LAVI",
      hint: "Jovens enfrentam desafios em navio voador",
      difficulty: "Difícil",
    },
    {
      word: "TRAIN",
      hint: "Caçadores enfrentam monstros de aluguel",
      difficulty: "Difícil",
    },
    {
      word: "KUKURU",
      hint: "Garota vira gerente de aquário",
      difficulty: "Difícil",
    },
    {
      word: "KANAME",
      hint: "Garota se comunica com alienígena por rádio antigo",
      difficulty: "Difícil",
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

// Número máximo de erros permitidos
// Remover a constante MAX_ERRORS = 5 e substituir por uma função
export const getMaxErrors = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case "Fácil":
      return 8;
    case "Médio":
      return 6;
    case "Difícil":
      return 4;
    default:
      return 6; // Médio como padrão
  }
};

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

  // Obter uma pergunta aleatória com base na dificuldade
  const getRandomQuestion = (): GameQuestion => {
    // Filtrar perguntas da dificuldade atual que ainda não foram usadas
    let filteredQuestions = questions.filter(
      (q) => q.difficulty === difficulty && !usedQuestions.includes(q.word)
    );

    // Se todas as perguntas dessa dificuldade já foram usadas
    if (filteredQuestions.length === 0) {
      // Filtrar todas as perguntas da dificuldade atual
      const allQuestionsOfDifficulty = questions.filter(
        (q) => q.difficulty === difficulty
      );

      // Se houver apenas uma pergunta dessa dificuldade, retornar ela
      if (allQuestionsOfDifficulty.length === 1) {
        return allQuestionsOfDifficulty[0];
      }

      // Remover as últimas 3 perguntas usadas para evitar repetição imediata
      const lastThreeQuestions = usedQuestions.slice(-3);
      filteredQuestions = allQuestionsOfDifficulty.filter(
        (q) => !lastThreeQuestions.includes(q.word)
      );

      // Se ainda não houver perguntas disponíveis, resetar completamente
      if (filteredQuestions.length === 0) {
        setUsedQuestions([]);
        filteredQuestions = allQuestionsOfDifficulty;
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

    // Limpar a palavra para remover possíveis caracteres de nova linha
    return {
      ...question,
      word: question.word.trim(),
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
      .split("")
      .every(
        (letter) =>
          letter === " " || guessedLetters.includes(letter.toUpperCase())
      );
  };

  // Modificar a função makeGuess para retirar apenas 1 ponto ao errar uma letra
  const makeGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    if (currentQuestion && currentQuestion.word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);

      // Adicionar pontos ao jogador atual
      const occurrences = currentQuestion.word
        .split("")
        .filter((l) => l === letter).length;
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
          .split("")
          .every((l) => l === " " || guessedLetters.includes(l) || l === letter)
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
      setWrongLetters([...wrongLetters, letter]);

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

  // Modificar a função guessWord para não encerrar o jogo ao errar, apenas retirar 50 pontos e passar para o próximo jogador
  const guessWord = (word: string) => {
    if (currentQuestion && word.toUpperCase() === currentQuestion.word) {
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
