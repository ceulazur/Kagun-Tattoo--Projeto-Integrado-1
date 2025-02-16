import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
    constructor() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaClient();
        }
        return PrismaSingleton.instance;
    }
}

const prisma = new PrismaSingleton();
export default prisma;