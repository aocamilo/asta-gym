import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);

    const client_id = params.get("client_id");
    const client_secret = params.get("client_secret");
    const code = params.get("code");

    console.log({ client_id, client_secret, code });

    const tokenResponse = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    const response = await tokenResponse.json();

    console.log({ response: JSON.stringify(response) });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("GitHub Token Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub token" },
      { status: 500 }
    );
  }
}
