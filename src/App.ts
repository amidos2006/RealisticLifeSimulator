class SimpleGame {
    game: Phaser.Game;
    
    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
        
        this.game.state.add("Gameplay", GameplayState, false);
        this.game.state.add("Gameover", GameEndingState, false);
        this.game.state.add("Gamestart", GameStartState, false);
        this.game.state.add("Gameinput", GameInputState, false);
        this.game.state.add("Loading", LoadingState, false);
        
        this.game.state.start("Gameinput", false, false);
    }
}

window.onload = () => {
    var game:SimpleGame = new SimpleGame();
};