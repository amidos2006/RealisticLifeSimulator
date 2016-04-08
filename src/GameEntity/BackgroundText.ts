class BackgroundText extends Phaser.Text{
    speed:number;
    direction:number;
    targetAlpha:number;
    constructor(game:Phaser.Game, x:number, y:number, text:string, alpha:number){
        super(game, x, y, text, {font: "16px Arial", fill: "#ffffff", align: "center"});
        
        this.anchor.set(0.5, 0.5);
        this.alpha = 0;
        this.targetAlpha = alpha;
        
        this.direction = 2 * this.game.rnd.integerInRange(0, 1) - 1;
        this.speed = 0.5;
    }
    
    decreaseAlpha(){
        this.targetAlpha *= 0.9;
        this.alpha = this.targetAlpha;
    }
    
    update(){
        this.x += this.direction * this.speed;
        if(this.direction > 0 && this.x > this.game.width + this.width / 2){
            this.x = -this.width/2;
        }
        if(this.direction < 0 && this.x < -this.width/2){
            this.x = this.game.width + this.width/2;
        }
        
        this.alpha += 0.025;
        if(this.alpha > this.targetAlpha){
            this.alpha = this.targetAlpha;
        }
    }
}