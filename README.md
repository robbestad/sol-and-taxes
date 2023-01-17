# Sol and Taxes

Helping you calculate crypto gains and losses for taxes.

## Terminals

1. Sveltekit - `npm run dev`
2. nhost - `nhost dev`

## Development notes

- `npm run dev` runs sveltekit server
- `nhost dev` runs nhost
- `npm run check` syncs `.env` variables

## Production branches

- `nhost-production` - to deploy nhost/hasura

## Deployment checklist

- Update & switch `.env` (dev to prod)
- Build & push Docker images (dependencies & server)
- Update K8s files
- Deploy `nhost` branch (if required)
- Deploy K8s updates

## Deployment commands

Make sure to switch to the appropriate `Dockerfile` code, using `dependencies.Dockerfile` and `production.Dockerfile`, when running the build commands.

`docker build -t {prefix}/{project}-dependencies:2.0.0 .`
`docker build -t {prefix}/{project}:2.0.0 .`
`docker push {prefix}/{project}-dependencies:2.0.0`

See `{infrastructure-repo}` `README` for `k8s` deployment instructions

## nhost quirks/undocumented

- nhost client seems to keep track of authenticated state of users in some session
- nhost client automatically does stuff with auth/refresh tokens using the admin role
- nhost client automatically attaches `user_vars` to client graphql requests:
- `http://localhost:1337/v1/functions/time` (example for accessing nhost functions)
- use `isAuthenticatedAsync` over `isAuthenticated` and call `getSession` AFTER the authentication check or else the session sometimes won't be available

```
// For authenticated user
user_vars: {
  "x-hasura-role":"user",
  "x-hasura-user-isanonymous":"false",
  "x-hasura-user-id":"cef5e0e7-c7eb-4099-b891-1ff5055e1c55"
}

// For public user
user_vars: {"x-hasura-role":"public"}
```

- nhost client automatically sends access token as request header in client graphql requests

```
// If the user is signed in, the user's access token is attached in the Authorization header.

```

- "If the function does not export a default request/response handler it should not be served as a http endpoint." – Johan Eliasson

## Felte quirks

- InitialValues do not get re-initialized.
- If the html disappears so does the field data
