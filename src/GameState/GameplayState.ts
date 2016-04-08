class GameplayState extends Phaser.State{
    currentText:Phaser.Text;
    currentVerb:number;
    typeOfInteraction:number;
    phase:number;
    timer:Phaser.Timer;
    value:number;
    maxValue:number;
    valueDec:number;
    valueInc:number;
    timerText:Phaser.Text;
    timerOutline:Phaser.Graphics;
    timerGraphics:Phaser.Graphics;
    constructor(){
        super();
    }
    
    create(){
        this.currentVerb = -1;
        Global.taskNumber = 0;
        Global.totalVerbs = Phaser.ArrayUtils.shuffle(Global.totalVerbs);
        
        var style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        this.timerText = this.add.text(this.game.width/2, this.game.height - 105, "Timer", style);
        this.timerText.anchor.set(0.5, 1);
        
        this.timerOutline = this.add.graphics(this.game.width/2, this.game.height - 100);
        this.timerOutline.lineStyle(2, 0xffffff, 1);
        this.timerOutline.drawRect(-250, -3, 500, 6);
        
        this.timerGraphics = this.add.graphics(this.game.width/2, this.game.height - 100);
        this.timerGraphics.beginFill(0xffffff, 1);
        this.timerGraphics.drawRect(-250, -3, 500, 6);
        this.timerGraphics.endFill();
        
        Global.lastText = [];
        
        style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.add.text(this.game.width/2, 10, 
            "(ESC) to get a new life.", style);
        text.anchor.set(0.5, 0);
        
        this.maxValue = 100;
        this.value = 0;
        this.valueDec = 1;
        this.valueInc = 1;
        this.createPlayText();
    }
    
    createBackgroundText(){
        for (var i = 0; i < Global.lastText.length; i++) {
            Global.lastText[i].decreaseAlpha();
        }
        var tempBackground:BackgroundText = new BackgroundText(this.game, 
            this.game.rnd.integerInRange(50, this.game.width - 50), 
            this.game.rnd.integerInRange(0, 1) *  (this.game.height / 2) +
            this.game.rnd.integerInRange(25, this.game.height / 2 - 25),
            "You are now " + Global.totalVerbs[this.currentVerb].presentContinous, 
                Math.random() * 0.5 + 0.5);
        Global.lastText.push(tempBackground);
        this.game.add.existing(tempBackground);
        
        this.createPlayText();
    }
    
    createPlayText(){
        this.game.world.setBounds(-4, -4, this.game.width + 4, this.game.height + 4);
        this.phase = 0;
        this.value = 0;
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        this.currentVerb += 1;
        if(this.currentVerb >= Global.totalVerbs.length){
            Global.totalVerbs = Phaser.ArrayUtils.shuffle(Global.totalVerbs);
            this.currentVerb = 0;
        }
        if(this.currentText != null) this.currentText.destroy(true);
        this.typeOfInteraction = this.game.rnd.integerInRange(0, 1);
        var tempString:string = "Press Space quickly to ";
        if(this.typeOfInteraction == 0){
            tempString = "Press Space to ";
        }
        else if(this.typeOfInteraction == 1){
            tempString = "Don't press Space to ";
        }
        this.currentText = this.game.add.text(this.game.width/2, this.game.height/2 - 30, 
            tempString + Global.totalVerbs[this.currentVerb].infinitive, style);
        Global.failedTask = Global.totalVerbs[this.currentVerb].presentContinous;
        this.currentText.anchor.set(0.5, 0.5);
        this.timer = this.time.create(true);
        this.timer.add(Global.getTime(), this.checkTimer, this);
        this.timer.start();
    }
    
    checkTimer(){
        if(this.typeOfInteraction == 1){
            Global.taskNumber += 1;
            this.createDoneText();
        }
        else{
            this.loseGame();
        }
    }
    
    loseGame(){
        this.game.add.audio("wrong").play("",0,0.25);
        this.currentText.destroy(true);
        this.timerText.destroy(true);
        this.timerGraphics.destroy(true);
        this.timerOutline.destroy(true);
        this.game.state.start("Gameover", false);
    }
    
    createDoneText(){
        this.game.add.audio("right").play("",0,0.25);
        this.phase = 1;
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        if(this.currentText != null) this.currentText.destroy(true);
        this.currentText = this.game.add.text(this.game.width/2, this.game.height/2 - 30, 
            "You are now " + Global.totalVerbs[this.currentVerb].presentContinous, style);
        this.currentText.anchor.set(0.5, 0.5);
        var timer:Phaser.Timer = this.time.create(true);
        timer.add(1500, this.createBackgroundText, this);
        timer.start();
    }
    
    update(){
        this.timerGraphics.scale.set(this.timer.duration / Global.getTime(), 
            1);
        
        if(this.phase == 0){
            if(this.typeOfInteraction == 0){
                if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                    this.timer.destroy();
                    Global.taskNumber += 1;
                    this.createDoneText();
                }
            }
            else if(this.typeOfInteraction == 1){
                if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                    this.timer.destroy();
                    this.loseGame();
                }
            }
        }
        
        if(this.input.keyboard.isDown(Phaser.Keyboard.ESC)){
            this.game.state.start("Gamestart", true);
            this.game.input.keyboard.reset();
        }
        
        if(this.value > this.maxValue){
            this.value = this.maxValue;
            this.timer.destroy();
            Global.taskNumber += 1;
            this.createDoneText();
        }
    }
}