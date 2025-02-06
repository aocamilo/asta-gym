import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log({ request: JSON.stringify(request) });

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

    console.log({ tokenResponse: JSON.stringify(tokenResponse) });

    const token = await tokenResponse.json();

    console.log({ token: JSON.stringify(token) });

    return NextResponse.json(token, { status: 200 });
  } catch (error) {
    console.error("GitHub Token Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub token" },
      { status: 500 }
    );
  }
}
