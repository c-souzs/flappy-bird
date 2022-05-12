const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasAltura = canvas.offsetHeight;
const canvasLargura = canvas.offsetWidth;

/*Estrutura básica de um elemento:
const elemento = {
  img: new Image(),
  x: 0,
  y: 0,
  desenhar(){

  },
  atualizar(){

  }
}
*/
const infoJogo = {
  inicial: true,
  jogando: false,
  morto: false,
  pontuacao: 0,
};
let frames = 0;

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
const passarinho = {
  img: new Image(),
  x: 25,
  y: 50,
  gravidade: 0.125,
  velocidade: 0,
  impulso: 3.6,
  frame: 0,
  desenhar() {
    ctx.drawImage(this.img, this.x, this.y);
  },
  animar() {
    this.frame += frames % 10 == 0 ? 1 : 0;
    this.frame = this.frame % 3;

    if (this.frame === 0) {
      this.img.src = "./images/passarinho-1.png";
    } else if (this.frame === 1) {
      this.img.src = "./images/passarinho-0.png";
    } else {
      this.img.src = "./images/passarinho-2.png";
    }
  },
  atualizar() {
    if (this.colissoes()) {
      infoJogo.jogando = false;
      infoJogo.morto = true;
      return;
    } else {
      this.velocidade = this.velocidade + this.gravidade;
      this.y = this.y + this.velocidade;
      canos.pontuar ? infoJogo.pontuacao++ : "";
      canos.pontuar = false;
    }
  },
  pular() {
    this.velocidade = -this.impulso;
  },
  colissoes() {
    const cChao = this.y + this.img.height >= chao.y;
    const cCanos = () => {
      if (!canos.pares.length) return;
      const aSuperior = canos.superior.height;
      const aInferior = canos.inferior.height;

      const ySuperior = canos.pares[0].y;
      const yInferior = ySuperior + (aInferior + canos.espacamento);
      const dSuperior = ySuperior + aSuperior;

      const x = canos.pares[0].x;

      if (this.x + this.img.width >= x) {
        if (this.x + this.img.width < x + canos.inferior.width) {
          // Na hora de adicionar o cano superior já é considerado a altura do passarinho
          if (
            this.y  <= dSuperior ||
            this.y + this.img.height >= yInferior
          )
            return true;
        } else return false;
      }
    };

    const retorno = cChao || cCanos() ? true : false;

    return retorno;
  },
};

const canos = {
  superior: new Image(),
  inferior: new Image(),
  espacamento: 85,
  pares: [],
  pontuar: false,
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
    if (!infoJogo.jogando) return;
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

    if (this.pares.length && this.pares[0].x < - this.superior.width - 10) {
      this.pontuar = true;
      this.pares.shift();
    }
  },
};

const elementosTela = {
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
  mensagemGameOver: {
    img: new Image(),
    x: 0,
    y: 0,
    desenhar() {
      this.img.src = "./images/fim-jogo.png";

      this.y = canvasAltura / 2 - this.img.height / 2 - 25;
      this.x = canvasLargura / 2 - this.img.width / 2;

      ctx.drawImage(this.img, this.x, this.y);
    },
  },
  pontuacao: {
    desenhar() {
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = "2";
      if (infoJogo.jogando) {
        ctx.font = "35px Squada One";
        ctx.fillText(infoJogo.pontuacao, canvasLargura / 2 - 5, 60);
        ctx.strokeText(infoJogo.pontuacao, canvasLargura / 2 - 5, 60);
      } else if (infoJogo.morto) {
        ctx.font = "35px Squada One";
        ctx.fillText(
          `Pontuação: ${infoJogo.pontuacao}`,
          canvasLargura / 2 - 85,
          canvasAltura / 2 - 20
        );
        ctx.strokeText(
          `Pontuação: ${infoJogo.pontuacao}`,
          canvasLargura / 2 - 85,
          canvasAltura / 2 - 20
        );

        const temRecorde = +localStorage.getItem("recorde");

        if (temRecorde) {
          if (temRecorde < infoJogo.pontuacao) {
            localStorage.setItem("recorde", infoJogo.pontuacao);
            ctx.font = "35px Squada One";
            ctx.fillText(
              `Pontuação: ${infoJogo.pontuacao}`,
              canvasLargura / 2 - 85,
              canvasAltura / 2 - 20
            );
            ctx.strokeText(
              `Pontuação: ${infoJogo.pontuacao}`,
              canvasLargura / 2 - 85,
              canvasAltura / 2 - 20
            );
            return;
          } else {
            ctx.font = "35px Squada One";
            ctx.fillText(
              `Recorde: ${temRecorde}`,
              canvasLargura / 2 - 65,
              canvasAltura / 2 + 15
            );
            ctx.strokeText(
              `Recorde: ${temRecorde}`,
              canvasLargura / 2 - 65,
              canvasAltura / 2 + 15
            );
          }
        } else {
          localStorage.setItem("recorde", infoJogo.pontuacao);
        }
      }
    },
  },
};

const elementosTelaAdd = () => {
  if (infoJogo.inicial) {
    passarinho.x = 25;
    passarinho.y = 50;
    passarinho.velocidade = 0;
    infoJogo.pontuacao = 0;
    const canosArray = canos.pares;
    for (let i = 0; i < canosArray.length; i++) {
      canosArray.pop();
    }

    elementosTela.mensagemTapTap.atualizar();
    elementosTela.mensagemGetReady.desenhar();
    elementosTela.mensagemTapTap.desenhar();
    passarinho.animar();
    passarinho.desenhar();
    chao.desenhar();
  } else if (infoJogo.jogando) {
    chao.atualizar();
    canos.atualizar();
    passarinho.atualizar();
    canos.desenhar();
    chao.desenhar();
    passarinho.animar();
    passarinho.desenhar();
    elementosTela.pontuacao.desenhar();
  } else if (infoJogo.morto) {
    canos.atualizar();
    elementosTela.mensagemTapTap.atualizar();
    canos.desenhar();
    elementosTela.pontuacao.desenhar();
    elementosTela.mensagemGameOver.desenhar();
    elementosTela.mensagemTapTap.desenhar();
    passarinho.animar();
    chao.desenhar();
    passarinho.desenhar();
  }
};

const jogar = () => {
  if (infoJogo.inicial) {
    infoJogo.inicial = false;
    infoJogo.jogando = true;
  } else if (infoJogo.jogando) {
    passarinho.pular();
  } else if (infoJogo.morto) {
    infoJogo.morto = false;
    infoJogo.jogando = false;
    infoJogo.inicial = true;
  }
};

canvas.addEventListener("click", jogar);

const loopJogo = () => {
  frames++;
  ctx.clearRect(0, 0, canvasLargura, canvasAltura);
  ctx.fillStyle = "#30c0df";
  ctx.fillRect(0, 0, canvasLargura, canvasAltura);

  fundo.desenhar();
  elementosTelaAdd();

  requestAnimationFrame(loopJogo);
};

loopJogo();
