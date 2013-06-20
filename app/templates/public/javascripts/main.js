
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
                sendComment(elm.text, colorPicker.value);
            })
        })
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
            var label = null;
            if (/(ドン|どん)/.test(data.text)) {
                label = DonCommentLabel(data).addChildTo(this);
            }
            else {
                label = DownUpCommentLabel(data).addChildTo(this);
            }
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












