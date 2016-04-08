class InputEntity extends Phaser.Group{
    currentString:string;
    addedString:Phaser.Text;
    timer:Phaser.Timer;
    inputText:Phaser.Text;
    spaceText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        this.currentString = "";
        this.x = x;
        this.y= y;
        
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        
        this.addedString = new Phaser.Text(game, 0, 
            0, "", style);
        this.addedString.anchor.set(0.5, 0.5);
        this.add(this.addedString);
        
        this.inputText = new Phaser.Text(game, 0, 
            0, this.currentString, style);
        this.inputText.anchor.set(0.5, 0.5);
        this.add(this.inputText);
        this.timer = this.game.time.create(false);
        this.timer.loop(250, ()=>{ 
            if(this.addedString.text.length == 0) 
                this.addedString.text = "_"; 
            else
                this.addedString.text = "";
            this.addedString.anchor.set(0.5, 0.5);
            }, this);
        this.timer.start();
    }
    
    destroy(){
        super.destroy();
        this.timer.destroy();
    }
    
    update(){
        this.inputText.text = this.currentString;
        this.inputText.anchor.set(0.5, 0.5);
        this.addedString.x = this.inputText.width / 2 + this.addedString.width / 2;
        
        for(var i:number = Phaser.Keyboard.A; i<= Phaser.Keyboard.Z; i++){
            if(this.game.input.keyboard.isDown(i)){
                this.currentString += this.game.input.keyboard.lastChar;
                this.game.input.keyboard.reset();
            }
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)){
            if(this.currentString.length > 0){
                this.currentString = this.currentString.substr(0, this.currentString.length - 1);
            }
            this.game.input.keyboard.reset();
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.currentString += " ";
            this.game.input.keyboard.reset();
        }
    }
}