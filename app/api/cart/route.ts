import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeQuery, executeNonQuery } from "@/config/database"
import { verifyJwt } from "@/lib/auth"

interface CartItem {
  id_chi_tiet_gio: number
  id_san_pham: number
  ten_san_pham: string
  gia_tien: number
  so_luong: number
  hinh_anh: string
}

export async function GET(_request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    const userId = payload ? Number(payload.sub) : undefined

    if (!userId) {
      return NextResponse.json({ items: [] })
    }

    const query = `
      SELECT
        ci.id_chi_tiet_gio,
        ci.id_san_pham,
        p.ten_san_pham,
        p.gia_tien,
        ci.so_luong,
        p.hinh_anh
      FROM chi_tiet_gio ci
      JOIN gio_hang g ON ci.id_gio = g.id_gio
      JOIN san_pham p ON ci.id_san_pham = p.id_san_pham
      WHERE g.id_nguoi_dung = @userId
    `

    const items = await executeQuery<CartItem>(query, { userId: Number(userId) })

    const formattedItems = items.map((item) => ({
      id: item.id_chi_tiet_gio,
      productId: item.id_san_pham,
      name: item.ten_san_pham,
      price: item.gia_tien,
      quantity: item.so_luong,
      image: item.hinh_anh,
    }))

    return NextResponse.json({ items: formattedItems })
  } catch (error) {
    console.error("[v0] Error fetching cart:", error)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || "auth_token")?.value
    const payload = token ? verifyJwt(token) : null
    const userId = payload ? Number(payload.sub) : undefined
    const body = await request.json()
    const { productId, quantity } = body

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const getCartQuery = `SELECT id_gio FROM gio_hang WHERE id_nguoi_dung = @userId`
    const cartResult = await executeQuery<{ id_gio: number }>(getCartQuery, { userId })

    let cartId = cartResult[0]?.id_gio

    if (!cartId) {
      const createCartQuery = `
        INSERT INTO gio_hang (id_nguoi_dung) VALUES (@userId)
        SELECT SCOPE_IDENTITY() as id_gio
      `
      const newCart = await executeQuery<{ id_gio: number }>(createCartQuery, { userId })
      cartId = newCart[0].id_gio
    }

    const insertQuery = `
      INSERT INTO chi_tiet_gio (id_gio, id_san_pham, so_luong)
      VALUES (@id_gio, @id_san_pham, @so_luong)
    `

    await executeNonQuery(insertQuery, {
      id_gio: cartId,
      id_san_pham: Number(productId),
      so_luong: Number(quantity),
    })

    return NextResponse.json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
    })
  } catch (error) {
    console.error("[v0] Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { cartItemId, quantity } = body

    const query = `
      UPDATE chi_tiet_gio
      SET so_luong = @so_luong
      WHERE id_chi_tiet_gio = @id_chi_tiet_gio
    `

    await executeNonQuery(query, {
      id_chi_tiet_gio: Number(cartItemId),
      so_luong: Number(quantity),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("id")
    
    if (!cartItemId) {
      return NextResponse.json({ error: "Missing cart item id" }, { status: 400 })
    }

    const query = `DELETE FROM chi_tiet_gio WHERE id_chi_tiet_gio = @id_chi_tiet_gio`

    await executeNonQuery(query, { id_chi_tiet_gio: Number(cartItemId) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting from cart:", error)
    return NextResponse.json({ error: "Failed to delete from cart" }, { status: 500 })
  }
}
