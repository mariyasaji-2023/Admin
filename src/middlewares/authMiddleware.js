const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


const blacklistedTokens =[]
const logout =(req,res)=>{
  const token = req.headers.authorization.split(" ")[1]

  if(token){
    blacklistedTokens.push(token)
    return res.status(200).json({message:"Logged out successfully"})
  }else{
    return res.status(400).json({message:"No token provided"})
  }
  
}

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (blacklistedTokens.includes(token)) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.adminId = decoded.adminId; // Store adminId for later use
        next();
    });
};


module.exports = {authMiddleware,authenticate,logout};
