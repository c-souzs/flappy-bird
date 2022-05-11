const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasAltura = canvas.offsetHeight;
const canvasLargura = canvas.offsetWidth;
const estado = {
  inicial: true,
  jogando: false,
  morto: false,
  pontuacao: 0,
};
let frames = 0;

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

const passarinho = {
  img: new Image(),
  x: 25,
  y: 50,
  gravidade: 0.125,
  velocidade: 0,
  impulso: 3.6,
  desenhar() {
    this.img.src = "./images/passarinho-0.png";
    ctx.drawImage(this.img, this.x, this.y);
  },
  atualizar() {
    this.colissoes();
    this.velocidade = this.velocidade + this.gravidade;
    this.y = this.y + this.velocidade;
  },
  pular() {
    this.velocidade = -this.impulso;
  },
  colissoes() {
    const cChao = this.y + this.img.height >= chao.y;
    const cCanos = () => {
      const ref = elementosTela.canos;
      if (!ref.pares.length) return;
      const aSuperior = ref.superior.height;
      const aInferior = ref.inferior.height;

      const ySuperior = ref.pares[0].y;
      const yInferior = ySuperior + (aInferior + ref.espacamento);
      const dSuperior = ySuperior + aSuperior;

      const x = ref.pares[0].x;

      if (this.x + this.img.width >= x) {
        if (this.x + this.img.width < x + ref.inferior.width) {
          if (this.y - (this.img.height / 2) <= dSuperior || this.y + (this.img.height / 2) >= yInferior) {
            return true;
          }
        } else {
          return false;
        }
      }
    };
    if (cChao || cCanos()) {
      // Finalizar o jogo
    } else{
      // Adicionar pontuação
    }
  },
};
const elementosTela = {
  add() {
    if (estado.inicial) {
      this.mensagemTapTap.atualizar();

      this.mensagemGetReady.desenhar();
      this.mensagemTapTap.desenhar();
      passarinho.desenhar();
    } else if (estado.jogando) {
      chao.atualizar();
      passarinho.atualizar();
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

const jogar = () => {
  if (estado.inicial) {
    estado.inicial = false;
    estado.jogando = true;
  } else if (estado.jogando) {
    estado.morto = false;
    passarinho.pular();
    return;
  } else if (estado.morto) {
    estado.inicial = true;
    estado.jogando = false;
  }
};

canvas.addEventListener("click", jogar);

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
