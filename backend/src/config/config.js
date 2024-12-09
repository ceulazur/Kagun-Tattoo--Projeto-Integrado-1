const dotenv = require ('dotenv');

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || 'secreta-chave';
