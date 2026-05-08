# prisma migrate status

Checks the status of your database migrations.

## Command

```bash
prisma migrate status [options]
```

## What It Does

- Connects to the database
- Checks the `_prisma_migrations` table
- Compares applied migrations with local migration files
- Reports:
    - **Status**: Database is up-to-date or behind
    - **Unapplied migrations**: Count of pending migrations
    - **Missing migrations**: Migrations present in DB but missing locally
    - **Failed migrations**: Any migrations that failed to apply

## Options

| Option | Description |
|--------|-------------|
| `--schema` | Path to the schema.prisma file |
| `-h, --help` | Show help for the command |

## Global Options

| Option | Description |
|--------|-------------|
| `--config` | Custom path to your Prisma config file (inherited from the `prisma` command group) |

## Examples

### Check status

```bash
prisma migrate status
```

Output example (Up to date):


Output example (Pending):
```text
Following migrations have not yet been applied:
  20240115120000_add_user

To apply migrations in development, run:
  prisma migrate dev

To apply migrations in production, run:
  prisma migrate deploy
```

## When to Use

- **Debugging**: Why is `migrate dev` complaining about drift?
- **CI/CD**: Verify database state before deploying
- **Production**: Check if migrations are needed (`migrate deploy`) or if a deployment failed

## Exit Codes

- `0`: Everything is in sync (no pending migrations, no divergence, no failed migrations)
- `1`: Failure — covers unapplied migrations, schema divergence, failed migrations, connection errors, or a missing `_prisma_migrations` table

For programmatic checks, use `migrate diff` with `--exit-code` (exits `2` when a diff exists) or parse the CLI output directly.
