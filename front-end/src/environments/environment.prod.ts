/**
 * Production environment configuration
 */
export const environment = {
  production: true,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'starter-app',
    clientId: 'starter-client'
  }
};

