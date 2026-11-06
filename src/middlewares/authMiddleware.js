import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({error: 'Brak tokenuy autoryzacyjnego. Dostęp zabroniony :('});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(403).json({error: 'Niepoprawny lub wygasły token :('});
    }
};