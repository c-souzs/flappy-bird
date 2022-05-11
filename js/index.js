const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasAltura = canvas.offsetHeight;
const canvasLargura = canvas.offsetWidth;

/*
Estrutura padrão de um objeto
const estrutura: {
  img: new Image, Cria um elemento <img />
  x: 0, Posição x do elemento dentro do canvas
  y: 0, Posição y do elemento dentro do canvas
  desenhar(){
    Seta o src da imagem, calcula as posições x e y, etc...
  },
  atualizar(){
    Não é obrigatório, somente caso deseje atualizar algo no elemento
  }
}
*/

// Variáveis de controe do estado do jogo
const estado = {
  inicial: true,
  jogando: false,
  morto: false,
  pontuacao: 0,
};

// Conta o frame para fazer certas animações
let frames = 0;

// Renderiza o chão na tela
const chao = {
  img: new Image(),
  x: 0,
  y: 0,
  desenhar() {
    this.img.src = "./images/chao.png";
    this.y = canvasAltura - this.img.height;
    ctx.drawImage(this.img, this.x, this.y);
  },
  atualizar() {
    this.x = this.x === -canvasLargura ? 0 : this.x - 1;

    // Lógica alternativa
    //const momentoRepeticao = chao.img.width / 2;
    //const movimentacao = chao.x - 1;
    //this.x = movimentacao % momentoRepeticao;
  },
};

// Renderiza o fundo na tela
const fundo = {
  img: new Image(),
  x: 0,
  y: 0,
  desenhar() {
    this.img.src = "./images/fundo.png";
    this.y = canvasAltura - this.img.height;
    ctx.drawImage(this.img, this.x, this.y);
  },
};

// Desenha o passarinho na tela. É responsável por fazer todos os movimentos do mesmo
const passarinho = {
  img: new Image(),
  x: 25,
  y: 50,
  desenhar() {
    this.img.src = "./images/passarinho-0.png";
    ctx.drawImage(this.img, this.x, this.y);
  },
};

// Baseado no estado do jogo é renderizado certos elementos
const elementosTela = {
  add() {
    if (estado.inicial) {
      this.mensagemTapTap.atualizar();

      this.mensagemGetReady.desenhar();
      this.mensagemTapTap.desenhar();
      passarinho.desenhar();

    } else if (estado.jogando) {
      chao.atualizar();
      this.canos.atualizar();
      this.canos.desenhar();
      this.pontuacao.desenhar();

    } else if (estado.morto) {
    }
  },
  mensagemGetReady: {
    img: new Image(),
    x: 0,
    y: 0,
    desenhar() {
      this.img.src = "./images/iniciar-jogo.png";

      this.y = canvasAltura / 2 - this.img.height / 2 - 25;
      this.x = canvasLargura / 2 - this.img.width / 2;

      ctx.drawImage(this.img, this.x, this.y);
    },
  },
  mensagemTapTap: {
    frame: 0,
    img: new Image(),
    x: 0,
    y: 0,
    desenhar() {
      this.y = canvasAltura / 2 - this.img.height / 2 + 50;
      this.x = canvasLargura / 2 - this.img.width / 2;

      ctx.drawImage(this.img, this.x, this.y);
    },
    atualizar() {
      // A cada 10 frames ele atualiza a imagem
      this.frame += frames % 10 == 0 ? 1 : 0;
      this.frame = this.frame % 2;

      this.img.src = this.frame
        ? "./images/clique-jogar-animado.png"
        : "./images/clique-jogar.png";
    },
  },
  canos: {
    superior: new Image(),
    inferior: new Image(),
    espacamento: 85,
    pares: [],
    mover: true,
    desenhar() {
      this.pares.forEach((par) => {
        this.superior.src = "./images/cano-topo.png";
        this.inferior.src = "./images/cano-chao.png";
        const yInferior = par.y + (this.inferior.height + this.espacamento);

        ctx.drawImage(this.superior, par.x, par.y);
        ctx.drawImage(this.inferior, par.x, yInferior);
      });
    },
    atualizar() {
      if (!estado.jogando) return;

      if (!(frames % 100)) {
        const canoDados = {
          x: canvasLargura,
          y: -210 * Math.min(Math.random() + 1, 1.8),
        };

        this.pares.push(canoDados);
      }

      this.pares.forEach((par) => {
        par.x -= 2;
      });

      if (this.pares.length && this.pares[0].x < -this.superior.width) {
        this.pares.shift();
        this.mover = true;
      }
    },
  },
  pontuacao: {
    desenhar() {
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = "2";
      ctx.font = "35px Squada One";
      ctx.fillText(estado.pontuacao, canvasLargura / 2 - 5, 50);
      ctx.strokeText(estado.pontuacao, canvasLargura / 2 - 5, 50);
    },
  },
};

// Baseado no estado do jogo faz certa ação com o clique
const jogar = () => {
  if (estado.inicial) {
    estado.inicial = false;
    estado.jogando = true;
  } else if (estado.jogando) {
    estado.morto = false;
  } else if (estado.morto) {
    estado.inicial = true;
    estado.jogando = false;
  }
};

canvas.addEventListener("click", jogar);

// Função que é executada a cada frame
const loopJogo = () => {
  frames++;

  ctx.fillStyle = "#30c0df";
  ctx.fillRect(0, 0, canvasLargura, canvasAltura);

  fundo.desenhar();

  elementosTela.add();
  passarinho.desenhar();
  chao.desenhar();

  requestAnimationFrame(loopJogo);
};

loopJogo();