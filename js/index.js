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
  }
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
  }
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
      this.frame += frames % 10 == 0 ? 1 : 0;
      this.frame = this.frame % 2;

      this.img.src = this.frame
        ? "./images/clique-jogar-animado.png"
        : "./images/clique-jogar.png";
    },
  }
};

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