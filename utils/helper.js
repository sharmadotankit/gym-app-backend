const jwt = require('jsonwebtoken');

let helper = {
    getTokenData: function(data){
        try {
            let header = data.headers.authorization;
            if(!header){
                throw({
                    message: req.app.get('strings').MESSAGE_AUTH_HEADER_REQUIRED
                })
            }
            else{
                let splitTokn = header.split(' ');
                let token = splitTokn[1];
                
                if (!token) throw({
                    message: req.app.get('strings').MESSAGE_AUTH_HEADER_REQUIRED
                })

                let tokenData = jwt.verify(token, process.env.JWT_SECRET);
                return tokenData;
            }
        } catch (error) {
            console.log("error",error)
            return false;
        }
    },
}

module.exports = helper;