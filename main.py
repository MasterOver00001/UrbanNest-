import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.imovel import Imovel
from src.models.agendamento import Agendamento
from src.routes.user import user_bp
from src.routes.imoveis import imoveis_bp
from src.routes.agendamentos import agendamentos_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilitar CORS para todas as rotas
CORS(app)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(imoveis_bp, url_prefix='/api')
app.register_blueprint(agendamentos_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Criar tabelas e dados de exemplo
with app.app_context():
    db.create_all()
    
    # Verificar se já existem dados
    if Imovel.query.count() == 0:
        # Criar dados de exemplo
        imoveis_exemplo = [
            Imovel(
                titulo='Apartamento Moderno no Centro',
                descricao='Apartamento completamente reformado com acabamentos modernos, próximo ao metrô.',
                tipo='apartamento',
                preco=2500.0,
                quartos=2,
                banheiros=2,
                area=80.0,
                rua='Rua das Flores',
                numero='123',
                bairro='Centro',
                cidade='São Paulo',
                estado='SP',
                cep='01234-567',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=True,
                status='disponivel'
            ),
            Imovel(
                titulo='Casa com Jardim na Zona Sul',
                descricao='Casa térrea com amplo jardim, ideal para famílias. Garagem para 2 carros.',
                tipo='casa',
                preco=4200.0,
                quartos=3,
                banheiros=2,
                area=150.0,
                rua='Rua dos Jardins',
                numero='456',
                bairro='Vila Madalena',
                cidade='São Paulo',
                estado='SP',
                cep='05678-901',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=False,
                status='disponivel'
            ),
            Imovel(
                titulo='Loft Industrial Reformado',
                descricao='Loft com pé direito alto, estilo industrial, totalmente mobiliado.',
                tipo='loft',
                preco=3800.0,
                quartos=1,
                banheiros=1,
                area=90.0,
                rua='Rua da Indústria',
                numero='789',
                bairro='Bela Vista',
                cidade='São Paulo',
                estado='SP',
                cep='01234-567',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=True,
                status='disponivel'
            ),
            Imovel(
                titulo='Studio Compacto e Funcional',
                descricao='Studio otimizado com móveis planejados, ideal para jovens profissionais.',
                tipo='studio',
                preco=1800.0,
                quartos=1,
                banheiros=1,
                area=35.0,
                rua='Rua Compacta',
                numero='321',
                bairro='Liberdade',
                cidade='São Paulo',
                estado='SP',
                cep='01234-567',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=False,
                status='disponivel'
            ),
            Imovel(
                titulo='Cobertura com Vista Panorâmica',
                descricao='Cobertura duplex com terraço, churrasqueira e vista para a cidade.',
                tipo='apartamento',
                preco=8500.0,
                quartos=4,
                banheiros=3,
                area=200.0,
                rua='Avenida Panorâmica',
                numero='1000',
                bairro='Moema',
                cidade='São Paulo',
                estado='SP',
                cep='04567-890',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=True,
                status='disponivel'
            ),
            Imovel(
                titulo='Casa Térrea com Quintal',
                descricao='Casa com quintal amplo, ideal para pets. Próxima a escolas e comércio.',
                tipo='casa',
                preco=3200.0,
                quartos=3,
                banheiros=2,
                area=120.0,
                rua='Rua do Quintal',
                numero='654',
                bairro='Vila Prudente',
                cidade='São Paulo',
                estado='SP',
                cep='03456-789',
                latitude=-23.5505,
                longitude=-46.6333,
                destaque=False,
                status='disponivel'
            )
        ]
        
        for imovel in imoveis_exemplo:
            db.session.add(imovel)
        
        db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
