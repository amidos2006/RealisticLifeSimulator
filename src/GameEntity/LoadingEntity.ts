class LoadingEntity extends Phaser.Group{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        this.x = x;
        this.y = y;
        
        var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = new Phaser.Text(game, 0, 0, "... Loading a new life ...", style);
        text.anchor.set(0.5, 0.5);
        this.add(text);
        
        style = { font: "16px Arial", fill: "#ffffff", align: "center" };
        text = new Phaser.Text(game, 0, 32, "please be patient loading a life takes time", style);
        text.anchor.set(0.5, 0.5);
        this.add(text);
    }
}