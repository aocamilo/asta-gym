"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().regex(/^\d+$/, "Zip code must be numeric"),
  newsletter: z.boolean().optional(),
  contact: z.boolean().optional(),
  comments: z.string().optional(),
  country: z.enum(["US", "MX", "CA"]),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
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
              />
              {errors.zip && (
                <p className="text-sm text-red-500">{errors.zip.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" {...register("newsletter")} />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
            {errors.newsletter && (
              <p className="text-sm text-red-500">
                {errors.newsletter.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="contact" {...register("contact")} />
            <Label htmlFor="contact">Contact me</Label>
            {errors.contact && (
              <p className="text-sm text-red-500">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              {...register("comments")}
              placeholder="Your comments..."
            />
            {errors.comments && (
              <p className="text-sm text-red-500">{errors.comments.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select {...register("country")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Save Contact Info
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
