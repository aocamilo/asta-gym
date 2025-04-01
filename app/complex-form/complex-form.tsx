"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Add type definition before the form schema:
type RevisionType =
  | "budgetIncrease"
  | "budgetDecrease"
  | "projectDuration"
  | "other";

const formSchema = z.object({
  // 1. Type of Submission
  submissionType: z.enum([
    "preApplication",
    "application",
    "changed",
    "corrected",
  ]),

  // 2. Date Submitted
  dateSubmitted: z.string(),

  // 3. Date Received by State
  dateReceivedByState: z.string().optional(),

  // 4. Federal Identifiers
  federalIdentifier: z.string().optional(),
  agencyRoutingNumber: z.string().optional(),
  previousTrackingNumber: z.string().optional(),
  stateApplicationIdentifier: z.string().optional(),

  // 5. Applicant Information
  applicantInfo: z.object({
    legalName: z.string().min(1, "Legal name is required"),
    dunsNumber: z.string().min(9, "DUNS number must be 9 digits"),
    department: z.string().optional(),
    division: z.string().optional(),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().optional(),
    state: z.string().min(1, "State is required"),
    province: z.string().optional(),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    organizationType: z.enum([
      "individual",
      "smallBusiness",
      "otherOrganization",
    ]),
    womenOwned: z.enum(["yes", "no"]),
    disadvantaged: z.enum(["yes", "no"]),
    personToBeContacted: z.object({
      prefix: z.string().optional(),
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Last name is required"),
      suffix: z.string().optional(),
      title: z.string().min(1, "Title is required"),
      position: z.string().optional(),
      phone: z.string().min(10, "Phone number is required"),
      fax: z.string().optional(),
      email: z.string().email("Invalid email address"),
    }),
  }),

  // 6. Employer Identification
  employerIdentification: z
    .string()
    .min(1, "Employer identification is required"),

  // 7. Type of Applicant
  applicantType: z.enum([
    "stateGovernment",
    "countyGovernment",
    "cityOrTownship",
    "specialDistrict",
    "independent",
    "stateControlled",
    "privateInstitution",
    "individual",
    "profitOrganization",
    "smallBusiness",
    "nonprofit",
    "nativeAmericanTribal",
    "international",
    "other",
  ]),
  otherApplicantType: z.string().optional(),
  womenBusinessStatus: z.enum(["yes", "no"]),
  disadvantagedStatus: z.enum(["yes", "no"]),
  tribalStatus: z.enum(["yes", "no"]),

  // 8. Type of Application
  applicationType: z.enum([
    "new",
    "resubmission",
    "renewal",
    "continuation",
    "revision",
  ]),
  revisionType: z
    .array(
      z.enum(["budgetIncrease", "budgetDecrease", "projectDuration", "other"])
    )
    .optional(),
  otherRevisionType: z.string().optional(),

  // 9. Name of Federal Agency
  federalAgency: z.string().min(1, "Federal agency is required"),

  // 10. Catalog of Federal Domestic Assistance Number and Title
  cfda: z.object({
    number: z.string().min(1, "CFDA number is required"),
    title: z.string().min(1, "CFDA title is required"),
  }),

  // 11. Descriptive Title of Project
  projectTitle: z.string().min(1, "Project title is required"),

  // 12. Areas Affected by Project
  areasAffected: z.string().min(1, "Areas affected is required"),

  // 13. Proposed Project Dates
  proposedDates: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),

  // 14. Congressional Districts
  congressionalDistricts: z.object({
    applicant: z.string().min(1, "Applicant district is required"),
    project: z.string().min(1, "Project district is required"),
  }),

  // 15. Project Director/Principal Investigator
  projectDirector: z.object({
    prefix: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    suffix: z.string().optional(),
    position: z.string().min(1, "Position is required"),
    organization: z.string().min(1, "Organization is required"),
    department: z.string().optional(),
    division: z.string().optional(),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().optional(),
    state: z.string().min(1, "State is required"),
    province: z.string().optional(),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(10, "Phone number is required"),
    fax: z.string().optional(),
    email: z.string().email("Invalid email address"),
  }),

  // 16. Estimated Project Funding
  estimatedFunding: z.object({
    federal: z.string().min(1, "Federal amount is required"),
    applicant: z.string().min(1, "Applicant amount is required"),
    state: z.string().min(1, "State amount is required"),
    local: z.string().min(1, "Local amount is required"),
    other: z.string().min(1, "Other amount is required"),
    program: z.string().min(1, "Program income amount is required"),
    total: z.string().min(1, "Total amount is required"),
  }),

  // 17. Is Application Subject to Review By State Executive Order 12372 Process?
  stateReview: z.enum([
    "programNotCovered",
    "programNotSelected",
    "programCovered",
  ]),
  stateReviewDate: z.string().optional(),

  // 18. Is Applicant Delinquent On Any Federal Debt?
  federalDebt: z.enum(["yes", "no"]),
  federalDebtExplanation: z.string().optional(),

  // 19. Authorized Representative
  authorizedRepresentative: z.object({
    prefix: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    suffix: z.string().optional(),
    position: z.string().min(1, "Position is required"),
    organization: z.string().min(1, "Organization is required"),
    department: z.string().optional(),
    division: z.string().optional(),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().optional(),
    state: z.string().min(1, "State is required"),
    province: z.string().optional(),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().min(10, "Phone number is required"),
    fax: z.string().optional(),
    email: z.string().email("Invalid email address"),
    signature: z.string().min(1, "Signature is required"),
    dateSigned: z.string().min(1, "Date signed is required"),
  }),

  // 20. Pre-application
  preApplication: z.object({
    attachmentName: z.string().optional(),
    mimeType: z.string().optional(),
  }),

  // 21. Cover Letter Attachment
  coverLetter: z.object({
    attachmentName: z.string().optional(),
    mimeType: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ComplexForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submissionType: "application",
      dateSubmitted: new Date().toISOString().split("T")[0],
      applicantInfo: {
        personToBeContacted: {},
      },
      applicationType: "new",
      stateReview: "programNotCovered",
      federalDebt: "no",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Type of Submission */}
        <FormField
          control={form.control}
          name="submissionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1. Type of Submission</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="preApplication" />
                    <FormLabel className="font-normal">
                      Pre-application
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="application" />
                    <FormLabel className="font-normal">Application</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="changed" />
                    <FormLabel className="font-normal">
                      Changed/Corrected Application
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Date Submitted */}
        <FormField
          control={form.control}
          name="dateSubmitted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2. Date Submitted</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. Date Received by State */}
        <FormField
          control={form.control}
          name="dateReceivedByState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3. Date Received by State</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4. Federal Identifiers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">4. Federal Identifiers</h3>

          <FormField
            control={form.control}
            name="federalIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>a. Federal Identifier</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agencyRoutingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>b. Agency Routing Number</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousTrackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>c. Previous Grants.gov Tracking Number</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 5. Applicant Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">5. Applicant Information</h3>

          <FormField
            control={form.control}
            name="applicantInfo.legalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Name</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantInfo.dunsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DUNS Number</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="applicantInfo.department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantInfo.division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="applicantInfo.streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="applicantInfo.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantInfo.county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicantInfo.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="applicantInfo.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantInfo.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantInfo.organizationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="smallBusiness">
                        Small Business
                      </SelectItem>
                      <SelectItem value="otherOrganization">
                        Other Organization
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantInfo.womenOwned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Women Owned Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="yes" />
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="no" />
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicantInfo.disadvantaged"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Socially and Economically Disadvantaged Status
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="yes" />
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="no" />
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h4 className="font-medium">Person to be Contacted</h4>

            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select prefix" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mr">Mr.</SelectItem>
                        <SelectItem value="mrs">Mrs.</SelectItem>
                        <SelectItem value="ms">Ms.</SelectItem>
                        <SelectItem value="dr">Dr.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicantInfo.personToBeContacted.fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* 6. Employer Identification */}
        <FormField
          control={form.control}
          name="employerIdentification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>6. Employer Identification (EIN) or (TIN)</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 7. Type of Applicant */}
        <FormField
          control={form.control}
          name="applicantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>7. Type of Applicant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select applicant type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="stateGovernment">
                    State Government
                  </SelectItem>
                  <SelectItem value="countyGovernment">
                    County Government
                  </SelectItem>
                  <SelectItem value="cityOrTownship">
                    City or Township
                  </SelectItem>
                  <SelectItem value="specialDistrict">
                    Special District
                  </SelectItem>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="stateControlled">
                    State Controlled
                  </SelectItem>
                  <SelectItem value="privateInstitution">
                    Private Institution
                  </SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="profitOrganization">
                    Profit Organization
                  </SelectItem>
                  <SelectItem value="smallBusiness">Small Business</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  <SelectItem value="nativeAmericanTribal">
                    Native American Tribal
                  </SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 8. Type of Application with Revision Types */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="applicationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>8. Type of Application</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="resubmission">Resubmission</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="continuation">Continuation</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("applicationType") === "revision" && (
            <>
              <FormField
                control={form.control}
                name="revisionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>If Revision, mark appropriate box(es)</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          "budgetIncrease",
                          "budgetDecrease",
                          "projectDuration",
                          "other",
                        ] as const
                      ).map((type: RevisionType) => (
                        <FormItem
                          key={type}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value?.includes(type)}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...(field.value || []), type]
                                  : field.value?.filter((t) => t !== type) ||
                                    [];
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type === "budgetIncrease"
                              ? "Budget Increase"
                              : type === "budgetDecrease"
                              ? "Budget Decrease"
                              : type === "projectDuration"
                              ? "Project Duration"
                              : "Other (specify)"}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("revisionType")?.includes("other") && (
                <FormField
                  control={form.control}
                  name="otherRevisionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other (specify)</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}
        </div>

        {/* 9. Name of Federal Agency */}
        <FormField
          control={form.control}
          name="federalAgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>9. Name of Federal Agency</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 10. CFDA */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cfda.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>10.a. CFDA Number</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cfda.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>10.b. CFDA Title</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 11. Project Title */}
        <FormField
          control={form.control}
          name="projectTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>11. Descriptive Title of Project</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 12. Areas Affected by Project */}
        <FormField
          control={form.control}
          name="areasAffected"
          render={({ field }) => (
            <FormItem>
              <FormLabel>12. Areas Affected by Project</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value || ""}
                  placeholder="Cities, Counties, States, etc."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 13. Proposed Project */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="proposedDates.startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>13.a. Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposedDates.endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>13.b. End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 14. Congressional Districts */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="congressionalDistricts.applicant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>14.a. Applicant District</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="congressionalDistricts.project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>14.b. Project District(s)</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 15. Project Director/Principal Investigator */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            15. Project Director/Principal Investigator
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="projectDirector.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position/Title</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectDirector.organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="projectDirector.streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.fax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectDirector.prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDirector.suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select suffix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jr">Jr.</SelectItem>
                      <SelectItem value="sr">Sr.</SelectItem>
                      <SelectItem value="ii">II</SelectItem>
                      <SelectItem value="iii">III</SelectItem>
                      <SelectItem value="iv">IV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 16. Estimated Project Funding */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            16. Estimated Project Funding
          </h3>

          <FormField
            control={form.control}
            name="estimatedFunding.federal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>a. Federal ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.applicant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>b. Applicant ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>c. State ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.local"
            render={({ field }) => (
              <FormItem>
                <FormLabel>d. Local ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>e. Other ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>f. Program Income ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedFunding.total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>g. TOTAL ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 17. State Review */}
        <FormField
          control={form.control}
          name="stateReview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                17. Is Application Subject to Review By State Executive Order
                12372 Process?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="programNotCovered" />
                    <FormLabel className="font-normal">
                      This program is not covered by E.O. 12372
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="programNotSelected" />
                    <FormLabel className="font-normal">
                      Program has not been selected by state for review
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="programCovered" />
                    <FormLabel className="font-normal">
                      Program is subject to E.O. 12372
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 18. Federal Debt */}
        <FormField
          control={form.control}
          name="federalDebt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                18. Is Applicant Delinquent On Any Federal Debt?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="no" />
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="yes" />
                    <FormLabel className="font-normal">
                      Yes (Provide explanation)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 19. Authorized Representative */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            19. Authorized Representative
          </h3>

          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="authorizedRepresentative.streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorizedRepresentative.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorizedRepresentative.fax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 20. Pre-application */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">20. Pre-application</h3>
          <FormField
            control={form.control}
            name="preApplication.attachmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file.name);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 21. Cover Letter Attachment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">21. Cover Letter Attachment</h3>
          <FormField
            control={form.control}
            name="coverLetter.attachmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file.name);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Add State Review Date when applicable */}
        {form.watch("stateReview") === "programCovered" && (
          <FormField
            control={form.control}
            name="stateReviewDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Add Federal Debt Explanation when applicable */}
        {form.watch("federalDebt") === "yes" && (
          <FormField
            control={form.control}
            name="federalDebtExplanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button type="submit">Submit Application</Button>
      </form>
    </Form>
  );
}
