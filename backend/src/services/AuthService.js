import Service from './Service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtSecret } from '../config/config.js';
import BadRequestError from '../errors/BadRequestError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

class AuthService extends Service {
    constructor(){
        super('tatuador');
    }

    async loginTatuador({ email, senha }){
        if (!email || !senha) throw new BadRequestError('E-mail e senha são obrigatórios.');

        // Buscando o tatuador pelo email
        const tatuador = await this.buscarRegistroPorCampo({ email });
        if(!tatuador) throw new UnauthorizedError('E-mail ou senha inválidos.');

        // Verificando a senha
        const senhaValida = await bcrypt.compare(senha, tatuador.senha);
        if(!senhaValida) throw new UnauthorizedError('E-mail ou senha inválidos.');

        // Gerando o Token JWT
        const token = jwt.sign(
            { id: tatuador.id, nome: tatuador.nome },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Remove o campo 'senha' antes de retornar os dados
        const { senha: _, ...tatuadorSemSenha } = tatuador;

        return { token, tatuador: tatuadorSemSenha };
    }
}

export default new AuthService();
