import Service from './Service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtSecret } from '../config/config.js';

class AuthService extends Service {
    constructor(){
        super('tatuador');
    }

    async cadastrarTatuador({ cpf, nome, email, telefone, senha }){
        // Verificando se o email, CPF ou telefone já estão cadastrados
        const cpfExiste      = await this.buscarRegistroPorCampo({ cpf });
        const emailExiste    = await this.buscarRegistroPorCampo({ email });
        const telefoneExiste = await this.buscarRegistroPorCampo({ telefone });

        if (cpfExiste)      throw new Error('CPF já cadastrado.');      
        if (emailExiste)    throw new Error('E-mail já cadastrado.');
        if (telefoneExiste) throw new Error('Telefone já cadastrado.');

        // Criptografando a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criando o tatuador no banco
        return this.criarNovoRegistro({ cpf, nome, email, telefone, senha: senhaCriptografada });
    }

    async logarTatuador({ email, senha }){
        // Buscando o tatuador pelo email
        const tatuador = await this.buscarRegistroPorCampo({ email });
        if(!tatuador) throw new Error('E-mail ou senha inválidos.');

        // Verificando a senha
        const senhaValida = await bcrypt.compare(senha, tatuador.senha);
        if(!senhaValida) throw new Error('E-mail ou senha inválidos.');

        // Gerando o Token JWT
        const token = jwt.sign(
            { id: tatuador.id },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return { token, tatuador };
    }
}

export default new AuthService();
