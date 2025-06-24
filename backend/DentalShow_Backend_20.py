import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt


app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "upload", "exames")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.config['JSON_AS_ASCII'] = False
app.config['SECRET_KEY'] = 'minha-chave-super-secreta'  # Pode inventar algo forte
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dentista.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

### MODELOS

class Paciente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    endereco = db.Column(db.String(200))
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)

    def to_dict(self):
        return dict(
            id=self.id,
            nome=self.nome,
            endereco=self.endereco,
            telefone=self.telefone,
            email=self.email,
            cpf=self.cpf,
        )

class Agendamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)
    procedimento = db.Column(db.String(200))
    paciente = db.relationship("Paciente")

    def to_dict(self):
        return dict(
            id=self.id,
            paciente_id=self.paciente_id,
            data=self.data_hora.strftime('%Y-%m-%dT%H:%M') if self.data_hora else None,
            procedimento=self.procedimento,
            observacao=self.observacao if hasattr(self, 'observacao') else "",
            paciente_nome=self.paciente.nome if hasattr(self, 'paciente') and self.paciente else "",
        )

class Receituario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    data = db.Column(db.String(25), default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M'))
    paciente = db.relationship("Paciente")

    def to_dict(self):
        return dict(
            id=self.id,
            paciente_id=self.paciente_id,
            texto=self.texto,
            data=self.data
        )

class Prontuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    anotacao = db.Column(db.Text, nullable=False)
    data = db.Column(db.String(25), default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M'))
    paciente = db.relationship("Paciente")

    def to_dict(self):
        return dict(
            id=self.id,
            paciente_id=self.paciente_id,
            anotacao=self.anotacao,
            data=self.data
        )

class Exame(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.String(200))
    data_upload = db.Column(db.String(25), default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M'))
    paciente = db.relationship("Paciente")

    def to_dict(self):
        return dict(
            id=self.id,
            paciente_id=self.paciente_id,
            filename=self.filename,
            descricao=self.descricao,
            data_upload=self.data_upload
        )

class Pagamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    forma_pagamento = db.Column(db.String(50))
    data = db.Column(db.String(25), default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M'))
    paciente = db.relationship("Paciente")

    def to_dict(self):
        return dict(
            id=self.id,
            paciente_id=self.paciente_id,
            valor=self.valor,
            forma_pagamento=self.forma_pagamento,
            data=self.data
        )

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)

def gerar_token(usuario_id):
    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.utcnow() + timedelta(hours=12)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

class ProdutoServico(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    ativo = db.Column(db.Boolean, default=True)  # habilitar/desabilitar

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "valor": self.valor,
            "ativo": self.ativo,
        }

### ROTAS GERAIS

@app.route('/')
def home():
    return {"message": "Bem-vindo ao sistema DentalShow!"}, 200

@app.route("/auth/register", methods=["POST"])
@cross_origin(supports_credentials=True)
def registrar_usuario():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"erro": "Campos obrigatórios ausentes"}), 400

    if Usuario.query.filter_by(username=data["username"]).first():
        return jsonify({"erro": "Usuário já existe"}), 400

    senha_hash = generate_password_hash(data["password"])
    novo_usuario = Usuario(username=data["username"], senha=senha_hash)
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({"mensagem": "Usuário registrado com sucesso"}), 201

@app.route("/auth/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login_usuario():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"erro": "Campos obrigatórios ausentes"}), 400

    usuario = Usuario.query.filter_by(username=data["username"]).first()
    if not usuario or not check_password_hash(usuario.senha, data["password"]):
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401

    token = gerar_token(usuario.id)
    return jsonify({"token": token})

### PACIENTES

@app.route('/pacientes', methods=['GET'])
def get_pacientes():
    return jsonify([p.to_dict() for p in Paciente.query.all()])

@app.route('/pacientes/<int:id>', methods=['GET'])
def get_paciente(id):
    paciente = Paciente.query.get(id)
    if not paciente:
        return jsonify({"error": "Paciente não encontrado"}), 404
    return jsonify({
        "id": paciente.id,
        "nome": paciente.nome,
        "cpf": paciente.cpf,
        "telefone": paciente.telefone,
        "email": paciente.email,
        "endereco": paciente.endereco
        # coloque outros campos se tiver
    })

@app.route('/pacientes', methods=['POST'])
def add_paciente():
    data = request.json
    novo = Paciente(
        nome=data['nome'],
        endereco=data.get('endereco'),
        telefone=data.get('telefone'),
        email=data['email'],
        cpf=data['cpf']
    )
    db.session.add(novo)
    db.session.commit()
    return {"message": "Paciente criado com sucesso!", "paciente": novo.to_dict()}, 201

@app.route('/pacientes/<int:id>', methods=['PUT'])
def update_paciente(id):
    p = Paciente.query.get(id)
    if not p: return {"error": "Paciente não encontrado"}, 404
    data = request.json
    for campo in ['nome','endereco','telefone','email','cpf']:
        if campo in data: setattr(p, campo, data[campo])
    db.session.commit()
    return {"message": "Paciente atualizado com sucesso!", "paciente": p.to_dict()}, 200

@app.route('/pacientes/<int:id>', methods=['DELETE'])
def delete_paciente(id):
    p = Paciente.query.get(id)
    if not p: return {"error": "Paciente não encontrado"}, 404
    db.session.delete(p)
    db.session.commit()
    return {"message": "Paciente excluído com sucesso!"}, 200

### AGENDAMENTOS

@app.route('/agendamentos', methods=['GET'])
def get_agendamentos():
    return jsonify([a.to_dict() for a in Agendamento.query.all()])

@app.route('/agendamentos', methods=['POST'])
def add_agendamento():
    data = request.json
    novo = Agendamento(
        paciente_id=data['paciente_id'],
        data_hora = datetime.fromisoformat(data['data']),  # Agora pega o mesmo nome do frontend
        procedimento=data.get('procedimento')
    )
    db.session.add(novo)
    db.session.commit()
    return {"message": "Agendamento criado com sucesso!", "agendamento": novo.to_dict()}, 201

@app.route('/agendamentos/<int:id>', methods=['PUT'])
def update_agendamento(id):
    ag = Agendamento.query.get(id)
    if not ag: return {"error": "Agendamento não encontrado"}, 404
    data = request.json
    if 'data_hora' in data and isinstance(data['data_hora'], str):
        try:
            data['data_hora'] = datetime.fromisoformat(data['data_hora'])
        except Exception:
            return {"error": "Data/hora inválida!"}, 400
    for campo in ['paciente_id','data_hora','procedimento']:
        if campo in data: setattr(ag, campo, data[campo])
    db.session.commit()
    return {"message": "Agendamento atualizado com sucesso!", "agendamento": ag.to_dict()}, 200

@app.route('/agendamentos/<int:id>', methods=['DELETE'])
def delete_agendamento(id):
    ag = Agendamento.query.get(id)
    if not ag: return {"error": "Agendamento não encontrado"}, 404
    db.session.delete(ag)
    db.session.commit()
    return {"message": "Agendamento excluído com sucesso!"}, 200

### RECEITUÁRIOS

@app.route('/receituarios', methods=['GET'])
def get_receituarios():
    return jsonify([r.to_dict() for r in Receituario.query.all()])

@app.route('/agendamentos/<int:id>', methods=['GET'])
def get_agendamento(id):
    agendamento = Agendamento.query.get(id)
    if not agendamento:
        return jsonify({"error": "Agendamento não encontrado"}), 404
    return jsonify(agendamento.to_dict()), 200    

@app.route('/receituarios', methods=['POST'])
def add_receituario():
    data = request.json
    novo = Receituario(
        paciente_id=data['paciente_id'],
        texto=data['texto'],
        data=datetime.now().strftime('%Y-%m-%d %H:%M')
    )
    db.session.add(novo)
    db.session.commit()
    return {"message": "Receituário criado com sucesso!", "receituario": novo.to_dict()}, 201

@app.route('/receituarios/<int:id>', methods=['PUT'])
def update_receituario(id):
    receituario = Receituario.query.get(id)
    if not receituario:
        return {"error": "Receituário não encontrado"}, 404
    data = request.json
    if "texto" in data:
        receituario.texto = data["texto"]
    db.session.commit()
    return {"message": "Receituário atualizado com sucesso!", "receituario": receituario.to_dict()}, 200

@app.route('/receituarios/<int:id>', methods=['DELETE'])
def delete_receituario(id):
    receituario = Receituario.query.get(id)
    if not receituario:
        return {"error": "Receituário não encontrado"}, 404
    db.session.delete(receituario)
    db.session.commit()
    return {"message": "Receituário excluído com sucesso!"}, 200


### PRONTUÁRIOS

@app.route('/prontuarios', methods=['GET'])
def get_prontuarios():
    return jsonify([p.to_dict() for p in Prontuario.query.all()])

@app.route('/prontuarios', methods=['POST'])
def add_prontuario():
    data = request.json
    novo = Prontuario(
        paciente_id=data['paciente_id'],
        anotacao=data['anotacao'],
        data=datetime.now().strftime('%Y-%m-%d %H:%M')
    )
    db.session.add(novo)
    db.session.commit()
    return {"message": "Prontuário criado com sucesso!", "prontuario": novo.to_dict()}, 201

@app.route('/prontuarios/<int:id>', methods=['DELETE'])
def delete_prontuario(id):
    prontuario = Prontuario.query.get(id)
    if not prontuario:
        return {"error": "Prontuário não encontrado"}, 404
    db.session.delete(prontuario)
    db.session.commit()
    return {"message": "Prontuário excluído com sucesso!"}, 200

@app.route('/prontuarios/<int:id>', methods=['PUT'])
def update_prontuario(id):
    prontuario = Prontuario.query.get(id)
    if not prontuario:
        return {"error": "Prontuário não encontrado"}, 404
    data = request.json
    if "anotacao" in data:
        prontuario.anotacao = data["anotacao"]
    db.session.commit()
    return {"message": "Prontuário atualizado com sucesso!", "prontuario": prontuario.to_dict()}, 200


### EXAMES

@app.route('/exames', methods=['GET'])
def get_exames():
    return jsonify([e.to_dict() for e in Exame.query.all()])

@app.route('/exames', methods=['POST'])
def upload_exame():
    paciente_id = request.form.get('paciente_id')
    descricao = request.form.get('descricao')
    file = request.files.get('file')
    if not paciente_id or not file:
        return {"error": "Informe paciente_id e arquivo!"}, 400
    nome_arquivo = f"{paciente_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    file.save(os.path.join(app.config["UPLOAD_FOLDER"], nome_arquivo))
    novo = Exame(
        paciente_id=int(paciente_id),
        filename=nome_arquivo,
        descricao=descricao,
        data_upload=datetime.now().strftime('%Y-%m-%d %H:%M')
    )
    db.session.add(novo)
    db.session.commit()
    return {"message": "Exame enviado com sucesso!", "exame": novo.to_dict()}, 201

@app.route('/exames/<int:id>/download', methods=['GET'])
def download_exame(id):
    exame = Exame.query.get(id)
    if not exame: return {"error": "Exame não encontrado"}, 404
    return send_from_directory(app.config["UPLOAD_FOLDER"], exame.filename, as_attachment=True)

@app.route('/exames/<int:id>/visualizar', methods=['GET'])
def visualizar_exame(id):
    exame = Exame.query.get(id)
    if not exame: return {"error": "Exame não encontrado"}, 404
    return send_from_directory(app.config["UPLOAD_FOLDER"], exame.filename, as_attachment=False)

@app.route('/exames/<int:id>', methods=['DELETE'])
def delete_exame(id):
    exame = Exame.query.get(id)
    if not exame:
        return {"error": "Exame não encontrado"}, 404
    # Remove o arquivo físico também:
    try:
        os.remove(os.path.join(app.config["UPLOAD_FOLDER"], exame.filename))
    except Exception:
        pass
    db.session.delete(exame)
    db.session.commit()
    return {"message": "Exame excluído com sucesso!"}, 200


### PAGAMENTOS

@app.route('/pagamentos', methods=['GET'])
def get_pagamentos():
    return jsonify([p.to_dict() for p in Pagamento.query.all()])

@app.route('/pagamentos', methods=['POST'])
def add_pagamento():
    data = request.json
    novo = Pagamento(
        paciente_id=data['paciente_id'],
        valor=data['valor'],
        forma_pagamento=data.get('forma_pagamento'),
        data=datetime.now().strftime('%Y-%m-%d %H:%M')
    )
    db.session.add(novo)
    db.session.commit()
    return jsonify({"message": "Pagamento registrado com sucesso!", "pagamento": novo.to_dict()}), 201
    
@app.route('/pagamentos/<int:id>', methods=['PUT'])
def update_pagamento(id):
    pagamento = Pagamento.query.get(id)
    if not pagamento:
        return {"error": "Pagamento não encontrado"}, 404
    data = request.json
    if "valor" in data:
        pagamento.valor = data["valor"]
    if "forma_pagamento" in data:
        pagamento.forma_pagamento = data["forma_pagamento"]
    db.session.commit()
    return {"message": "Pagamento atualizado com sucesso!", "pagamento": pagamento.to_dict()}, 200

@app.route('/pagamentos/<int:id>', methods=['DELETE'])
def delete_pagamento(id):
    pagamento = Pagamento.query.get(id)
    if not pagamento:
        return {"error": "Pagamento não encontrado"}, 404
    db.session.delete(pagamento)
    db.session.commit()
    return {"message": "Pagamento excluído com sucesso!"}, 200

### RECURSO WHATSAPP (simulado)

@app.route('/whatsapp/send', methods=['POST'])
def send_whatsapp():
    data = request.json
    telefone = data.get('telefone')
    mensagem = data.get('mensagem')
    if not telefone or not mensagem:
        return {"error": "Telefone e mensagem obrigatórios"}, 400
    # Simula envio
    return {
        "message": f"Mensagem enviada para {telefone} (simulação).",
        "conteudo": mensagem,
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M')
    }, 200

# Listar todos (ou só ativos se quiser)
@app.route("/produtos_servicos", methods=["GET"])
def listar_produtos_servicos():
    todos = ProdutoServico.query.all()
    return jsonify([p.to_dict() for p in todos])

# Criar novo
@app.route("/produtos_servicos", methods=["POST"])
def criar_produto_servico():
    data = request.json
    novo = ProdutoServico(nome=data["nome"], valor=data["valor"])
    db.session.add(novo)
    db.session.commit()
    return jsonify(novo.to_dict()), 201

# Atualizar (editar)
@app.route("/produtos_servicos/<int:id>", methods=["PUT"])
def editar_produto_servico(id):
    p = ProdutoServico.query.get(id)
    if not p: return {"erro": "Não encontrado"}, 404
    data = request.json
    p.nome = data.get("nome", p.nome)
    p.valor = data.get("valor", p.valor)
    if "ativo" in data: p.ativo = data["ativo"]
    db.session.commit()
    return jsonify(p.to_dict())

# Desabilitar/Habilitar (soft delete)
@app.route("/produtos_servicos/<int:id>/toggle", methods=["POST"])
def toggle_produto_servico(id):
    p = ProdutoServico.query.get(id)
    if not p: return {"erro": "Não encontrado"}, 404
    p.ativo = not p.ativo
    db.session.commit()
    return jsonify(p.to_dict())


# CRIAÇÃO DO BANCO
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
