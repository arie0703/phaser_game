var Breakout = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Breakout ()
    {
        Phaser.Scene.call(this, { key: 'breakout' });

        this.bricks;
        this.paddle;
        // this.ball;
        this.balls;
        this.gameoverText;
    },

    preload: function ()
    {
        this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
        this.load.image('another_ball','assets/ball2.png')
    },

    create: function ()
    {
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        //  Create the bricks in a 10x6 grid
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
        });

        // this.ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);

        this.balls = this.physics.add.group({
            key: 'another_ball',
            repeat: 2,
            setXY: { x: 300, y: 300, stepX: 100 }
        });

        this.balls.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setCollideWorldBounds(true).setBounce(1);
            child.setData('onPaddle', true);
            
    
        });
        // this.ball.setData('onPaddle', true);

        this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Our colliders
        // this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
        // this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.balls, this.bricks, this.hitBrick, null, this);
        this.physics.add.collider(this.balls, this.paddle, this.hitPaddle, null, this);

        //  Input events
        this.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.paddle.x = pointer.x;

            // if (this.ball.getData('onPaddle'))
            // {
            //     this.ball.x = this.paddle.x;
            // }

            

            

            

        }, this);

        // clickしたらボール動く
        this.input.on('pointerup', function (pointer) {

            // if (this.ball.getData('onPaddle'))
            // {
            //     this.ball.setVelocity(-75, -300);
            //     console.log(this.ball.getData('onPaddle'))
            //     this.ball.setData('onPaddle', false);
            // }

            this.balls.children.iterate(function (child) {

                if(child.getData('onPaddle')) {
                    child.setVelocity(100, Phaser.Math.FloatBetween(-500.0, -100.0));
                    child.setData('onPaddle', false);
                }
                
        
            });

        }, this);
    },

    hitBrick: function (ball, brick)
    {
        brick.disableBody(true, true);

        if (this.bricks.countActive() === 0)
        {
            this.resetLevel();
        }
    },

    resetBall: function ()
    {
        // this.ball.setVelocity(0);
        this.balls.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setData('onPaddle', true);
            child.setVelocity(0);
            
    
        });
        
        
        // this.ball.setPosition(this.paddle.x, 500);
        // this.ball.setData('onPaddle', true);
    },

    destroyBall: function (i)
    {
        this.balls.children.entries[i].disableBody(true, true);
    },

    

    resetLevel: function ()
    {
        this.resetBall();

        this.bricks.children.each(function (brick) {

            brick.enableBody(false, 0, 0, true, true);

        });
    },

    hitPaddle: function (paddle, ball)
    {
        // ボールのvelocityをいじるとなぜかpaddleが動くようになってる？
        // paddle.velocityいじるとボールが動く謎仕様 要調査

        var diff = 0;
        paddle.setVelocityY(0);

        console.log(ball.x, paddle.x)
        
        if (paddle.x < ball.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = ball.x - paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else if (paddle.x > ball.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(-5 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
        
    },

    update: function ()
    {
        // if (this.ball.y > 600)
        // {
        //     this.resetBall();

        // }

        let resetkey = this.input.keyboard.addKey('R');
        if (this.balls.countActive(true) === 0) {
            this.gameoverText = this.add.text(120,250, "Game Over\nPress down key to reset game.", {fontSize: '35px',fill: '#ffffff'});
            if (resetkey.isDown) {
                this.gameoverText.destroy();
                this.scene.restart();
            }
        } 

        
        for (let i in this.balls.children.entries) {
            if (this.balls.children.entries[i].y > 600) {
                this.destroyBall(i);
            }
        }

        
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);