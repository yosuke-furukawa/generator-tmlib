<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8">
        <title>{{ title }}</title>
        <link rel='stylesheet' href='/vendor/bootstrap/bootstrap.css'>
        <link rel='stylesheet' href='/stylesheets/style.css'>
        <script src="/socket.io/socket.io.js"></script>
        <script src="/vendor/tmlib.js/tmlib.js"></script>
        <script src="/javascripts/main.js"></script>
    </head>
    <body>
    {% set yosuke = "https://si0.twimg.com/profile_images/206948941/wall-e_bigger.jpg" %}
    {% set phi = "https://si0.twimg.com/profile_images/484079620/kenkyo_bigger.jpg" %}
        <div class="content">
            <div>
                <canvas id="world"></canvas>
            </div>
            <br />
            <div class="input-append">
                <input id="colorPicker" class="span1" type="color" value="" />
                <input id="inputText" class="span4" type="text" value="Hello, node.js" />
                <button id="sendBtn" class="btn btn-primary" type="button">Send</button>
            </div>
            <div id="buttonList">
                <button class="btn">いいね</button>
                <button class="btn">へぇ〜</button>
                <button class="btn">なんですと！</button>
                <button class="btn">ドン</button>
                <button class="btn">うんこ</button>
                <button class="btn" data-value="{{ yosuke }}">天才</button>
                <button class="btn" data-value="{{ phi }}">謙虚</button>
            </div>
        </div>
    </body>
</html>
