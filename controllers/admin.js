// const AdminBro = require('admin-bro');
// const AdminBroExpressjs = require('admin-bro-expressjs');
// const ExpressFormidable = require("express-formidable");
// const bcrypt = require('bcrypt');

// const db = require('./db')

// // We have to tell AdminBro that we will manage mongoose resources with it
// AdminBro.registerAdapter(require('admin-bro-mongoose'))
// // Pass all configuration settings to AdminBro
// const adminBro = new AdminBro({
//   resources: [db.User, db.Shopper],
//   rootPath: '/admin',
// })
// // Build and use a router which will handle all AdminBro routes
// const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
//   authenticate: async (email, password) => {
//      const user = await db.User.findOne({ email })
//     if (user && user.isAdmin) {
//       const match = await bcrypt.compare(password, user.password);
//       if (match){
//         return user;
//       }
      
//     }
//     return false;
//   },
//   cookiePassword: 'some-secret-password-used-to-secure-cookie',
//   cookieName: 'admin-bro'
// })

// module.exports = { router, adminBro }