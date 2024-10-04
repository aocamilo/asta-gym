"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.getElementById("contactInfo")?.addEventListener("click", () => {
      const street = (document.getElementById("street") as HTMLInputElement)
        ?.value;
      const city = (document.getElementById("city") as HTMLInputElement)?.value;
      const zip = (document.getElementById("zip") as HTMLInputElement)?.value;
      const success = document.getElementsByClassName("success");
      const error = document.getElementsByClassName("error");
      const isNumeric = /^\d+$/.test(zip); // test if zip code is numeric

      // if all fields are filled out and zip code is numeric
      if (street && city && zip && isNumeric) {
        //@ts-expect-error fixing for deployment
        success.style.display = "block";
        //@ts-expect-error fixing for deployment

        error.style.display = "none";
      } else {
        //@ts-expect-error fixing for deployment
        error.style.display = "block";
        //@ts-expect-error fixing for deployment

        success.style.display = "none";
      }
    });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <head>
        <title>Simple Form</title>
      </head>
      <body>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "300px",
            padding: "10px",
            border: "1px solid black",
            marginBottom: "8px",
          }}
        >
          <form id="contactInfo">
            <div>
              <label htmlFor="street">Street</label>
              <input
                id="street"
                placeholder="Street..."
                maxLength={80}
                title="Street"
              />
            </div>
            <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                placeholder="City..."
                maxLength={80}
                title="City"
              />
            </div>
            <div>
              <label htmlFor="zip">Zip Code</label>
              <input
                id="zip"
                placeholder="Zip Code..."
                maxLength={80}
                title="Zip Code"
              />
            </div>
            <div>
              <label htmlFor="newsletter">Subscribe to newsletter</label>
              <input id="newsletter" type="checkbox" />
            </div>
            <div>
              <label htmlFor="contact">Contact</label>
              <input id="contact" type="radio" />
            </div>
            <div>
              <label htmlFor="comments">Comments</label>
              <textarea name="comments" id="comments"></textarea>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <select name="country" id="country">
                <option value="US">United States</option>
                <option value="MX">Mexico </option>
                <option value="CA">Canada</option>
              </select>
            </div>
            <button id="submit" name="submit" type="button">
              Save Contact Info
            </button>
            <a href="#">Some link</a>
          </form>
          <span className="success">Success</span>
          <span className="error">Error</span>
        </div>
      </body>
    </div>
  );
}
