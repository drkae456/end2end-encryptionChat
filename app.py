from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

messages = []
message_id = 0

@app.route('/')
def index():
    global messages, message_id
    messages = []
    message_id = 0
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    global message_id
    message = request.json['message']
    sender = request.json['sender']
    recipient = request.json['recipient']
    message_id += 1
    messages.append({'id': message_id, 'content': message, 'sender': sender, 'recipient': recipient})
    return jsonify({'success': True})

@app.route('/get_messages', methods=['GET'])
def get_messages():
    last_message_id = int(request.args.get('last_message_id', 0))
    new_messages = [message for message in messages if message['id'] > last_message_id]
    return jsonify({'messages': new_messages})

if __name__ == '__main__':
    app.run(debug=True)