//js/main.js

import StartMenuScene from './StartMenuScene.js';
import GameOverScene from './GameOverScene.js';

// cena do jogo
class GameScene extends Phaser.Scene {
  constructor() {
    //chama o construtor da classe pai e registra esta cena com a chave 'GameScene'
    super({ key: 'GameScene' });
  }

  preload() {
    console.log("GameScene: preload");
    //carrega os assets do jogo
    this.load.image("background", "assets/e36shop.jpg");      
    this.load.image("player", "assets/garretM24.png");          
    this.load.image("fire", "assets/fire.png");                 //carrega a imagem do efeito de fogo (turbo)
    this.load.image("frontBumper", "assets/frontBumperM3.png");   //carrega a imagem da plataforma/barreira (parachoque)
    this.load.image("money", "assets/money.png");               
    this.load.image("pirelliTyres", "assets/pirelliSlickTyres.png");//carrega a imagem dos pneus
    this.load.image("gasCan", "assets/gasCan.png");             //carrega a imagem do galão de gasolina
  }

  create() {
    console.log("GameScene: create");
    const gameWidth = 1920;   //define a largura do jogo
    const gameHeight = 1080;  //define a altura do jogo

    //adiciona o fundo do jogo centralizado
    this.add.image(gameWidth / 2, gameHeight / 2, "background").setOrigin(0.5, 0.5);

    //cria o efeito turbo (fogo) que será ativado quando o personagem pular
    this.fire = this.add.sprite(0, 0, "fire"); //cria o sprite do efeito de fogo
    this.fire.setScale(0.125);                 //reduz a escala do fogo para 12.5% (50% menor que 25%, tive que ajustar para ficar um pouco menos feio no jogo e mais coerente com o tamanho do compressor air discharge da turbina)
    this.fire.setVisible(false);               //inicialmente, o efeito de fogo não é visível
    this.fire.setDepth(0);                     //define o depth do fogo para que fique atrás do personagem

    //cria o personagem (Garret M24)
    this.garretM24 = this.physics.add.sprite(gameWidth / 2, 100, "player");
    this.garretM24.setBounce(0.35);              //define uma rebatida leve ao colidir
    this.garretM24.setCollideWorldBounds(true); //impede que o turbo saia dos limites do jogo
    this.garretM24.setDepth(1);                //define o depth do turbo para que fique na frente do fogo

    //define os controles do jogo utilizando as setas do teclado
    this.teclado = this.input.keyboard.createCursorKeys();

    //cria as plataformas (parachoques) usando um array e um loop, só achei um pouco confuso e tive bastante trabalho para fazer funcionar
    this.frontBumpers = [];
    const platforms = [
      { x: gameWidth / 5.5, y: gameHeight / 3.8 },
      { x: gameWidth / 2, y: gameHeight / 2 },
      { x: gameWidth / 1.2, y: gameHeight / 1.6 }
    ];
    platforms.forEach((pos) => {
      let bumper = this.physics.add.staticImage(pos.x, pos.y, "frontBumper");
      bumper.setOrigin(0.5, 0.5);             //define o ponto de origem da plataforma como o centro
      this.physics.add.collider(this.garretM24, bumper); //adiciona a colisão entre o personagem e a plataforma
      this.frontBumpers.push(bumper);         //adiciona a plataforma ao array de plataformas
    });

    //adiciona elementos extras ao cenário (pneus slick da Pirelli e galão de gasolina)
    this.pirelliTyres = this.physics.add.staticImage(gameWidth / 1.25, gameHeight / 1.25, "pirelliTyres");
    this.pirelliTyres.setOrigin(0.5, 0.5);
    this.pirelliTyres.setScale(2);             //aumenta a escala dos pneus

    this.gasCan = this.physics.add.staticImage(gameWidth / 6, gameHeight / 1.25, "gasCan");
    this.gasCan.setOrigin(0.5, 0.5);
    this.gasCan.setScale(1);                  //define a escala do galão de gasolina

    //cria o moneyStack (para pontuação) e configura suas propriedades
    this.money = this.physics.add.sprite(gameWidth / 2, 0, "money");
    this.money.setCollideWorldBounds(true);   //impede que o money saia dos limites do jogo
    this.money.setBounce(0.7);                //define a rebatida do money ao colidir
    this.money.setScale(0.15);                //reduz a escala do money
    this.money.body.setGravityY(300);         //aplica gravidade para que o money caia

    //define a colisão entre o money e as plataformas
    this.frontBumpers.forEach((bumper) => {
      this.physics.add.collider(this.money, bumper);
    });

    //inicializa a pontuação e cria o texto do placar centralizado horizontalmente
    this.pontuacao = 0; //a pontuação inicia em zero
    this.placar = this.add.text(gameWidth / 2, 50, "Money to pay the mechanic for his work: " + this.pontuacao, {
      fontSize: "25px",
      fill: "#ffffff",
      fontFamily: "Arial",
      fontStyle: "bold"
    }).setOrigin(0.5, 0.5); //define o ponto de origem do texto como o centro para que fique centralizado

    //define a sobreposição (overlap) entre o turbo e o money para coletar o money
    this.physics.add.overlap(this.garretM24, this.money, this.coletarMoney, null, this);
  }

  update() {
    //controle de movimentação horizontal do personagem
    if (this.teclado.left.isDown) {
      this.garretM24.setVelocityX(-250);  //se a seta esquerda estiver pressionada, move para a esquerda
    } else if (this.teclado.right.isDown) {
      this.garretM24.setVelocityX(250);   //se a seta direita estiver pressionada, move para a direita
    } else {
      this.garretM24.setVelocityX(0);       //caso contrário, para o movimento horizontal
    }

    //controle de voo/ativação do turbo: se a seta pra cima estiver pressionada, o personagem pula e o efeito de fogo é ativado
    if (this.teclado.up.isDown) {
      this.garretM24.setVelocityY(-375);   //define a velocidade vertical para cima (pulo)
      this.ativarFire();                   //ativa o efeito de fogo (turbo)
    } else {
      this.desativarFire();                //desativa o efeito de fogo quando a seta para cima não estiver pressionada
    }

    //atualiza a posição do efeito de fogo para que ele siga o personagem e fique no canto inferior direito da turbina
    this.fire.setDepth(0); //garante que o efeito de fogo seja desenhado atrás do personagem
    this.fire.setPosition(this.garretM24.x + this.garretM24.width / 3, this.garretM24.y + this.garretM24.height / 2);

    //se o personagem cair abaixo da tela (acima de 1080 + 50 pixels), inicia a cena de game over
    if (this.garretM24.y > 1080 + 50) {
      this.scene.start('GameOverScene', { score: this.pontuacao });
    }
  }

  coletarMoney() {
    //torna o money invisível, reposiciona-o, incrementa a pontuação e atualiza o placar
    this.money.setVisible(false);
    this.money.setPosition(Phaser.Math.Between(50, 1920 - 50), 100);
    this.pontuacao += 1;  //incrementa a pontuação em 1
    this.placar.setText("Money to pay the mechanic for his work: " + this.pontuacao);
    this.money.setVisible(true);

    //se a pontuação atingir 50, transita para a cena de game over
    if (this.pontuacao >= 50) {
      this.scene.start('GameOverScene', { score: this.pontuacao });
    }
  }

  ativarFire() {
    //torna o efeito de fogo visível
    this.fire.setVisible(true);
  }

  desativarFire() {
    //torna o efeito de fogo invisível
    this.fire.setVisible(false);
  }
}

//config do phaser com o canvas centralizado na tela
const config = {
  type: Phaser.AUTO,  //seleciona automaticamente entre WebGL e Canvas
  width: 1920,        //largura do jogo
  height: 1080,       //altura do jogo
  scale: {
    mode: Phaser.Scale.FIT,             //ajusta a escala para caber na tela
    autoCenter: Phaser.Scale.CENTER_BOTH  //centraliza o canvas tanto horizontal quanto verticalmente
  },
  physics: {
    default: "arcade",                //define o sistema de física Arcade
    arcade: {
      gravity: { y: 300 },            //define a gravidade no eixo y
      debug: false,                   //desativa o debug da física
    },
  },
  //registra as cenas: menu, jogo e game over
  scene: [StartMenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
