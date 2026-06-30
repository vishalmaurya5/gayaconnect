import { z } from 'zod'

const safeText = (label, min, max) => z.string()
  .trim()
  .min(min, `${label} is required`)
  .max(max, `${label} is too long`)
  .refine((value) => !/[<>]/.test(value), `${label} cannot contain HTML markup`)

const optionalSafeText = (label, max) => z.string()
  .trim()
  .max(max, `${label} is too long`)
  .refine((value) => !/[<>]/.test(value), `${label} cannot contain HTML markup`)
  .optional()
  .default('')

const phoneSchema = z.string().trim().regex(/^[+()\d\s-]{7,20}$/, 'Enter a valid phone number')
const imageSchema = z.string().max(3_000_000, 'Image is too large')

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
  rememberMe: z.boolean().optional(),
}).strict()

export const registerSchema = z.object({
  name: safeText('Name', 2, 80),
  email: z.string().trim().email('Enter a valid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  phone: phoneSchema,
  role: z.enum(['user', 'vendor']).default('user'),
  businessName: optionalSafeText('Business name', 120),
  category: optionalSafeText('Category', 80),
  subCategory: optionalSafeText('Subcategory', 80),
  address: safeText('Address', 2, 200),
  description: optionalSafeText('Description', 1000),
  profileImage: imageSchema.optional().or(z.literal('')),
}).strict().superRefine((data, ctx) => {
  if (data.role !== 'vendor') return
  for (const field of ['businessName', 'category', 'subCategory']) {
    if (!data[field]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} is required for vendors` })
    }
  }
})

export const vendorCreateSchema = z.object({
  name: safeText('Business name', 2, 120),
  email: z.string().trim().email().toLowerCase(),
  phone: phoneSchema,
  category: safeText('Category', 2, 80),
  subCategory: optionalSafeText('Subcategory', 80),
  description: optionalSafeText('Description', 1000),
  address: safeText('Address', 2, 200),
  location: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  logo: z.string().max(3_000_000).optional(),
  instagram: optionalSafeText('Instagram Link', 300),
  facebook: optionalSafeText('Facebook Link', 300),
}).strict()

export const vendorUpdateSchema = vendorCreateSchema.partial().strict()

export const offerSchema = z.object({
  title: safeText('Title', 2, 120),
  description: safeText('Description', 2, 1000),
  discount: safeText('Discount', 1, 80),
  planType: z.enum(['7days', '30days', '365days']),
  paymentId: z.string().min(1, 'Payment ID is required'),
}).strict()

export const bannerSchema = z.object({
  title: safeText('Title', 2, 120),
  description: optionalSafeText('Description', 1000),
  imageUrl: z.string().min(1, 'Banner image is required').max(3_000_000),
  linkUrl: z.string().trim().url('Enter a valid banner link').optional().or(z.literal('')),
  vendorId: z.string().trim().optional().or(z.literal('')),
  position: z.enum(['homepage', 'category', 'sidebar']).optional(),
  isActive: z.boolean().optional(),
  duration: z.string().optional(),
}).strict()

export const profileSchema = z.object({
  name: safeText('Name', 2, 80),
  phone: phoneSchema,
  address: optionalSafeText('Address', 200),
  profileImage: imageSchema.optional().or(z.literal('')),
  businessName: optionalSafeText('Business name', 120),
  category: optionalSafeText('Category', 80),
  subCategory: optionalSafeText('Subcategory', 80),
  businessAddress: optionalSafeText('Business address', 200),
  description: optionalSafeText('Description', 1000),
  workerName: optionalSafeText('Worker Name', 80),
  workerRole: optionalSafeText('Worker Role', 80),
  workerCategory: optionalSafeText('Worker Category', 80),
  workerArea: optionalSafeText('Worker Area', 80),
  workerDailyRate: z.union([z.number(), z.string()]).optional(),
  workerHourlyRate: z.union([z.number(), z.string()]).optional(),
  workerAvailability: z.boolean().optional(),
  workerSkills: z.array(z.string()).optional(),
  instagram: optionalSafeText('Instagram Link', 300),
  facebook: optionalSafeText('Facebook Link', 300),
  experience: optionalSafeText('Experience', 100),
  workingHours: optionalSafeText('Working Hours', 200),
  services: optionalSafeText('Services', 1000), // comma separated string
}).strict()

export const paymentOrderSchema = z.object({
  provider: z.enum(['razorpay', 'phonepe']).default('razorpay'),
  planType: z.enum([
    'contact_access_yearly',
    'offer_access_user_yearly',
    'offer_access_vendor_yearly',
    'offer_post_vendor_yearly',
    'banner_post_monthly',
    'subscription_monthly',
    'offer_tier_7days',
    'offer_tier_30days',
    'offer_tier_365days',
  ]).default('contact_access_yearly'),
}).strict()

export function validationError(error) {
  const issue = error.issues?.[0]
  return issue?.message || 'Invalid request data'
}
