
export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartMenuScene' });
  }

  preload() {
    console.log("StartMenuScene: preload");
    //carrega os assets do menu
    this.load.image('startMenuBg', 'assets/startmenubg.png');
    this.load.image('startButton', 'assets/startButton.png');
  }

  create() {
    console.log("StartMenuScene: create");
    //add o fundo do menu centralizado (para resolução 1920x1080, centro é 960,540. acho que da pra fazer de um jeito mais inteligente, mas não sei como)
    let bg = this.add.image(960, 540, 'startMenuBg');
    bg.setOrigin(0.5, 0.5);

    //exibe as instruções de como jogar, em inglês pra abranger mais público hahaha
    let instructions = this.add.text(960, 1000, 
      "Use the arrow keys (up, down, right, left) to move the Garret M24\nPress the up arrow to fly, activating the Garret M24 fire",
      { font: "28px Arial", fill: "#ffffff", align: "center" }
    );
    instructions.setOrigin(0.5, 0.5);

    //add o botão "start" centralizado com escala inicial 0.7, pra ter um efeitinho ao passar o mouse sobre, quando ele aumenta de tamanho
    const playButton = this.add.image(960, 700, 'startButton')
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .setScale(0.7);

    //ao passar o mouse sobre o botão, aumenta a escala pra 1.0
    playButton.on('pointerover', () => {
      playButton.setScale(1.0);
    });

    //quando o mouse sair, volta pra a escala 0.7
    playButton.on('pointerout', () => {
      playButton.setScale(0.7);
    });

    //ao clicar, inicia a GameScene
    playButton.on('pointerdown', () => {
      console.log("StartMenuScene: Play button clicked");
      this.scene.start('GameScene');
    });
  }
}
