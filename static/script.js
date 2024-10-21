$(document).ready(function() {
    var privateKeys = {};
    var isKey1Confirmed = false;
    var isKey2Confirmed = false;
    var username1 = '';
    var username2 = '';
    var lastMessageId = 0;

    $('#username-box1').show();
    $('#username-input1').focus();
    $('#username-box2').show();

    $('#set-username1').click(function() {
        username1 = $('#username-input1').val().trim();
        if (username1 !== '') {
            $('#username-box1').hide();
            $('#chat-header1').text(username1);
            generatePrivateKey(username1, '#private-key1');
            $('#private-key-box1').show();
            $('#key-input1').show();
        }
    });

    $('#set-username2').click(function() {
        username2 = $('#username-input2').val().trim();
        if (username2 !== '') {
            $('#username-box2').hide();
            $('#chat-header2').text(username2);
            generatePrivateKey(username2, '#private-key2');
            $('#private-key-box2').show();
            $('#key-input2').show();
        }
    });

    function generatePrivateKey(username, elementId) {
        var privateKey = CryptoJS.lib.WordArray.random(16).toString();
        privateKeys[username] = privateKey;
        $(elementId).text('Private Key: ' + privateKey);
    }

    $('#regenerate-key1').click(function() {
        generatePrivateKey(username1, '#private-key1');
        isKey1Confirmed = false;
        $('#key-status1').text('Private key has been changed. Please confirm the new key.');
        $('#chat1').empty();
        $('#chat-box1').hide();
        disconnectChat(username2);
    });

    $('#regenerate-key2').click(function() {
        generatePrivateKey(username2, '#private-key2');
        isKey2Confirmed = false;
        $('#key-status2').text('Private key has been changed. Please confirm the new key.');
        $('#chat2').empty();
        $('#chat-box2').hide();
        disconnectChat(username1);
    });

    function disconnectChat(recipient) {
        var message = 'Private key from the other user has been changed.';
        $('#chat' + (recipient === username1 ? '1' : '2')).append('<div class="chat-message system"><p>' + message + '</p></div>');
    }

    $('#confirm-key1').click(function() {
        var enteredKey = $('#other-key1').val().trim();
        if (enteredKey === privateKeys[username2]) {
            isKey1Confirmed = true;
            $('#key-status1').text('Key confirmed!');
            $('#chat-box1').show();
        } else {
            $('#key-status1').text('Invalid key!');
        }
    });

    $('#confirm-key2').click(function() {
        var enteredKey = $('#other-key2').val().trim();
        if (enteredKey === privateKeys[username1]) {
            isKey2Confirmed = true;
            $('#key-status2').text('Key confirmed!');
            $('#chat-box2').show();
        } else {
            $('#key-status2').text('Invalid key!');
        }
    });

    $('#send-message1').click(function() {
        sendMessage(username1, username2, '#message1', '#chat1');
    });

    $('#send-message2').click(function() {
        sendMessage(username2, username1, '#message2', '#chat2');
    });

    $('#message1').keypress(function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            sendMessage(username1, username2, '#message1', '#chat1');
        }
    });

    $('#message2').keypress(function(event) {
        if (event.which === 13) { // Enter key
            event.preventDefault();
            sendMessage(username2, username1, '#message2', '#chat2');
        }
    });

    function sendMessage(sender, recipient, messageInputSelector, chatSelector) {
        var isKeyConfirmed = sender === username1 ? isKey1Confirmed : isKey2Confirmed;
        if (isKeyConfirmed) {
            var messageInput = $(messageInputSelector);
            var message = messageInput.val();
            if (message.trim() !== '') {
                var encryptedMessage = CryptoJS.AES.encrypt(message, privateKeys[recipient]).toString();
                var encryptedSender = CryptoJS.AES.encrypt(sender, privateKeys[recipient]).toString();
                var encryptedRecipient = CryptoJS.AES.encrypt(recipient, privateKeys[sender]).toString();
                $(chatSelector).append('<div class="chat-message sent"><p>' + message + '</p></div>');
                messageInput.val('');

                $.ajax({
                    url: '/send_message',
                    type: 'POST',
                    data: JSON.stringify({ message: encryptedMessage, sender: encryptedSender, recipient: encryptedRecipient }),
                    contentType: 'application/json',
                    success: function(response) {
                        logRequest('POST', '/send_message', JSON.stringify({ message: encryptedMessage, sender: encryptedSender, recipient: encryptedRecipient }));
                        logResponse(JSON.stringify(response));
                    }
                });
            }
        } else {
            alert('Please confirm the private shared key before sending a message.');
        }
    }

    function receiveMessage(encryptedMessage, encryptedSender, encryptedRecipient) {
        var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, privateKeys[username1]).toString(CryptoJS.enc.Utf8);
        var decryptedSender = CryptoJS.AES.decrypt(encryptedSender, privateKeys[username1]).toString(CryptoJS.enc.Utf8);
        var decryptedRecipient = CryptoJS.AES.decrypt(encryptedRecipient, privateKeys[username2]).toString(CryptoJS.enc.Utf8);
        
        if (decryptedRecipient === username1) {
            $('#chat1').append('<div class="chat-message received"><p><strong>' + decryptedSender + ':</strong> ' + decryptedMessage + '</p></div>');
        } else if (decryptedRecipient === username2) {
            $('#chat2').append('<div class="chat-message received"><p><strong>' + decryptedSender + ':</strong> ' + decryptedMessage + '</p></div>');
        }
    }

    setInterval(function() {
        $.ajax({
            url: '/get_messages',
            type: 'GET',
            data: { last_message_id: lastMessageId },
            success: function(response) {
                logRequest('GET', '/get_messages', '');
                logResponse(JSON.stringify(response));
                response.messages.forEach(function(message) {
                    if (message.id > lastMessageId) {
                        receiveMessage(message.content, message.sender, message.recipient);
                        lastMessageId = message.id;
                    }
                });
            }
        });
    }, 1000);


    function logRequest(method, url, data) {
        var log = '<strong>Request:</strong> ' + method + ' ' + url;
        if (data !== '') {
            log += ' - Data: ' + data;
        }
        $('#server-logs').append('<p>' + log + '</p>');
    }

    function logResponse(response) {
        var log = '<strong>Response:</strong> ' + response;
        $('#server-logs').append('<p>' + log + '</p>');
    }

    window.onbeforeunload = function() {
        privateKeys = {};
        isKey1Confirmed = false;
        isKey2Confirmed = false;
        username1 = '';
        username2 = '';
        lastMessageId = 0;
        $('#chat1').empty();
        $('#chat2').empty();
        $('#server-logs').empty();
    };
});