// import { AccessToken } from "livekit-server-sdk";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req) {
//     const room = req.nextUrl.searchParams.get("room");
//     const username = req.nextUrl.searchParams.get("username");

//     // Kiểm tra tham số đầu vào
//     if (!room || !username) {
//         return NextResponse.json(
//             { error: 'Missing required parameters: "room" and/or "username"' },
//             { status: 400 }
//         );
//     }

//     const apiKey = process.env.LIVEKIT_API_KEY;
//     const apiSecret = process.env.LIVEKIT_API_SECRET;

//     if (!apiKey || !apiSecret) {
//         return NextResponse.json(
//             { error: "Server misconfigured: Missing API key or secret" },
//             { status: 500 }
//         );
//     }

//     try {
//         // Tạo AccessToken
//         const at = new AccessToken(apiKey, apiSecret, { identity: username });

//         // Cấp quyền cho token
//         at.addGrant({
//             room,
//             roomJoin: true,
//             canPublish: true,
//             canSubscribe: true,
//         });

//         // Tạo token JWT
//         const token = await at.toJwt();

//         // Kiểm tra nếu token là chuỗi hợp lệ
//         if (!token || typeof token !== "string") {
//             console.error("Error: Invalid token generated");
//             return NextResponse.json(
//                 { error: "Failed to generate valid token" },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json({ token });
//     } catch (e) {
//         console.error("Error generating token:", e);
//         return NextResponse.json(
//             { error: "Failed to generate token" },
//             { status: 500 }
//         );
//     }
// }

import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json(
      { error: 'Missing required parameters: "room" and/or "username"' },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server misconfigured: Missing API key or secret" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity: username });

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (e) {
    console.error("Error generating token:", e);
    return NextResponse.json(
      { error: "Failed to generate token" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
