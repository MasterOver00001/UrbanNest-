from flask import Blueprint, request, jsonify
from src.models.agendamento import Agendamento, db
from src.models.imovel import Imovel
from src.models.user import User
from datetime import datetime, date, time

agendamentos_bp = Blueprint('agendamentos', __name__)

@agendamentos_bp.route('/agendamentos', methods=['GET'])
def get_agendamentos():
    """Buscar agendamentos com filtros opcionais"""
    try:
        # Parâmetros de busca
        imovel_id = request.args.get('imovel_id', type=int)
        usuario_id = request.args.get('usuario_id', type=int)
        status = request.args.get('status', '')
        data_inicio = request.args.get('data_inicio')
        data_fim = request.args.get('data_fim')
        
        # Paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query base
        query = Agendamento.query
        
        # Aplicar filtros
        if imovel_id:
            query = query.filter(Agendamento.imovel_id == imovel_id)
        
        if usuario_id:
            query = query.filter(Agendamento.usuario_id == usuario_id)
        
        if status:
            query = query.filter(Agendamento.status == status)
        
        if data_inicio:
            data_inicio_obj = datetime.strptime(data_inicio, '%Y-%m-%d').date()
            query = query.filter(Agendamento.data_visita >= data_inicio_obj)
        
        if data_fim:
            data_fim_obj = datetime.strptime(data_fim, '%Y-%m-%d').date()
            query = query.filter(Agendamento.data_visita <= data_fim_obj)
        
        # Ordenação
        query = query.order_by(Agendamento.data_visita.desc(), Agendamento.hora_visita.desc())
        
        # Paginação
        agendamentos_paginados = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        # Incluir dados do imóvel em cada agendamento
        agendamentos_com_imovel = []
        for agendamento in agendamentos_paginados.items:
            agendamento_dict = agendamento.to_dict()
            # Buscar dados do imóvel separadamente
            imovel = Imovel.query.get(agendamento.imovel_id)
            if imovel:
                agendamento_dict['imovel'] = {
                    'id': imovel.id,
                    'titulo': imovel.titulo,
                    'endereco': imovel.endereco_completo
                }
            agendamentos_com_imovel.append(agendamento_dict)
        
        return jsonify({
            'agendamentos': agendamentos_com_imovel,
            'total': agendamentos_paginados.total,
            'pages': agendamentos_paginados.pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': agendamentos_paginados.has_next,
            'has_prev': agendamentos_paginados.has_prev
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@agendamentos_bp.route('/agendamentos/<int:agendamento_id>', methods=['GET'])
def get_agendamento(agendamento_id):
    """Buscar um agendamento específico"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        agendamento_dict = agendamento.to_dict()
        
        # Incluir dados do imóvel
        imovel = Imovel.query.get(agendamento.imovel_id)
        if imovel:
            agendamento_dict['imovel'] = imovel.to_dict()
        
        return jsonify(agendamento_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@agendamentos_bp.route('/agendamentos', methods=['POST'])
def create_agendamento():
    """Criar um novo agendamento"""
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['imovel_id', 'data_visita', 'hora_visita', 'nome_interessado', 
                          'telefone', 'email']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Verificar se o imóvel existe
        imovel = Imovel.query.get(data['imovel_id'])
        if not imovel:
            return jsonify({'error': 'Imóvel não encontrado'}), 404
        
        # Converter data e hora
        try:
            data_visita = datetime.strptime(data['data_visita'], '%Y-%m-%d').date()
            hora_visita = datetime.strptime(data['hora_visita'], '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Formato de data/hora inválido. Use YYYY-MM-DD para data e HH:MM para hora'}), 400
        
        # Verificar se já existe agendamento no mesmo horário
        agendamento_existente = Agendamento.query.filter_by(
            imovel_id=data['imovel_id'],
            data_visita=data_visita,
            hora_visita=hora_visita
        ).filter(Agendamento.status.in_(['pendente', 'confirmado'])).first()
        
        if agendamento_existente:
            return jsonify({'error': 'Já existe um agendamento para este horário'}), 409
        
        # Criar novo agendamento
        agendamento = Agendamento(
            imovel_id=data['imovel_id'],
            usuario_id=data.get('usuario_id'),
            data_visita=data_visita,
            hora_visita=hora_visita,
            nome_interessado=data['nome_interessado'],
            telefone=data['telefone'],
            email=data['email'],
            mensagem=data.get('mensagem', ''),
            status='pendente'
        )
        
        db.session.add(agendamento)
        db.session.commit()
        
        return jsonify(agendamento.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agendamentos_bp.route('/agendamentos/<int:agendamento_id>', methods=['PUT'])
def update_agendamento(agendamento_id):
    """Atualizar um agendamento"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        if 'status' in data:
            if data['status'] in ['pendente', 'confirmado', 'cancelado', 'realizado']:
                agendamento.status = data['status']
            else:
                return jsonify({'error': 'Status inválido'}), 400
        
        if 'data_visita' in data:
            try:
                agendamento.data_visita = datetime.strptime(data['data_visita'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        if 'hora_visita' in data:
            try:
                agendamento.hora_visita = datetime.strptime(data['hora_visita'], '%H:%M').time()
            except ValueError:
                return jsonify({'error': 'Formato de hora inválido. Use HH:MM'}), 400
        
        if 'mensagem' in data:
            agendamento.mensagem = data['mensagem']
        
        db.session.commit()
        
        return jsonify(agendamento.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agendamentos_bp.route('/agendamentos/<int:agendamento_id>', methods=['DELETE'])
def delete_agendamento(agendamento_id):
    """Deletar um agendamento"""
    try:
        agendamento = Agendamento.query.get_or_404(agendamento_id)
        db.session.delete(agendamento)
        db.session.commit()
        
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@agendamentos_bp.route('/agendamentos/horarios-disponiveis', methods=['GET'])
def get_horarios_disponiveis():
    """Buscar horários disponíveis para um imóvel em uma data específica"""
    try:
        imovel_id = request.args.get('imovel_id', type=int)
        data_visita = request.args.get('data_visita')
        
        if not imovel_id or not data_visita:
            return jsonify({'error': 'imovel_id e data_visita são obrigatórios'}), 400
        
        # Verificar se o imóvel existe
        imovel = Imovel.query.get(imovel_id)
        if not imovel:
            return jsonify({'error': 'Imóvel não encontrado'}), 404
        
        try:
            data_obj = datetime.strptime(data_visita, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        # Buscar agendamentos existentes para esta data
        agendamentos_existentes = Agendamento.query.filter_by(
            imovel_id=imovel_id,
            data_visita=data_obj
        ).filter(Agendamento.status.in_(['pendente', 'confirmado'])).all()
        
        horarios_ocupados = [ag.hora_visita.strftime('%H:%M') for ag in agendamentos_existentes]
        
        # Horários disponíveis (9h às 18h, de hora em hora)
        horarios_possiveis = []
        for hora in range(9, 19):
            horario = f"{hora:02d}:00"
            if horario not in horarios_ocupados:
                horarios_possiveis.append(horario)
        
        return jsonify({
            'data': data_visita,
            'horarios_disponiveis': horarios_possiveis,
            'horarios_ocupados': horarios_ocupados
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

