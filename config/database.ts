import sql from "mssql"

const config = {
  server: process.env.SQL_SERVER_HOST || "localhost",
  port: Number.parseInt(process.env.SQL_SERVER_PORT || "1433"),
  database: process.env.SQL_SERVER_DATABASE || "PhoneStore",
  authentication: {
    type: "default",
    options: {
      userName: process.env.SQL_SERVER_USER || "sa",
      password: process.env.SQL_SERVER_PASSWORD || "123",
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableKeepAlive: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool
  }

  pool = new sql.ConnectionPool(config)
  await pool.connect()
  console.log("[v0] SQL Server connected successfully")
  return pool
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close()
    pool = null
    console.log("[v0] SQL Server connection closed")
  }
}

export async function executeQuery<T>(query: string, params?: Record<string, any>): Promise<T[]> {
  const connection = await getConnection()
  const request = connection.request()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  const result = await request.query(query)
  return result.recordset as T[]
}

export async function executeNonQuery(query: string, params?: Record<string, any>): Promise<number> {
  const connection = await getConnection()
  const request = connection.request()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  const result = await request.query(query)
  return result.rowsAffected[0]
}
