// Contains all the configuration.
module.exports = {
  'secretKey': '12345-67890-09876-54321',             // Secret key for JWT.
  sealPass: '12345-67890-09876-5432112345-7890',      // Sealpass to encrypt data using IRON npm module
  'mongoUrl': 'mongodb://localhost:27017/myDB',  // Your mongoDB url
  'facebook': {
    clientId: 'Your client id',                       // You Facebook app's client id
    clientSecret: 'Your client secret'                // You app secret.
  }
};
