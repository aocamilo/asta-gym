"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name should only contain letters, spaces, hyphens and apostrophes"
      ),
    street: z
      .string()
      .min(1, "Street is required")
      .regex(
        /^\d+\s[a-zA-Z0-9\s.,'-]+$/,
        "Street should start with a number followed by street name"
      ),
    city: z
      .string()
      .min(1, "City is required")
      .regex(
        /^[a-zA-Z\s.-]+$/,
        "City should only contain letters, spaces, periods and hyphens"
      ),
    zip: z
      .string()
      .regex(
        /^\d{5}(-\d{4})?$/,
        "Zip code must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789)"
      ),
    newsletter: z.boolean().optional(),
    contact: z.enum(["email", "phone", "none"]),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone must be 10 digits (e.g., 1234567890)")
      .optional()
      .or(z.literal("")),
    comments: z
      .string()
      .max(500, "Comments must be less than 500 characters")
      .optional(),
    country: z.enum(["US", "MX", "CA"]),
    attachment: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return Array.from(files).every(
            (file) => file.size <= 5 * 1024 * 1024
          );
        },
        {
          message: "Each file must be less than 5MB",
        }
      ),
  })
  .refine(
    (data) => {
      if (
        data.contact === "email" &&
        (!data.email || data.email.length === 0)
      ) {
        return false;
      }
      if (
        data.contact === "phone" &&
        (!data.phone || data.phone.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Contact information is required based on your selected contact method.",
      path: ["contact"],
    }
  );

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newsletter: false,
      contact: "none",
      country: "US",
      email: "",
      phone: "",
      comments: "",
    },
    mode: "onChange",
  });

  const contactMethod = watch("contact");

  const onSubmit = (data: FormData) => {
    console.log(data);
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Contact Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Your name"
              maxLength={80}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              {...register("street")}
              placeholder="Street address"
              maxLength={80}
              className={errors.street ? "input-error" : ""}
            />
            {errors.street && (
              <p className="text-sm text-red-500">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="City"
                maxLength={80}
                className={errors.city ? "input-error" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                id="zip"
                {...register("zip")}
                placeholder="Zip Code"
                maxLength={10}
                className={errors.zip ? "input-error" : ""}
              />
              {errors.zip && (
                <p className="text-sm text-red-500">{errors.zip.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="newsletter"
              control={control}
              render={({ field }) => (
                <Checkbox
                  name="newsletter"
                  id="newsletter"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
            {errors.newsletter && (
              <p className="text-sm text-red-500">
                {errors.newsletter.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="space-y-2">
              <Label>Preferred contact method</Label>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="contact"
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="contact-email" />
                      <Label htmlFor="contact-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="contact-phone" />
                      <Label htmlFor="contact-phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="contact-none" />
                      <Label htmlFor="contact-none">No contact</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.contact && (
              <p className="text-sm text-red-500">{errors.contact.message}</p>
            )}
          </div>

          {contactMethod === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              {errors.contact && contactMethod === "email" && (
                <p className="text-sm text-red-500">{errors.contact.message}</p>
              )}
            </div>
          )}

          {contactMethod === "phone" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="1234567890"
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
              {errors.contact && contactMethod === "phone" && (
                <p className="text-sm text-red-500">{errors.contact.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              {...register("comments")}
              placeholder="Your comments..."
              className={errors.comments ? "input-error" : ""}
            />
            {errors.comments && (
              <p className="text-sm text-red-500">{errors.comments.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  name="country"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <Input
              id="attachment"
              type="file"
              {...register("attachment")}
              className={`cursor-pointer ${
                errors.attachment ? "input-error" : ""
              }`}
            />
            {errors.attachment && (
              <p className="text-sm text-red-500">
                {errors.attachment.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Contact Info"}
          </Button>
        </form>

        {isSubmitted && (
          <Alert
            className={`mt-4 ${
              Object.keys(errors).length === 0 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <AlertDescription>
              {Object.keys(errors).length === 0 ? (
                <span className="text-green-700">
                  Success! Your information has been saved.
                </span>
              ) : (
                <span className="text-red-700">
                  Error: Please check the form for errors and try again.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
