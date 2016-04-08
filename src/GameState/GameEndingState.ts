class GameEndingState extends Phaser.State{
    ended:boolean;
    constructor(){
        super();
    }
    
    create(){
        Global.music.stop();
        
        this.ended = false;
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.add.text(this.game.width/2, this.game.height/2 - 25, 
            "You died while " + Global.failedTask, style);
        text.anchor.set(0.5, 0.5);
       
        style = { font: "24px Arial", fill: "#ffffff", align: "center" };
        text = this.add.text(this.game.width/2, this.game.height/2 + 15, 
            "but you functioned for " + Global.taskNumber + " tasks.", style);
        text.anchor.set(0.5, 0.5);
        
        style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        text = this.add.text(this.game.width/2, this.game.height - 10, 
            "Press Space to get a new life.", style);
        text.anchor.set(0.5, 1);
        
        var timer:Phaser.Timer = this.time.create(true);
        timer.add(750, () => { this.ended = true; }, this);
        timer.start();
    }
    
    update(){
        if(this.ended){
            if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || 
                this.input.keyboard.isDown(Phaser.Keyboard.ESC)){
                this.game.state.start("Gamestart", true);
                this.game.input.keyboard.reset();
            }
        }
    }
}