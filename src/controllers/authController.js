import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async(req, res) => {
    try{
        const{username, email, password} = req.body;
        const existingUser = await prisma.user.findFirst({
            where:{
                OR: [{email}, {username}]
            }
        });
        
        if(existingUser){
            return res.status(400).json({error: 'Użytownik z taką nazwą lub mailem już istnieje'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password: hashedPassword,
            },
        });

        const {password: _, ...userWithoutPassword} = newUser;

        res.status(201).json({
            message: 'Konto zostało utworzone pomyślnie :)',
            user: userWithoutPassword,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Błąd podczas rejestracji użytkownika'});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: 'Nieprawidłowy email lub hasło :(' });
        }

        // Sprawdzenie poprawności hasła
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Nieprawidłowy email lub hasło :(' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Zalogowano pomyślnie!',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd podczas logowania :(' });
    }
};