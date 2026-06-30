# Gaya Connect - Dummy Data & Testing Guide

This document outlines the core functions of the Gaya Connect platform and provides dummy data structures so you can easily test the full website (via MongoDB Compass, Postman, or your database GUI).

## 1. User
**Function:** The core identity. Users can have roles like `user`, `vendor`, or `admin`.
- `admin` can approve things and access the dashboard.
- `vendor` gets a business listing and can post offers/banners.
- `user` is a regular customer.

**Dummy Data (JSON):**
```json
{
  "name": "Test Admin",
  "phone": "9999999999",
  "email": "admin@gayaconnect.in",
  "password": "$2a$10$YourHashedPasswordHere", 
  "role": "admin",
  "subscriptionActive": true,
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00Z" }
}
```
*(Note: Passwords must be bcrypt hashed. It's usually easier to register a user via the website UI, then change their role to `admin` directly in the database).*

---

## 2. Vendor
**Function:** Business listings in the directory. Must be linked to a `User` (via `userId`).
- Needs `isApproved: true` to show up publicly.

**Dummy Data (JSON):**
```json
{
  "userId": "REPLACE_WITH_USER_OBJECT_ID",
  "name": "Gaya Sweets & Bakers",
  "category": "Food & Dining",
  "subCategory": "Bakery",
  "description": "Best traditional sweets in Gaya.",
  "address": "Swarajpuri Road, Gaya",
  "isApproved": true,
  "isPremium": true,
  "rating": 4.8,
  "totalReviews": 12,
  "location": {
    "type": "Point",
    "coordinates": [84.9914, 24.7964]
  }
}
```

---

## 3. Labourer (Worker)
**Function:** Local workers/technicians available for hire. Can be linked to a `userId` or just created by admin.
- Controlled by the `availability` switch (true/false).
- `isApproved` must be `true`.

**Dummy Data (JSON):**
```json
{
  "name": "Ramesh Kumar",
  "phone": "8888888888",
  "role": "Plumber",
  "category": "Home Services",
  "area": "Manpur",
  "dailyRate": 600,
  "availability": true,
  "isApproved": true,
  "rating": 4.5,
  "skills": ["Pipe fitting", "Water tank repair"]
}
```

---

## 4. Vehicle (Rentals)
**Function:** Vehicles listed by users for rent/hire.
- `status` should be `"approved"` to be visible to the public.

**Dummy Data (JSON):**
```json
{
  "ownerId": "REPLACE_WITH_USER_OBJECT_ID",
  "ownerName": "Suresh Travels",
  "phone": "7777777777",
  "vehicleName": "Mahindra Scorpio",
  "vehicleModel": "2022 S11",
  "vehicleNumber": "BR 02 XX 1234",
  "dlNumber": "BR022010XXXXXXX",
  "isCommercial": true,
  "liabilityAccepted": true,
  "status": "approved",
  "paymentStatus": "completed"
}
```

---

## 5. Job / Sale
**Function:** Employment opportunities or items for sale posted by Vendors or Admins.
- `type` is either `"job"` or `"sale"`.
- `isActive` must be `true`.

**Dummy Data (JSON):**
```json
{
  "title": "Need 2 Delivery Boys",
  "description": "Looking for delivery boys for local grocery delivery in AP Colony area. Must have own bike.",
  "type": "job",
  "salaryOrPrice": "₹8,000/month",
  "location": "AP Colony, Gaya",
  "vendorId": "REPLACE_WITH_VENDOR_OBJECT_ID",
  "postedByAdmin": false,
  "isActive": true
}
```

---

## 6. Offer
**Function:** Promotional discounts posted by Vendors.

**Dummy Data (JSON):**
```json
{
  "vendorId": "REPLACE_WITH_VENDOR_OBJECT_ID",
  "title": "20% OFF on Wedding Catering",
  "description": "Book our catering service this month and get a flat 20% discount on vegetarian menus.",
  "discountText": "20% OFF",
  "isActive": true,
  "validUntil": { "$date": "2024-12-31T00:00:00Z" }
}
```

---

## 7. Banner
**Function:** Large promotional images shown on the website homepage or category pages.
- `adminApproved` and `isActive` must both be `true` to display.
- `position` can be `home_top`, `home_middle`, `category_top`, etc.

**Dummy Data (JSON):**
```json
{
  "vendorId": "REPLACE_WITH_VENDOR_OBJECT_ID",
  "title": "Grand Diwali Sale",
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "link": "https://gayaconnect.in/offers",
  "position": "home_top",
  "isActive": true,
  "adminApproved": true,
  "startDate": { "$date": "2024-01-01T00:00:00Z" },
  "endDate": { "$date": "2024-12-31T00:00:00Z" }
}
```

---

### 💡 Testing Tips for Gaya Connect
1. **Admin Access:** The easiest way to test admin features is to register normally on the website frontend. Then, open MongoDB (or MongoDB Compass), find your `User` document, and change `"role": "user"` to `"role": "admin"`.
2. **References (`ObjectId`):** If you are inserting this dummy data manually into your database, remember to replace `REPLACE_WITH_..._OBJECT_ID` with actual `_id` values from your `Users` or `Vendors` collections so the relationships work properly.
3. **Approval Flow:** Notice that many collections (`Vendor`, `Labourer`, `Vehicle`, `Banner`) have an `isApproved`, `adminApproved`, or `status` field. To test the public-facing website, make sure to set these to `true` or `"approved"`. To test the admin dashboard functionality, set them to `false` or `"pending"` so they show up in your admin approval queues!
