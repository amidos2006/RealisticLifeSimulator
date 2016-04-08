class GameStartState extends Phaser.State{
    constructor(){
        super();
    }
    
    preload(){
        
    }
    
    create(){
        if(Global.music == null){
            Global.music = this.game.add.audio("music");
            Global.music.loop = true;
        }
        if(!Global.music.isPlaying){
            Global.music.play();
        }
        
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.add.text(this.game.width/2, this.game.height/2 - 10, 
            "Realistic Life Simulator", style);
        text.anchor.set(0.5, 0.5);
        
        style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        text = this.add.text(this.game.width/2, this.game.height - 10, 
            "Press Space to begin your life.", style);
        text.anchor.set(0.5, 1);
        
        text = this.add.text(this.game.width/2, 10, 
            "(ESC) to change your species.", style);
        text.anchor.set(0.5, 0);
    }
    
    update(){
        if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
            this.input.activePointer.isDown){
            this.game.state.start("Gameplay", true);
            this.game.input.keyboard.reset();
        }
        if(this.input.keyboard.isDown(Phaser.Keyboard.ESC)){
            this.game.state.start("Gameinput", true);
            this.game.input.keyboard.reset();
        }
    }
}