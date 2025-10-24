from flask import Blueprint, request, jsonify
from src.models.imovel import Imovel, db
from src.models.user import User
from sqlalchemy import or_, and_

imoveis_bp = Blueprint('imoveis', __name__)

@imoveis_bp.route('/imoveis', methods=['GET'])
def get_imoveis():
    """Buscar imóveis com filtros opcionais"""
    try:
        # Parâmetros de busca
        search = request.args.get('search', '')
        tipo = request.args.get('tipo', '')
        preco_min = request.args.get('preco_min', type=float)
        preco_max = request.args.get('preco_max', type=float)
        quartos = request.args.get('quartos', type=int)
        bairro = request.args.get('bairro', '')
        cidade = request.args.get('cidade', '')
        
        # Paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query base
        query = Imovel.query.filter_by(status='disponivel')
        
        # Aplicar filtros
        if search:
            search_filter = or_(
                Imovel.titulo.contains(search),
                Imovel.descricao.contains(search),
                Imovel.bairro.contains(search),
                Imovel.cidade.contains(search)
            )
            query = query.filter(search_filter)
        
        if tipo:
            query = query.filter(Imovel.tipo == tipo)
        
        if preco_min is not None:
            query = query.filter(Imovel.preco >= preco_min)
        
        if preco_max is not None:
            query = query.filter(Imovel.preco <= preco_max)
        
        if quartos is not None:
            query = query.filter(Imovel.quartos == quartos)
        
        if bairro:
            query = query.filter(Imovel.bairro.contains(bairro))
        
        if cidade:
            query = query.filter(Imovel.cidade.contains(cidade))
        
        # Ordenação (destaques primeiro)
        query = query.order_by(Imovel.destaque.desc(), Imovel.data_criacao.desc())
        
        # Paginação
        imoveis_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'imoveis': [imovel.to_dict() for imovel in imoveis_paginados.items],
            'total': imoveis_paginados.total,
            'pages': imoveis_paginados.pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': imoveis_paginados.has_next,
            'has_prev': imoveis_paginados.has_prev
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/<int:imovel_id>', methods=['GET'])
def get_imovel(imovel_id):
    """Buscar um imóvel específico"""
    try:
        imovel = Imovel.query.get_or_404(imovel_id)
        return jsonify(imovel.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis', methods=['POST'])
def create_imovel():
    """Criar um novo imóvel"""
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['titulo', 'tipo', 'preco', 'quartos', 'banheiros', 'area', 
                          'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Criar novo imóvel
        imovel = Imovel(
            titulo=data['titulo'],
            descricao=data.get('descricao', ''),
            tipo=data['tipo'],
            preco=data['preco'],
            quartos=data['quartos'],
            banheiros=data['banheiros'],
            area=data['area'],
            rua=data['rua'],
            numero=data['numero'],
            bairro=data['bairro'],
            cidade=data['cidade'],
            estado=data['estado'],
            cep=data['cep'],
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            imagem_principal=data.get('imagem_principal'),
            imagens_adicionais=data.get('imagens_adicionais'),
            destaque=data.get('destaque', False),
            proprietario_id=data.get('proprietario_id')
        )
        
        db.session.add(imovel)
        db.session.commit()
        
        return jsonify(imovel.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/<int:imovel_id>', methods=['PUT'])
def update_imovel(imovel_id):
    """Atualizar um imóvel"""
    try:
        imovel = Imovel.query.get_or_404(imovel_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        allowed_fields = ['titulo', 'descricao', 'tipo', 'preco', 'quartos', 'banheiros', 
                         'area', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep',
                         'latitude', 'longitude', 'imagem_principal', 'imagens_adicionais',
                         'status', 'destaque']
        
        for field in allowed_fields:
            if field in data:
                setattr(imovel, field, data[field])
        
        db.session.commit()
        
        return jsonify(imovel.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/<int:imovel_id>', methods=['DELETE'])
def delete_imovel(imovel_id):
    """Deletar um imóvel"""
    try:
        imovel = Imovel.query.get_or_404(imovel_id)
        db.session.delete(imovel)
        db.session.commit()
        
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/tipos', methods=['GET'])
def get_tipos_imoveis():
    """Buscar tipos de imóveis disponíveis"""
    try:
        tipos = db.session.query(Imovel.tipo).distinct().all()
        tipos_list = [tipo[0] for tipo in tipos]
        
        return jsonify({'tipos': tipos_list})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/cidades', methods=['GET'])
def get_cidades():
    """Buscar cidades disponíveis"""
    try:
        cidades = db.session.query(Imovel.cidade).distinct().all()
        cidades_list = [cidade[0] for cidade in cidades]
        
        return jsonify({'cidades': cidades_list})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@imoveis_bp.route('/imoveis/bairros', methods=['GET'])
def get_bairros():
    """Buscar bairros por cidade"""
    try:
        cidade = request.args.get('cidade')
        
        query = db.session.query(Imovel.bairro).distinct()
        
        if cidade:
            query = query.filter(Imovel.cidade == cidade)
        
        bairros = query.all()
        bairros_list = [bairro[0] for bairro in bairros]
        
        return jsonify({'bairros': bairros_list})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

