// js/StartMenuScene.js

export default class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartMenuScene' });
  }

  preload() {
    console.log("StartMenuScene: preload");
    // Carrega os assets do menu
    this.load.image('startMenuBg', 'assets/startmenubg.png');
    this.load.image('startButton', 'assets/startButton.png');
  }

  create() {
    console.log("StartMenuScene: create");
    // Adiciona o fundo do menu centralizado (para resolução 1920x1080, centro é 960,540)
    let bg = this.add.image(960, 540, 'startMenuBg');
    bg.setOrigin(0.5, 0.5);

    // Exibe as instruções de como jogar
    let instructions = this.add.text(960, 1000, 
      "Use the arrow keys (up, down, right, left) to move the Garret M24\nPress the up arrow to fly, activating the Garret M24 fire",
      { font: "28px Arial", fill: "#ffffff", align: "center" }
    );
    instructions.setOrigin(0.5, 0.5);

    // Adiciona o botão "Play" centralizado com escala inicial 0.7
    const playButton = this.add.image(960, 700, 'startButton')
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .setScale(0.7);

    // Ao passar o mouse sobre o botão, aumenta a escala para 1.0
    playButton.on('pointerover', () => {
      playButton.setScale(1.0);
    });

    // Quando o mouse sair, volta para a escala 0.7
    playButton.on('pointerout', () => {
      playButton.setScale(0.7);
    });

    // Ao clicar, inicia a GameScene
    playButton.on('pointerdown', () => {
      console.log("StartMenuScene: Play button clicked");
      this.scene.start('GameScene');
    });
  }
}
