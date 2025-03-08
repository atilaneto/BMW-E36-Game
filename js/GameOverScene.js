// js/GameOverScene.js

export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    preload() {
      console.log("GameOverScene: preload");
    }
  
    create(data) {
      console.log("GameOverScene: create", data);
      // Exibe a mensagem de Game Over e o placar final
      let gameOverText = this.add.text(960, 400, 'GAME OVER', {
        font: "64px Arial",
        fill: "#ff0000"
      }).setOrigin(0.5, 0.5);
  
      let scoreText = this.add.text(960, 500, 'Placar: ' + (data.score || 0), {
        font: "48px Arial",
        fill: "#ffffff"
      }).setOrigin(0.5, 0.5);
  
      // Instrução para reiniciar o jogo
      let restartText = this.add.text(960, 600, 'Clique para reiniciar', {
        font: "32px Arial",
        fill: "#ffffff"
      }).setOrigin(0.5, 0.5);
  
      // Ao clicar em qualquer lugar, retorna para o menu inicial
      this.input.on('pointerdown', () => {
        this.scene.start('StartMenuScene');
      });
    }
  }
  