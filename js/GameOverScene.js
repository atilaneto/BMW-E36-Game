
export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    preload() {
      console.log("GameOverScene: preload");
    }
  
    create(data) {
      console.log("GameOverScene: create", data);
      //isso aqui exibe a mensagem de Game Over e o placar final (que sempre é o mesmo)
      let gameOverText = this.add.text(960, 400, 'GAME OVER', {
        font: "64px Arial",
        fill: "#ff0000"
      }).setOrigin(0.5, 0.5);
  
      let scoreText = this.add.text(960, 500, 'Placar: ' + (data.score || 0), {
        font: "48px Arial",
        fill: "#ffffff"
      }).setOrigin(0.5, 0.5);
  
      //instrução para reiniciar o jogo, só clicar na tela e jogar de novo
      let restartText = this.add.text(960, 600, 'Clique para reiniciar', {
        font: "32px Arial",
        fill: "#ffffff"
      }).setOrigin(0.5, 0.5);
  
      //ao clicar em qualquer lugar, retorna para o menu inicial, assim como disse no comentário de cima ^
      this.input.on('pointerdown', () => {
        this.scene.start('StartMenuScene');
      });
    }
  }
  