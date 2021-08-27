const jwt = require('jsonwebtoken');

//function for user authorization
function auth(req, res, next) {
	try {
		const token = req.cookies.token;

		//check if request returns a token
		if (!token)
			return res.status(401).json({
				errorMessage: 'Unauthorized user!',
			});

		//validate the token
		const verifiedTokenPayload = jwt.verify(token, process.env.JWT_SECRET);

		//get user from the verified token
		req.user = verifiedTokenPayload.user;

		next();
	} catch (err) {
		console.error(err);
		res.status(401).json({
			errorMessage: 'Unauthorized user!',
		});
	}
}

module.exports = auth;
