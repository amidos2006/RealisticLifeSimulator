class GameInputState extends Phaser.State{
    static firstTime:boolean = true;
    goodExamples:string[] = ["stone", "dick", "smoke", "cum", "robot", "cactus", "life", "kitty", "condom", "vagina", "penis"];
    inputText:InputEntity;
    constructor(){
        super();
    }
    
    create(){
        if(GameInputState.firstTime){
            GameInputState.firstTime = false;
            var color:number = Global.getRandomColor(this.game, null);
            this.game.world.stage.setBackgroundColor(color);
            var r:number = (color >> 16) % 256;
            var g:number = (color >> 8) % 256;
            var b:number = (color) % 256;
            document.body.style.backgroundColor = "rgb(" + r +"," + g + "," + b + ")";
        }
        
        document.getElementById("textData").style.visibility = "visible";
        document.getElementById("textData").focus();
        document.getElementById("textData").style.backgroundColor = document.body.style.backgroundColor;
        
        if(Global.music != null){
            Global.music.stop();
        }
        
        //this.inputText = new InputEntity(this.game, this.game.width/2, this.game.height/2);
        //this.add.existing(this.inputText);
        
        var style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        var textString:string = "Write your Species";
        if(Global.failedLoading){
            textString = "Sorry " + LoadingState.inputText + " doesn't have a life, Choose another Species (e.g. " + 
                this.goodExamples[this.game.rnd.integerInRange(0, this.goodExamples.length - 1)] + ")";
        }
        var text:Phaser.Text = this.add.text(this.game.width/2, this.game.height/2 - 30, 
            textString, style);
        text.anchor.set(0.5, 0.5);
        this.add.existing(text);
        
        style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.add.text(this.game.width/2, this.game.height - 10, 
            "Press Enter to Accept", style);
        text.anchor.set(0.5, 1);
        this.add.existing(text);
    }
    
    update(){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            Global.failedLoading = true;
            document.getElementById("textData").style.visibility = "hidden";
            LoadingState.inputText = (<HTMLInputElement>document.getElementById("textData")).value;
            console.log((<HTMLInputElement>document.getElementById("textData")).value);
            this.game.state.start("Loading", true, false);
            this.game.input.keyboard.reset();
        }
    }
}