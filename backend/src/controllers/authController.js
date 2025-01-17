import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthController {
    async cadastrarTatuador(req, res){
        try {
            const { cpf, nome, email, senha } = req.body;

            // Verificando se os dados foram informados
            if (!cpf || !nome || !email || !senha)
                return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });

            // Verificando se o email ou CPF já existe no banco
            const emailExiste = await prisma.tatuador.findUnique({ where: { email } });
            const cpfExiste = await prisma.tatuador.findUnique({ where: { cpf } });

            if(emailExiste || cpfExiste)
                return res.status(400).json({ mensagem: 'E-mail ou CPF já cadastrado.' });

            // Criptografando a senha
            const senhaCriptografada = await bcrypt.hash(senha, 10);

            // Salvando no banco de dados
            const novoTatuador = await prisma.tatuador.create({
                data: {
                    cpf,
                    nome,
                    email,
                    senha: senhaCriptografada
                }
            });

            return res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.', tatuador: novoTatuador });
        } catch (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar tatuador' })
        }
    }

    async logarTatuador(req, res){
        try {
            const { email, senha } = req.body;

            // Verificando se os dados foram informados
            if (!email || !senha)
                return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });

            // Buscando o tatuador pelo email
            const tatuador = await prisma.tatuador.findUnique({ where: { email } });

            if(!tatuador)
                return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });

            // Verificando a senha
            const senhaValida = await bcrypt.compare(senha, tatuador.senha);

            if(!senhaValida)
                return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });

            // Gerando o Token JWT
            const token = jwt.sign({ id: tatuador.idTatuador }, process.env.JWT_SECRET || 'secreta-chave', { expiresIn: '1h' });

            return res.status(200).json({ token, mensagem: 'Login realizado com sucesso.' });
        } catch (erro) {
            console.error(error);
            return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
        }
    }
}

export default new AuthController();