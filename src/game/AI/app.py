from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def getStatus():
    return {'status': True}

if __name__ == '__main__':
    app.run(debug=True, port=5000)