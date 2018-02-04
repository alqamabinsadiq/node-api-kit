# Node.js API Kit

Creating the API structure for your projects again and again is very annoying and difficult especially for the starters.
So I created an API structure which includes all the pre-requisites including the authentication(Which I think is the most difficult task to implement if you are a newbie)
I want to make it public so that everyone can take benefit from it and contribute to make it even better.
This API kit will be running on a port `300`. You can uncomment the code for `https` server in `./bin/www` and `app.js` if you want to run a secure sever.


## Directory Layout

```bash
.
├── /bin/
│       ├── www/                   
├── /config/
│          ├── config.js/               # contains connection urls and secret keys.
├── /features/                       
│   ├── /users/
│             ├── userController.js/    # Controller for /api/users
│             ├── userModel.js/         # User Model
│             ├── userRouter.js/        # Contains verbs of user.
│   ├── /routes/
│              ├── router.js/           # Main router file.
│   ├── /server/
│             ├── authenticate.js/      # Contains all the authentication methods and strategies.
│             ├── cors.js/              # This file contins the CORS configuration.
│             ├── database.js/          # Databse configuration.
│             ├── verify.js/            # All the encryption and decryption methods which we are using to generate and verify the tokens
├── app.js                              # main file
├── package.json               
└── postgres-initdb.sh         
```


## Getting Started

Just clone the repo and run `npm install` by going into the `NODE-API-KIT` folder and then follow the instructions as described below.

### Generating Private Key and Certificate

The api is configured to run on a normal server. If you want to enable the https server you have to uncomment the code for https as described below. For running a secure server you have to generate the private keys and certificate using openssl. 
If you are using a macOS, go to the `bin` folder and then create the private key and certificate by typing the following at the prompt

```
  openssl genrsa 1024 > private.key
  openssl req -new -key private.key -out cert.csr
  openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
```

### Note for Windows Users

If you are using a Windows machine, you may need to install openssl. You can find some openssl binary distributions [here](https://wiki.openssl.org/index.php/Binaries). Also, [this article](http://blog.didierstevens.com/2015/03/30/howto-make-your-own-cert-with-openssl-on-windows/) gives the steps for generating the certificates in Windows. Another [article](http://www.faqforge.com/windows/use-openssl-on-windows/) provides similar instructions. Here's an [online](http://www.selfsignedcertificate.com/) service to generate self-signed certificates.

#### NOTE: 
Please make sure that you have generated the certificate and the private key in the `bin` folder.

### How To Run The API On HTTPS Server

If you want to run the api on a secure server you can uncomment the code anytime by simply going into the `/bin/www` folder. 

Uncomment the following code from `/bin/www`
```
  /**
  * Create HTTPS server.
  * You can simple remove the secure server code by simply commenting it's section.
  */

  // Read the certificate and private key from bin folder.
  var options = {
    key: fs.readFileSync(__dirname + '/private.key'),
    cert: fs.readFileSync(__dirname + '/certificate.pem')
  };

  var secureServer = https.createServer(options, app);
  /**
  * Listen on provided port, on all network interfaces.
  */

  secureServer.listen(app.get('secPort'), () => {
    console.log('Secure Server listening on port ', app.get('secPort'));
  });
  secureServer.on('error', onError);
  secureServer.on('listening', onListening);
```
Also uncomment the following code from `app.js`

```
  // Remove the following code if you donot want to use secure server.
  // Secure traffic only
  app.all('*', (req, res, next) => {
    if (req.secure) {
      return next();
    }
    else {
      res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
  });
```


The API server must become available at [https://localhost:3443/api](https://localhost:3443/api) If you are using HTTPS.

Otherwise it will be available at  [http://localhost:3000/api](http://localhost:3000/api)

### MongoDB Configuration

Please add the mongoDB url in `config.js` file and make sure that your mongoDB is up and running otherwise you will get an error.

### CORS Configuration

If you are running your api on PORT other than 3000 or 3443 then you must update the whitelist which is inside the CORS configuration file.

Just go to the `./server/cors.js` and update the whitelist array. 

**Example:** `const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:myport'];`

## License
This source code is licensed under the MIT license.

## Contributing
Feel free to make changes to the code and features. PR are welcomed.

---
Made with ♥ by ALQAMA BIN SADIQ [github](https://github.com/alqamabinsadiq/node-api-kit)
