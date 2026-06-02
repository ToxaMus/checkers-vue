from flask import Flask, jsonify, request
from flask_cors import CORS
from GameAI import GameAI

app = Flask(__name__)
CORS(app)

aiGame  = GameAI()

@app.route('/health', methods=['GET'])
def get():
    return jsonify({'status': 'ok'})


@app.route('/ai-move', methods=['POST'])
def post():
    try:
        data = request.json()
        board = data.get('board')
        aiColor = data.get('aiColor')

        aiGame.moveAI(board, aiColor)
    except ValueError:
        return jsonify({
            'success': False,
            'error': 'Invalid JSON' 
        }), 500