from flask import Flask, request, jsonify, g
import sqlite3

# Inicializando a aplicação Flask
app = Flask(__name__)

# Definindo o banco de dados SQLite
DATABASE = 'database.db'

def get_db():
    # Conecta ao banco de dados
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Inicializa o banco de dados e cria uma tabela
def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL
            )
        ''')
        db.commit()

@app.route('/users', methods=['GET'])
def get_users():
    # Retorna todos os usuários
    cursor = get_db().cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    return jsonify(users)

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Retorna um usuário específico
    cursor = get_db().cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user)

@app.route('/users', methods=['POST'])
def add_user():
    # Adiciona um novo usuário
    new_user = request.json
    name = new_user.get('name')
    age = new_user.get('age')
    
    if not name or not isinstance(age, int):
        return jsonify({'error': 'Invalid data'}), 400

    cursor = get_db().cursor()
    cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', (name, age))
    get_db().commit()
    return jsonify({'message': 'User added successfully!'}), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Atualiza um usuário existente
    updated_user = request.json
    name = updated_user.get('name')
    age = updated_user.get('age')

    if not name or not isinstance(age, int):
        return jsonify({'error': 'Invalid data'}), 400

    cursor = get_db().cursor()
    cursor.execute('UPDATE users SET name = ?, age = ? WHERE id = ?', (name, age, user_id))
    get_db().commit()

    if cursor.rowcount == 0:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'message': 'User updated successfully!'})

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Deleta um usuário
    cursor = get_db().cursor()
    cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
    get_db().commit()

    if cursor.rowcount == 0:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'message': 'User deleted successfully!'})

if __name__ == '__main__':
    # Inicializa o banco de dados
    init_db()
    # Executa a aplicação Flask
    app.run(debug=True)
