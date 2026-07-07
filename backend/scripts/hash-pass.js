// Genera el hash bcrypt que va en la variable de entorno ADMIN_PASSWORD_HASH.

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/generar-hash-password.js "tu-contraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nADMIN_PASSWORD_HASH=' + hash + '\n');
