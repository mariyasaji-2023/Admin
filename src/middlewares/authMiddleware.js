const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Use optional chaining

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log decoded token

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Admins only" });
    }

    req.user = decoded; // Attach decoded token to req.user
    next();
  } catch (error) {
    console.error("JWT verification error:", error); // Log any errors
    return res.status(401).json({ message: "Invalid Token" });
  }
};


const verifyCompany = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') {
      return res.status(403).json({ message: "Companies only" });
    }
    req.user = decoded;

    console.log(req.user, '++++++++++++++++++++++++++++');

    res.json({ message: `Welcome to the Company Dashboard!` });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const verifyCandidate = (req, res, next) => {
  // Extract the token from the Authorization header (format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is 'candidate'
    if (decoded.role !== 'candidate') {
      return res.status(403).json({ message: "Candidates only" });
    }

    // Attach the decoded token to the req.user object for further use
    req.user = decoded;

    console.log(req.user, '++++++++++++++++++++++++++++');

    // Call the next middleware or function
    next();
  } catch (error) {
    // If token verification fails, return an error
    return res.status(401).json({ message: "Invalid Token" });
  }
};


const blacklistedTokens = []
const logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1]

  if (token) {
    blacklistedTokens.push(token)
    return res.status(200).json({ message: "Logged out successfully" })
  } else {
    return res.status(400).json({ message: "No token provided" })
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


module.exports = { verifyAdmin, verifyCompany, authenticate,verifyCandidate, logout };
