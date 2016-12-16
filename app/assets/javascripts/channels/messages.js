App.messages = App.cable.subscriptions.create("MessagesChannel", {
    connected: function () {
        // Called when the subscription is ready for use on the server
    },

    disconnected: function () {
        // Called when the subscription has been terminated by the server
    },

    received: function (data) {
        // Called when there's incoming data on the websocket for this channel
        // Проверяем есть ли свободные ячейки. Если нет, генерируем новые. Вставляем сообщение.
        if (!haveEmptySpace()) {
            appendGrid(6, 6);
        }
        console.log('hi');
        var message = data['message'];
        console.log(typeof message);
        var messagesContainers = document.querySelectorAll('.messages-container');
        var firstContainer = messagesContainers[0];
        var messageHolders = firstContainer.querySelectorAll('.message-item');
        for (var i = 0; i < messageHolders.length; i++) {
            var messageHolder = messageHolders[i];
            if (messageHolder.innerHTML === '') {
                // Выбираем куда вставлять.
                console.log('can insert');
                messageHolder.innerHTML = message;
                break;
            }
        }
    },

    speak: function (message) {
        return this.perform('speak', {
            message: message
        });
    }
});

var msnry;

document.addEventListener('DOMContentLoaded', function () {
    var elem = document.querySelector('.messages-container');
    msnry = new Masonry(elem, {
        itemSelector: '.message-item',
        columnWidth: 200
    });
});

var domLoaded = function () {
    var sendButton = document.querySelector('.send-button');
    sendButton.addEventListener('click', sendMessage);
};

function sendMessage() {
    var messageInput = document.querySelector('.message-input');
    var messageContent = messageInput.value;
    App.messages.speak(messageContent);
    messageInput.value = '';
}

document.addEventListener('DOMContentLoaded', domLoaded);

function haveEmptySpace() {
    console.log('check EmptySpace');
    var messagesContainers = document.querySelectorAll('.messages-container');
    var firstContainer = messagesContainers[0];
    var messageHolders = firstContainer.querySelectorAll('.message-item');
    for (var i = 0; i < messageHolders.length; i++) {
        var messageHolder = messageHolders[i];
        if (messageHolder.innerHTML === '') {
            console.log('haveEmptySpace');
            return true;
        }
    }
    console.log('!haveEmptySpace');
    return false;
}

function appendGrid(m, n) {
    console.log('appendGrid');
    var numberOfRows = m;
    var numberOfColumns = n;

    var root = document.querySelector('.root');
    var windowWidth = root.width;
    var windowHeight = root.height;
    console.log(windowWidth);
    console.log(windowHeight);
    // var columnWidth = windowWidth / numberOfColumns;
    // var rowHeight = windowHeight / numberOfRows;

    var field = generate(numberOfRows, numberOfColumns);

    var messagesContainer = document.querySelector('.messages-container');

    for (var i = 0; i < field.length; i++) {
        var cell = field[i];
        var div = document.createElement('div');
        div.className = 'message-item' +
            ' message-item-width-' + cell.width +
            ' message-item-height-' + cell.height;
        messagesContainer.insertBefore(div, messagesContainer.firstChild);
    }
    msnry.reloadItems();
    msnry.layout();
}

function generate(m, n) {
    var randomField = [];

    for (var i = 0; i < m; i++) {
        randomField[i] = [];
        for (var j = 0; j < n; j++) {
            randomField[i][j] = {value: Math.floor(Math.random() * 3), checked: false};
        }
    }

    var finalList = [];

    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            if (randomField[i][j].checked === true) {
                continue;
            }
            var value = randomField[i][j].value;
            if (j !== n - 1) {
                var right = randomField[i][j + 1].value;
                if (i !== m - 1) {
                    var down = randomField[i + 1][j].value;
                    if (right === value && down === value) {
                        var rightDown = randomField[i + 1][j + 1].value;
                        if (rightDown === value) {
                            // пилим квадрат 2х2
                            finalList.push({width: 2, height: 2});
                            randomField[i][j].checked = true;
                            randomField[i][j + 1].checked = true;
                            randomField[i + 1][j].checked = true;
                            randomField[i + 1][j + 1].checked = true;
                            continue;
                        }
                        // выбираем право или низ
                        var randomDirection = Math.floor(Math.random() * 2);
                        if (randomDirection === 0) {
                            // пилим 1х2 вниз и проверяем дальшше вниз
                            finalList.push({width: 1, height: 2});
                            randomField[i][j].checked = true;
                            randomField[i + 1][j].checked = true;
                        } else {
                            // пилим 2х1 вправо и проверяем дальше вправо
                            finalList.push({width: 2, height: 1});
                            randomField[i][j].checked = true;
                            randomField[i][j + 1].checked = true;
                        }
                        continue;
                    }
                    if (down === value) {
                        // пилим 1х2 вниз и проверяем дальшше вниз
                        finalList.push({width: 1, height: 2});
                        randomField[i][j].checked = true;
                        randomField[i + 1][j].checked = true;
                        continue;
                    }
                }
                if (right === value) {
                    // пилим 2х1 вправо и проверяем дальше вправо
                    finalList.push({width: 2, height: 1});
                    randomField[i][j].checked = true;
                    randomField[i][j + 1].checked = true;
                    continue;
                }
            }
            if (i !== m - 1) {
                var down2 = randomField[i + 1][j].value;
                if (down2 === value) {
                    // пилим 1х2 вниз и проверяем дальшше вниз
                    finalList.push({width: 1, height: 2});
                    randomField[i][j].checked = true;
                    randomField[i + 1][j].checked = true;
                    continue;
                }
            }
            // одиночная ячейка
            finalList.push({width: 1, height: 1});
            randomField[i][j].checked = true;
        }
    }
    
    return finalList;
}
