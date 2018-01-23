# Node.js API Kit

## Motivation
Created the API structure for your projects again and again is very annoying and difficult especially for the starters.
So I created an API structure which includes all the pre-requisites including the authentication(Which I think is the most difficult task to implement if you are a newbie)
I want to make it public so that everyone can take benefit from it and contribute to make it even better.
This API kit will be running on a secure port `3443`. You can remove the code for `https` server from `./bin/www`.


## Directory Layout

```bash
.
├── /bin/
|       ├── www/                   
├── /config/
|          ├── config.js/            
├── /features/                       
│   ├── /users/
|             ├── userController.js/
|             ├── userModel.js/
|             ├── userRouter.js/           
│   ├── /routes/
|              ├── router.js/      
│   ├── /server/
|             ├── authenticate.js/
|             ├── cors.js/
|             ├── database.js/            
|             ├── verify.js/              
├── app.js                     
├── package.json               
└── postgres-initdb.sh         
```


## Getting Started

Just clone the repo and run `npm install` by going into the `NODE-API-KIT` folder:

The api is configured to run on a secure server so you need to run the following commands if you are using a macOS:

`
  openssl genrsa 1024 > private.key
  openssl req -new -key private.key -out cert.csr
  openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
`

Windows user will have to install the Openssl first.

If you don't want to run the api on a secure server you can remove the code anytime by simply going into the `/bin/www` folder.


The API server must become available at [https://localhost:3443/api](https://localhost:3443/api) If you are using https.

Otherwise it will be available at  [http://localhost:3000/api](http://localhost:3000/api)

## License
This source code is licensed under the MIT license.

---
Made with ♥ by ALQAMA BIN SADIQ [github](https://github.com/alqamabinsadiq/node-api-kit)

