import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import tatuadores from '../models/tatuadores.js';

async function cadastrarTatuador(req, res){
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha)
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });

    const emailExiste = tatuadores.find(tatuador => tatuador.email === email);

    if(emailExiste)
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    tatuadores.push({ nome, email, senha: senhaCriptografada });
    res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.' });
}

async function logarTatuador(req, res){
    const { email, senha } = req.body;

    if(!email || !senha)
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });

    const tatuador = tatuadores.find(tatuador => tatuador.email === email);

    if(!tatuador)
        return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });

    const senhaValida = await bcrypt.compare(senha, tatuador.senha);

    if(!senhaValida)
        return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });

    const token = jwt.sign({ id: tatuador.email }, 'secreta-chave', { expiresIn: '1h' });

    res.status(200).json(token, { mensagem: 'Login realizado com sucesso.' });
}

export {
    cadastrarTatuador,
    logarTatuador
};
