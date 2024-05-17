const isDocker = process.env.DOCKER;
const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.test

if (isProduction)
  console.log('In production mode.')
if (isTesting)
  console.log('In Testing Stage.')

const config = {
  graphdb: {
    addr: isProduction ? 'http://localhost:7200' : `http://${isDocker ? 'host.docker.internal' : 'localhost'}:7200`,
  },
  mongodb: {
    addr: isProduction ? (isTesting? 'mongodb://localhost:27017/pathfinder-testing' : 'mongodb://localhost:27017/pathfinder') : `mongodb://localhost:27017/${process.env.test ? "pathfinderTest" : "pathfinder"}`
  },

  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://csse-uoft.github.io',
    'https://www.common-approach.ca',
    ],

  frontend: {
    addr: isProduction ? (isTesting? 'https://csse-uoft.github.io' : 'https://www.common-approach.ca') : 'http://localhost:3000'
  },

  // pbkdf2 configuration, ~70ms with this config
  passwordHashing: {
    digest: 'sha512',
    iterations: 100000, // 100,000 is sufficient
    hashSize: 64, // in bytes
    saltSize: 32  // in bytes
  },

  cookieSession: {
    keys: ['secret', 'keys'],
    maxAge: 24 * 60 * 60 * 1000, // expires in 24 hours
    sameSite: 'none',
    secure: true,
    // httpOnly: true,
  },

  // For generating registration email verification token
  jwtConfig: {
    secret: 'secr',
    options: {expiresIn: 60 * 60 * 24} // 24 hour
  },

  mailConfig: {
    from: process.env.MAIL_SENDER || 'no-reply@example.com',
    mailServer: {
      host:  process.env.MAIL_SERVER || 'example.com',
      port: Number(process.env.MAIL_PORT) || 25,
      auth: {
        user: process.env.MAIL_USERNAME || 'username@example.com',
        pass: process.env.MAIL_PASSWORD || 'password'
      },
      secure: true,  // STARTTLS
      // forceTLS: true,
    },
  },

  configLevel:  'fullLevelConfig' || 'baseLevelConfig'
};

// Environment Variables Override
if (process.env.GRAPHDB_ADDRESS)
  config.graphdb.addr = process.env.GRAPHDB_ADDRESS;
if (process.env.GRAPHDB_USERNAME)
  config.graphdb.username = process.env.GRAPHDB_USERNAME;
if (process.env.GRAPHDB_PASSWORD)
  config.graphdb.password = process.env.GRAPHDB_PASSWORD;
if (process.env.MONGODB_ADDRESS)
  config.mongodb.addr = process.env.MONGODB_ADDRESS;

module.exports = config
