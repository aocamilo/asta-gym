import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const bearerToken = authHeader.split("Bearer ")[1];
    if (!bearerToken) {
      return NextResponse.json(
        { error: "Invalid authorization format" },
        { status: 401 }
      );
    }

    // Fetch user info
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        authorization: `token ${bearerToken}`,
        accept: "application/json",
      },
    });
    const userInfo = await userResponse.json();

    // If no email, fetch emails
    let email = userInfo.email;
    if (email === null) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        method: "GET",
        headers: {
          authorization: `token ${bearerToken}`,
          accept: "application/json",
        },
      });
      const emails = await emailsResponse.json();

      const primaryEmail = emails.find(
        (email: { primary: string }) => email.primary
      );
      email = primaryEmail ? primaryEmail.email : null;
    }

    return NextResponse.json(
      {
        email: email,
        sub: userInfo.id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GitHub User Info Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub user info" },
      { status: 500 }
    );
  }
}
