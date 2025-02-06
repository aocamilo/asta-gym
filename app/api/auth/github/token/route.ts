import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { client_id, client_secret, code } = await request.json();

    const tokenResponse = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    const token = await tokenResponse.json();
    return NextResponse.json(token, { status: 200 });
  } catch (error) {
    console.error("GitHub Token Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub token" },
      { status: 500 }
    );
  }
}
