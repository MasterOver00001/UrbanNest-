from src.models.user import db
from datetime import datetime

class Agendamento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Relacionamentos
    imovel_id = db.Column(db.Integer, db.ForeignKey('imovel.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    # Dados do agendamento
    data_visita = db.Column(db.Date, nullable=False)
    hora_visita = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pendente')  # pendente, confirmado, cancelado, realizado
    
    # Dados de contato
    nome_interessado = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    mensagem = db.Column(db.Text, nullable=True)
    
    # Metadados
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Agendamento {self.id} - {self.nome_interessado}>'

    def to_dict(self):
        return {
            'id': self.id,
            'imovel_id': self.imovel_id,
            'usuario_id': self.usuario_id,
            'data_visita': self.data_visita.isoformat() if self.data_visita else None,
            'hora_visita': self.hora_visita.strftime('%H:%M') if self.hora_visita else None,
            'status': self.status,
            'nome_interessado': self.nome_interessado,
            'telefone': self.telefone,
            'email': self.email,
            'mensagem': self.mensagem,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

