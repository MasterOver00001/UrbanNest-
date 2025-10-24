from src.models.user import db
from datetime import datetime

class Imovel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    tipo = db.Column(db.String(50), nullable=False)  # apartamento, casa, loft, studio
    preco = db.Column(db.Float, nullable=False)
    quartos = db.Column(db.Integer, nullable=False)
    banheiros = db.Column(db.Integer, nullable=False)
    area = db.Column(db.Float, nullable=False)
    
    # Endereço
    rua = db.Column(db.String(200), nullable=False)
    numero = db.Column(db.String(20), nullable=False)
    bairro = db.Column(db.String(100), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    cep = db.Column(db.String(20), nullable=False)
    
    # Coordenadas para o mapa
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    # Imagens
    imagem_principal = db.Column(db.String(500), nullable=True)
    imagens_adicionais = db.Column(db.Text, nullable=True)  # JSON string com URLs
    
    # Status e metadados
    status = db.Column(db.String(20), default='disponivel')  # disponivel, alugado, manutencao
    destaque = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com proprietário
    proprietario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    def __repr__(self):
        return f'<Imovel {self.titulo}>'

    @property
    def endereco_completo(self):
        return f"{self.rua}, {self.numero} - {self.bairro}, {self.cidade} - {self.estado}"

    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'tipo': self.tipo,
            'preco': self.preco,
            'quartos': self.quartos,
            'banheiros': self.banheiros,
            'area': self.area,
            'endereco': {
                'rua': self.rua,
                'numero': self.numero,
                'bairro': self.bairro,
                'cidade': self.cidade,
                'estado': self.estado,
                'cep': self.cep,
                'completo': self.endereco_completo
            },
            'coordenadas': {
                'latitude': self.latitude,
                'longitude': self.longitude
            },
            'imagem_principal': self.imagem_principal,
            'imagens_adicionais': self.imagens_adicionais,
            'status': self.status,
            'destaque': self.destaque,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'proprietario_id': self.proprietario_id
        }

