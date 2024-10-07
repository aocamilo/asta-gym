"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().regex(/^\d+$/, "Zip code must be numeric"),
  newsletter: z.boolean(),
  contact: z.boolean(),
  comments: z.string(),
  country: z.enum(["US", "MX", "CA"]),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    setIsSubmitted(true);
    // Here you can handle the form submission, e.g., sending data to an API
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <head>
        <title>Simple Form</title>
      </head>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="street">Street</label>
            <input
              id="street"
              {...register("street")}
              placeholder="Street..."
              maxLength={80}
            />
            {errors.street && <span>{errors.street.message}</span>}
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              {...register("city")}
              placeholder="City..."
              maxLength={80}
            />
            {errors.city && <span>{errors.city.message}</span>}
          </div>
          <div>
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              {...register("zip")}
              placeholder="Zip Code..."
              maxLength={80}
            />
            {errors.zip && <span>{errors.zip.message}</span>}
          </div>
          <div>
            <label htmlFor="newsletter">Subscribe to newsletter</label>
            <input
              id="newsletter"
              type="checkbox"
              {...register("newsletter")}
            />
          </div>
          <div>
            <label htmlFor="contact">Contact</label>
            <input id="contact" type="checkbox" {...register("contact")} />
          </div>
          <div>
            <label htmlFor="comments">Comments</label>
            <textarea id="comments" {...register("comments")}></textarea>
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <select id="country" {...register("country")}>
              <option value="US">United States</option>
              <option value="MX">Mexico</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <button type="submit">Save Contact Info</button>
        </form>
        {isSubmitted && (
          <>
            {Object.keys(errors).length === 0 ? (
              <span className="success">Success</span>
            ) : (
              <span className="error">Error</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
