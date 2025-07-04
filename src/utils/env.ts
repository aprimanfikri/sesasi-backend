const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

let PORT: number;
let NODE_ENV: string;
let JWT_SECRET: string;
let ADMIN_EMAIL: string;
let ADMIN_PASSWORD: string;
let USER_VERIFIED_EMAIL: string;
let USER_VERIFIED_EMAIL_TWO: string;
let USER_UNVERIFIED_EMAIL: string;
let USER_PASSWORD: string;

try {
  PORT = parseInt(getEnvVariable('PORT'), 10);
  NODE_ENV = getEnvVariable('NODE_ENV');
  JWT_SECRET = getEnvVariable('JWT_SECRET');
  ADMIN_EMAIL = getEnvVariable('ADMIN_EMAIL');
  ADMIN_PASSWORD = getEnvVariable('ADMIN_PASSWORD');
  USER_VERIFIED_EMAIL = getEnvVariable('USER_VERIFIED_EMAIL');
  USER_VERIFIED_EMAIL_TWO = getEnvVariable('USER_VERIFIED_EMAIL_TWO');
  USER_UNVERIFIED_EMAIL = getEnvVariable('USER_UNVERIFIED_EMAIL');
  USER_PASSWORD = getEnvVariable('USER_PASSWORD');
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('An unknown error occurred');
  }
  process.exit(1);
}

export {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_VERIFIED_EMAIL,
  USER_VERIFIED_EMAIL_TWO,
  USER_UNVERIFIED_EMAIL,
  USER_PASSWORD,
};
