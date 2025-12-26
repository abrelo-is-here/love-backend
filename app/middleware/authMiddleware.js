// middleware/auth.js


import jwt from 'jsonwebtoken';


export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ 
            message: "Not authorized. Token missing or invalid format (Expected: Bearer <token>)." 
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next();
        
    } catch (error) {
      
        let errorMessage = "Invalid token.";
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Token expired. Please log in again.";
        }
        return res.status(401).json({ message: errorMessage });
    }
};

// middleware/role.js
// middleware/role.js
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied: Authentication payload missing." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
