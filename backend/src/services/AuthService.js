import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthService {
    async cadastrarTatuador({ cpf, nome, email, telefone, senha }){
        // Verificando se o email, CPF ou telefone já estão cadastrados
        const cpfExiste      = await prisma.tatuador.findUnique( { where: { cpf }      });
        const emailExiste    = await prisma.tatuador.findUnique( { where: { email }    });
        const telefoneExiste = await prisma.tatuador.findUnique( { where: { telefone } });

        if (cpfExiste)      throw new Error('CPF já cadastrado.');      
        if (emailExiste)    throw new Error('E-mail já cadastrado.');
        if (telefoneExiste) throw new Error('Telefone já cadastrado.');

        // Criptografando a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criando o tatuador no banco
        return await prisma.tatuador.create({
            data: { cpf, nome, email, telefone, senha: senhaCriptografada }
        });
    }

    async logarTatuador({ email, senha }){
        // Buscando o tatuador pelo email
        const tatuador = await prisma.tatuador.findUnique({ where: { email } });
        if(!tatuador) throw new Error('E-mail ou senha inválidos.');

        // Verificando a senha
        const senhaValida = await bcrypt.compare(senha, tatuador.senha);
        if(!senhaValida) throw new Error('E-mail ou senha inválidos.');

        // Gerando o Token JWT
        const token = jwt.sign(
            { id: tatuador.id },
            process.env.JWT_SECRET || 'secreta-chave',
            { expiresIn: '1h' }
        );

        return { token, tatuador };
    }
}

export default new AuthService();
