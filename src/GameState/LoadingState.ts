class LoadingState extends Phaser.State{
    static inputText:string;
    finished:boolean;
    
    constructor(){
        super();
    }
    
    preload(){
        this.add.existing(new LoadingEntity(this.game, this.game.width/2, this.game.height/2));
        this.game.load.audio("right", "assets/right.mp3");
        this.game.load.audio("wrong", "assets/wrong.mp3");
        this.game.load.audio("music", "assets/music.mp3");
        this.game.load.text("verbs", "assets/verbs.txt");
    }
    
    update(){
        var verbs:string[] = Global.getVerbs(LoadingState.inputText);
        
        // if(verbs.length <= Global.minAcceptableVerbs){
        //     var temp:string[] = Global.getAlternativeVerbs(LoadingState.inputText);
        //     verbs = verbs.concat(temp);
        // }
        
        var similarNouns:string[] = Global.getSimilarWords(LoadingState.inputText);
        if(verbs.length <= Global.minAcceptableVerbs){
            for(var i:number=0; i < similarNouns.length; i++){
                var temp:string[] = Global.getVerbs(similarNouns[i]);
                verbs = verbs.concat(temp);
                if(verbs.length > Global.minAcceptableVerbs){
                    break;
                }
            }
        }
        
        // if(verbs.length <= Global.minAcceptableVerbs){
        //     for(var i:number=0; i < similarNouns.length; i++){
        //         var temp:string[] = Global.getAlternativeVerbs(similarNouns[i]);
        //         verbs = verbs.concat(temp);
        //         if(verbs.length > Global.minAcceptableVerbs){
        //             break;
        //         }
        //     }
        // }
            
        Global.constructVerbs(verbs);
        if(Global.totalVerbs.length > 0){
            this.game.state.start("Gamestart", true, false);
            this.game.world.stage.setBackgroundColor(Global.getRandomColor(this.game, LoadingState.inputText));
            var r:number = (Global.getRandomColor(this.game, LoadingState.inputText) >> 16) % 256;
            var g:number = (Global.getRandomColor(this.game, LoadingState.inputText) >> 8) % 256;
            var b:number = (Global.getRandomColor(this.game, LoadingState.inputText)) % 256;
            document.body.style.backgroundColor = "rgb(" + r +"," + g + "," + b + ")";
            Global.failedLoading = false;
        }
        else{
            this.game.state.start("Gameinput", true, false);
        }
    }
}