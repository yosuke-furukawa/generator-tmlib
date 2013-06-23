
;(function(global) {
    var SCREEN_WIDTH    = 465;
    var SCREEN_HEIGHT   = 465;
    var SCREEN_CENTER_X = SCREEN_WIDTH/2;
    var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
    var COLOR_LIST = [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#e74c3c",
        "#f1c40f",
    ];
    var ASCII_UNCO = [
        "   人\n",
        "  (__)\n",
        " (_____)\n",
        "(________)\n"].join('');
    var KENKYO = "https://si0.twimg.com/profile_images/484079620/kenkyo_bigger.jpg";

    var socket = io.connect(location.origin);

    tm.main(function() {
        var app = tm.app.CanvasApp("#world");
        app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
        app.background = "hsla(220, 80%, 98%, 1)";

        app.replaceScene(MainScene());

        app.run();
        
        // setup ui
        setupUI();
    });
    
    var setupUI = function() {
        var inputText = tm.dom.Element("#inputText");
        var sendBtn   = tm.dom.Element("#sendBtn");
        var colorPicker= tm.dom.Element("#colorPicker");
        var buttonList = tm.dom.ElementList("#buttonList button");
        
        inputText.event.add("keydown", function(e) {
            if (e.keyCode == 13) {
                sendComment(inputText.value, colorPicker.value);
            }
        });
        
        sendBtn.event.click(function() {
            sendComment(inputText.value, colorPicker.value);
        });
        
        colorPicker.value = COLOR_LIST.pickup();
        
        buttonList.each(function(elm) {
            elm.event.click(function() {
                var value = elm.attr.get("data-value");
                if (!value) value = elm.text;
                sendComment(value, colorPicker.value);
            })
        });
    };
    
    var sendComment = function(text, color) {
        socket.emit("comment", {
            text: text,
            color: color,
        });
    };

    tm.define("MainScene", {
        superClass: "tm.app.Scene",

        init: function() {
            this.superInit();
            
            var self = this;

            socket.on("comment", function(e) {
                self.comment(e);
            });
            
            this.comment({
                text: "コメントしてね♪",
                color: "black",
            });
        },
        
        update: function(app) {
        },
        
        comment: function(data) {
            var self = this;
            if (/\.(jpg|jpeg|gif|png)/.test(data.text)) {
                var path = data.text;
                var asset = tm.asset.AssetManager.load(path);
                tm.asset.AssetManager.onload = function() {
                    var sprite = CommentSprite(path).addChildTo(self);
                };
            }
            else {
                var label = null;
                if (/(ドン|どん)/.test(data.text)) {
                    label = DonCommentLabel(data);
                }
                else {
                    label = DownUpCommentLabel(data);
                }
                this.addChild(label);
            }
        },
    });
    
    tm.define("CommentSprite", {
        superClass: "tm.app.Sprite",
        
        init: function(path) {
            this.superInit(path);
            
            var MAX_WIDTH = 256;
            var MAX_HEIGHT = 256;
            
            if (this.width >= this.height && this.image.width > MAX_WIDTH) {
                this.scaleX = this.scaleY = MAX_WIDTH/this.image.width;
            }
            else if (this.image.height > MAX_HEIGHT) {
                this.scaleX = this.scaleY = MAX_HEIGHT/this.image.height;
            }

            
            this.x = tm.util.Random.randint(0, SCREEN_WIDTH);
            this.y = SCREEN_HEIGHT + this.height/2;
            
            var self = this;
            this.tweener.move(this.x, -this.height/2, 6 * 1000).call(function() {
                self.remove();
            });
        },
    });
    
    tm.define("CommentLabel", {
        superClass: "tm.app.Label",
        
        init: function(param) {
            this.superInit();
            
            this.text = param.text;
            this.fillStyle = param.color;
            this.shadowBlur = 2;
            this.shadowColor = "#222";
        },
    });
    
    tm.define("DownUpCommentLabel", {
        superClass: "CommentLabel",
        
        init: function(param) {
            this.superInit(param);
            
            var self = this;
            
            this.x = tm.util.Random.randint(0, SCREEN_WIDTH);
            this.y = SCREEN_HEIGHT;
            
            this.align = "center";
            this.tweener.move(this.x, 0, 6 * 1000).call(function() {
                self.remove();
            });
        },
    });
    
    tm.define("DonCommentLabel", {
        superClass: "CommentLabel",
        
        init: function(param) {
            this.superInit(param);
            
            var self = this;
            
            this.x = tm.util.Random.randint(0, SCREEN_WIDTH);
            this.y = tm.util.Random.randint(0, SCREEN_HEIGHT);
            
            this.fontWeight = "bold";
            this.fontSize=128;
            this.align = "center";
            this.baseline = "middle";
            
            this.tweener.fadeOut().call(function() {
                self.remove();
            });
        },
    });

})(this);












