# QUOTATION FOR COMPLETE DEVELOPMENT & DEPLOYMENT
## Shivashray Hotel Booking System

---

**Quotation Date:** [Current Date]  
**Quotation Number:** QTN-SHS-2024-001  
**Valid Until:** [Date + 30 days]  
**Project:** Complete Hotel Booking System Development & Production Deployment  
**Client:** Shivashray Hotel, Varanasi  
**Prepared By:** [Vijay/ workwithme.com]

---

## EXECUTIVE SUMMARY

This quotation outlines the complete development and deployment of a production-ready hotel booking system for Shivashray Hotel. The project includes frontend development (Next.js), backend API development (FastAPI), database design and implementation (PostgreSQL), payment gateway integration, email notifications, security hardening, and production deployment configuration.

**Total Development Timeline:** 25-35 working days (5-7 weeks)  
**Total One-Time Development Cost:** ₹2,50,000 - ₹3,50,000  
**Recommended Monthly Operating Cost:** ₹3,550 - ₹4,550/month

---

## PROJECT OVERVIEW

### System Architecture

The hotel booking system is a full-stack web application consisting of:

1. **Frontend Application** - Next.js 14+ with TypeScript, responsive UI
2. **Backend API** - FastAPI RESTful API with authentication
3. **Database** - PostgreSQL with proper schema design and migrations
4. **Production Infrastructure** - Docker, Nginx, automated backups

### Key Features

**User Features:**
- Browse and search available rooms with filters
- Real-time availability checking
- User registration and authentication
- Booking creation and management
- View booking history
- Hotel services and amenities display
- Responsive design for all devices

**Admin Features:**
- Admin dashboard with booking statistics
- Room management (create, update, delete)
- Booking management (confirm, check-in, check-out, cancel)
- Payment status management
- Revenue tracking
- User management

---

## PHASE-WISE DEVELOPMENT BREAKDOWN

---

## PHASE 1: DATABASE DESIGN & IMPLEMENTATION
**Priority:** Critical  
**Timeline:** 3-4 working days (24-32 hours)

### Scope of Work

**Database Schema Design:**
- Users table (authentication, roles, profiles)
- Room Types table (room categories, pricing)
- Rooms table (individual room inventory)
- Room Amenities table (features and facilities)
- Bookings table (reservations, dates, status)
- Services table (hotel services and amenities)
- Payment Transactions table (payment records)

**Database Implementation:**
- PostgreSQL database setup
- Schema creation with proper relationships
- Indexes for performance optimization
- Foreign key constraints
- Database migration system (Alembic)
- Seed data scripts for initial data
- Database connection pooling configuration

**Deliverables:**
- Complete database schema design document
- PostgreSQL database setup
- Alembic migration files
- Database models (`backend/app/models/`)
- Seed data script (`backend/scripts/seed_data.py`)
- Database connection configuration
- ER diagram documentation

**Development Cost:** ₹35,000 - ₹45,000

---

## PHASE 2: BACKEND API DEVELOPMENT
**Priority:** Critical  
**Timeline:** 8-10 working days (64-80 hours)

### Scope of Work

**Authentication & Authorization:**
- User registration API
- Login with JWT tokens
- Token refresh mechanism
- Password hashing (bcrypt)
- Role-based access control (Guest/Admin)
- Current user profile endpoint

**Rooms Management API:**
- List all rooms with filters (availability, type, price)
- Get room details by ID
- Check room availability for dates
- List room types
- Room amenities listing

**Bookings Management API:**
- Create booking
- List user bookings
- Get booking details
- Update booking (status, dates)
- Cancel booking
- Booking validation logic

**Admin API:**
- Admin dashboard statistics
- Create/update/delete rooms
- Manage all bookings
- Update booking status (confirm, check-in, check-out)
- User management

**Services API:**
- List hotel services
- Get service details

**Core Infrastructure:**
- FastAPI application setup
- CORS configuration
- Request/response models (Pydantic schemas)
- Error handling middleware
- API documentation (Swagger/OpenAPI)
- Database session management
- Environment configuration

**Deliverables:**
- Complete FastAPI backend application
- API endpoints (`backend/app/api/v1/`)
- Data models (`backend/app/models/`)
- Request/response schemas (`backend/app/schemas/`)
- Business logic services (`backend/app/services/`)
- Security utilities (`backend/app/core/security.py`)
- API documentation (auto-generated Swagger UI)
- Environment configuration files

**API Endpoints Delivered:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/rooms` - List rooms
- `GET /api/v1/rooms/{id}` - Get room details
- `GET /api/v1/rooms/{id}/availability` - Check availability
- `GET /api/v1/rooms/types` - List room types
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - List user bookings
- `GET /api/v1/bookings/{id}` - Get booking details
- `PATCH /api/v1/bookings/{id}` - Update booking
- `DELETE /api/v1/bookings/{id}` - Cancel booking
- `GET /api/v1/admin/bookings` - List all bookings (admin)
- `PATCH /api/v1/admin/bookings/{id}` - Update booking (admin)
- `POST /api/v1/admin/rooms` - Create room (admin)
- `GET /api/v1/services` - List services
- `GET /api/v1/services/{id}` - Get service details

**Development Cost:** ₹80,000 - ₹1,00,000

---

## PHASE 3: FRONTEND DEVELOPMENT
**Priority:** Critical  
**Timeline:** 10-12 working days (80-96 hours)

### Scope of Work

**UI/UX Design & Implementation:**
- Modern, responsive design with Tailwind CSS
- Component library setup (shadcn/ui)
- Mobile-first responsive layout
- Professional hotel branding and styling
- Smooth animations and transitions

**Pages Development:**

1. **Home Page:**
   - Hero section with hotel imagery
   - Features showcase
   - Rooms preview section
   - Services preview
   - Testimonials section
   - Call-to-action sections

2. **Rooms Listing Page:**
   - Room grid/list view
   - Filter functionality (date, type, price)
   - Search functionality
   - Room availability indicators
   - Responsive card layouts

3. **Room Details Page:**
   - Room image gallery
   - Room description and amenities
   - Pricing information
   - Availability calendar
   - Booking form integration

4. **Booking Pages:**
   - Booking form with date picker
   - Booking confirmation page
   - Booking details page
   - Booking history page
   - Booking cancellation

5. **Authentication Pages:**
   - User registration page
   - Login page
   - Form validation
   - Error handling

6. **Admin Dashboard:**
   - Dashboard with statistics
   - Booking management interface
   - Room management interface
   - Booking status updates
   - Revenue overview

7. **Additional Pages:**
   - About page
   - Services page
   - Contact page

**Components Development:**
- Reusable UI components
- Navigation bar with authentication state
- Footer component
- Booking form component
- Room card component
- Loading states and error boundaries
- Toast notifications

**State Management:**
- Authentication state management (Zustand)
- API client setup (Axios)
- Form handling (React Hook Form)
- Date handling utilities

**Integration:**
- API integration for all endpoints
- Real-time data fetching
- Error handling and user feedback
- Loading states management

**Deliverables:**
- Complete Next.js frontend application
- All pages (`frontend/app/`)
- Reusable components (`frontend/components/`)
- API client library (`frontend/lib/api.ts`)
- State management (`frontend/lib/store.ts`)
- Type definitions (`frontend/types/`)
- Responsive CSS with Tailwind
- Environment configuration

**Development Cost:** ₹1,00,000 - ₹1,30,000

---

## PHASE 4: PAYMENT GATEWAY INTEGRATION (Razorpay)
**Priority:** Critical  
**Timeline:** 2-3 working days (16-24 hours)

### Scope of Work

- Integration of Razorpay payment gateway
- Create payment service with order creation, verification, and capture
- Payment API endpoints (`/api/v1/payments/create-order`, `/api/v1/payments/verify`)
- Payment transaction tracking in database
- Frontend payment UI components
- Payment page integration in booking flow
- Update booking status flow (PENDING → CONFIRMED on payment success)
- Payment webhook handling (optional)

**Deliverables:**
- Payment service module (`backend/app/services/payment.py`)
- Payment API endpoints (`backend/app/api/v1/payments.py`)
- Payment database models and migrations
- Frontend payment components (`frontend/components/payment/`)
- Payment page (`frontend/app/bookings/[id]/payment/page.tsx`)
- Payment integration documentation

**Development Cost:** ₹20,000 - ₹25,000

**Third-Party Costs:**
- Razorpay Setup Fee: ₹0 (No setup fees)
- Transaction Fees (ongoing, per booking):
  - Domestic cards/UPI: 2.36% per transaction (2% + 18% GST)
  - Amex/Diners/International: 3.54% per transaction (3% + 18% GST)
  - Example: ₹5,000 booking = ₹118 (domestic) or ₹177 (international)

---

## PHASE 5: EMAIL NOTIFICATION SYSTEM
**Priority:** High  
**Timeline:** 1-2 working days (8-16 hours)

### Scope of Work

- Email service implementation using SMTP
- HTML email templates for:
  - Booking confirmation (to guest)
  - Booking notification (to admin)
  - Payment confirmation
  - Booking cancellation
- Email integration in booking lifecycle
- SMTP configuration and environment setup

**Deliverables:**
- Email service module (`backend/app/services/email.py`)
- Email templates (`backend/app/core/email_templates.py`)
- Email triggers in booking API
- Email configuration documentation

**Development Cost:** ₹8,000 - ₹10,000

**Third-Party Costs (Monthly):**
- **Option A - AWS SES (Recommended):** ₹500/month (for ~5,000 emails)
- **Option B - SendGrid:** ₹1,500-3,000/month (for 40K emails)
- **Option C - Gmail SMTP:** Free (up to 500 emails/day), then Google Workspace ₹125/user/month

---

## PHASE 6: SECURITY HARDENING
**Priority:** Critical  
**Timeline:** 1-2 working days (8-16 hours)

### Scope of Work

- Rate limiting implementation (using `slowapi`)
- Request validation and input sanitization
- CORS configuration for production
- Security headers implementation
- Password strength requirements
- Enhanced input validation for all endpoints
- CSRF protection for state-changing operations
- Request logging and monitoring setup
- SQL injection prevention
- XSS protection

**Deliverables:**
- Security middleware configuration
- Rate limiting configuration
- Enhanced authentication security
- Security headers configuration
- Security audit report

**Development Cost:** ₹12,000 - ₹15,000

**Third-Party Costs:** ₹0 (open-source security libraries)

---

## PHASE 7: PRODUCTION ENVIRONMENT CONFIGURATION
**Priority:** Critical  
**Timeline:** 2-3 working days (16-24 hours)

### Scope of Work

- Production environment variable templates
- Production Docker Compose configuration
- Production-optimized Dockerfiles (backend & frontend)
- Nginx reverse proxy configuration
- SSL/TLS termination setup
- Health checks for all services
- Static file serving configuration
- API proxying configuration
- Environment-specific configurations

**Deliverables:**
- Production environment templates (`.env.production.example`)
- `docker-compose.prod.yml` with all services
- Production Dockerfiles
- Nginx configuration (`nginx/nginx.conf`)
- Production deployment guide

**Development Cost:** ₹15,000 - ₹20,000

**Third-Party Costs:**
- SSL Certificate: ₹0 (Let's Encrypt - free) or ₹2,000-5,000/year (paid SSL)

---

## PHASE 8: DATABASE BACKUP STRATEGY
**Priority:** High  
**Timeline:** 1 working day (8 hours)

### Scope of Work

- Automated daily database backup system
- Backup retention policy (30 days)
- Backup storage configuration (local + cloud)
- Database restore procedures
- Backup automation scripts

**Deliverables:**
- Backup script (`scripts/backup_database.sh`)
- Restore script (`scripts/restore_database.sh`)
- Backup service in docker-compose
- Backup documentation and procedures

**Development Cost:** ₹5,000 - ₹6,000

**Third-Party Costs (Monthly):**
- Backup Storage: ₹500-1,000/month (cloud backup storage)

---

## PHASE 9: FRONTEND PRODUCTION BUILD
**Priority:** High  
**Timeline:** 1 working day (8 hours)

### Scope of Work

- Next.js production optimizations
- Image optimization configuration
- Environment variable validation
- Error boundaries implementation
- Production build configuration
- Multi-stage Dockerfile optimization
- Code splitting and lazy loading
- Performance optimizations

**Deliverables:**
- Optimized `next.config.ts`
- Production Dockerfile
- Error handling components
- Build optimization documentation

**Development Cost:** ₹4,000 - ₹5,000

**Third-Party Costs:** ₹0

---

## PHASE 10: DEPLOYMENT DOCUMENTATION
**Priority:** Medium  
**Timeline:** 1 working day (8 hours)

### Scope of Work

- Comprehensive deployment guide
- Production checklist
- Server requirements documentation
- Step-by-step deployment instructions
- Environment variable setup guide
- SSL certificate setup guide (Let's Encrypt)
- Domain configuration guide
- Monitoring setup guide
- Troubleshooting guide
- API documentation
- User manual for admin panel

**Deliverables:**
- `DEPLOYMENT.md` - Complete deployment guide
- `PRODUCTION_CHECKLIST.md` - Pre-launch checklist
- Server requirements document
- Troubleshooting guide
- API documentation
- Admin user manual

**Development Cost:** ₹3,000 - ₹4,000

**Third-Party Costs:** ₹0

---

## COST SUMMARY

### One-Time Development Costs

| Phase | Description | Timeline | Cost (₹) |
|-------|-------------|----------|----------|
| Phase 1 | Database Design & Implementation | 3-4 days | 35,000 - 45,000 |
| Phase 2 | Backend API Development | 8-10 days | 80,000 - 1,00,000 |
| Phase 3 | Frontend Development | 10-12 days | 1,00,000 - 1,30,000 |
| Phase 4 | Payment Gateway Integration | 2-3 days | 20,000 - 25,000 |
| Phase 5 | Email Notification System | 1-2 days | 8,000 - 10,000 |
| Phase 6 | Security Hardening | 1-2 days | 12,000 - 15,000 |
| Phase 7 | Production Configuration | 2-3 days | 15,000 - 20,000 |
| Phase 8 | Database Backup Strategy | 1 day | 5,000 - 6,000 |
| Phase 9 | Frontend Production Build | 1 day | 4,000 - 5,000 |
| Phase 10 | Deployment Documentation | 1 day | 3,000 - 4,000 |
| **Testing & QA** | Complete System Testing | 3-4 days | Included |
| **TOTAL** | **Complete Development** | **25-35 days** | **₹2,82,000 - ₹3,60,000** |

### Additional One-Time Costs

- Domain Name: ₹500-1,000/year (₹50-100/month)
- SSL Certificate: ₹0 (Let's Encrypt) or ₹2,000-5,000/year (optional paid SSL)

**Total One-Time Investment: ₹2,82,000 - ₹3,60,000**

---

## MONTHLY RECURRING COSTS

### Hosting Options

#### Option 1: VPS/Cloud Server (Recommended - Full Control)
**DigitalOcean (Bangalore BLR1) - Recommended**

| Plan | Specifications | Monthly Cost (₹) |
|------|----------------|------------------|
| Basic | 2GB RAM, 1 vCPU, 50GB SSD | ₹1,000 |
| Recommended | 4GB RAM, 2 vCPU, 80GB SSD | ₹2,000 |
| High Traffic | 8GB RAM, 4 vCPU, 160GB SSD | ₹4,000 |

**Additional Costs:**
- Backup Storage: ₹200-500/month
- Load Balancer (optional): ₹1,000/month

**Total Monthly (Recommended Plan): ₹2,200-2,500/month**

#### Option 2: Docker Hosting (Easiest - Recommended for Beginners)

**Fly.io (Best Value)**
- Compute (2GB RAM, 1 vCPU): ₹1,700-2,500/month
- PostgreSQL: Included
- Data Transfer: ₹500-1,000/month
- **Total: ₹2,200-3,500/month**

**Railway**
- Resource Usage: ₹4,200-5,000/month
- **Total: ₹4,200-5,000/month**

**Render**
- Standard Plan: ₹2,700-8,800/month
- **Total: ₹2,700-8,800/month**

#### Option 3: Separate Hosting (Best Performance)

- **Frontend:** Vercel/Netlify - ₹0/month (free tier) or ₹1,700/month (pro)
- **Backend:** Fly.io - ₹1,700-2,500/month
- **Database:** Managed PostgreSQL - ₹1,250-5,000/month
- **Total: ₹2,950-9,200/month**

### Email Service Costs (Monthly)

- **AWS SES (Recommended):** ₹500/month (for ~5,000 emails)
- **SendGrid:** ₹1,500-3,000/month (for 40K emails)
- **Gmail SMTP:** Free (up to 500/day) or ₹125/user/month

### Recommended Monthly Setup

**For Starting Out (Budget: ₹2,200-3,000/month):**
- Hosting (Fly.io): ₹1,700-2,500/month
- Email (AWS SES): ₹500/month
- Domain: ₹50/month
- Backup Storage: ₹200/month
- **Total: ₹2,450-3,250/month**

**For Production (Budget: ₹3,550-4,550/month):**
- Hosting (DigitalOcean 4GB): ₹2,000/month
- Email (SendGrid): ₹1,500/month
- Domain: ₹50/month
- Backup Storage: ₹500/month
- **Total: ₹4,050/month**

**For High Traffic (Budget: ₹7,550/month):**
- Hosting (DigitalOcean 8GB + Load Balancer): ₹5,000/month
- Email (SendGrid Pro): ₹1,500/month
- Domain: ₹50/month
- Backup Storage: ₹1,000/month
- **Total: ₹7,550/month**

### Transaction Costs (Per Booking)

**Razorpay Payment Gateway Fees:**
- Domestic cards/UPI: **2.36%** per transaction
- Amex/Diners/International: **3.54%** per transaction

**Example:**
- ₹5,000 booking = ₹118 fee (domestic) or ₹177 fee (international)
- ₹10,000 booking = ₹236 fee (domestic) or ₹354 fee (international)

*Note: Transaction fees are charged by Razorpay and deducted from payment amount. These are not included in development or hosting costs.*

---

## TIMELINE & MILESTONES

### Development Schedule

| Week | Phases | Deliverables | Status |
|------|--------|--------------|--------|
| **Week 1** | Phase 1, 2 (Start) | Database, Backend API (Start) | Foundation |
| **Week 2** | Phase 2 (Continue) | Backend API Completion | Core Backend |
| **Week 3** | Phase 3 (Start) | Frontend Development (Start) | Frontend |
| **Week 4** | Phase 3 (Continue) | Frontend Development Completion | Frontend |
| **Week 5** | Phase 4, 5, 6 | Payment, Email, Security | Integration |
| **Week 6** | Phase 7, 8, 9 | Production Config, Backups, Build | Infrastructure |
| **Week 7** | Phase 10, Testing, Deployment | Documentation, Testing, Launch | Polish & Launch |

### Detailed Timeline

| Phase | Task | Timeline | Priority |
|-------|------|----------|----------|
| Phase 1 | Database Design & Implementation | 3-4 days | Critical |
| Phase 2 | Backend API Development | 8-10 days | Critical |
| Phase 3 | Frontend Development | 10-12 days | Critical |
| Phase 4 | Payment Gateway Integration | 2-3 days | Critical |
| Phase 5 | Email Notifications | 1-2 days | High |
| Phase 6 | Security Hardening | 1-2 days | Critical |
| Phase 7 | Production Configuration | 2-3 days | Critical |
| Phase 8 | Database Backups | 1 day | High |
| Phase 9 | Frontend Production Build | 1 day | High |
| Phase 10 | Documentation | 1 day | Medium |
| **Testing & QA** | Complete System Testing | 3-4 days | Critical |
| **Deployment** | Production Deployment | 1-2 days | Critical |
| **TOTAL** | **Complete Project** | **25-35 days** | - |

### Milestone Payments

1. **Milestone 1 (25%):** Upon completion of Phase 1 & 2 (Database + Backend) - ₹70,500 - ₹90,000
2. **Milestone 2 (35%):** Upon completion of Phase 3 (Frontend) - ₹98,700 - ₹1,26,000
3. **Milestone 3 (25%):** Upon completion of Phases 4, 5, 6 (Payment, Email, Security) - ₹70,500 - ₹90,000
4. **Milestone 4 (15%):** Upon completion of Phases 7-10, Testing & Deployment - ₹42,300 - ₹54,000

---

## PAYMENT TERMS

### Development Fees

**Total Development Cost: ₹2,82,000 - ₹3,60,000**

**Payment Schedule:**
- **Advance Payment (25%):** ₹70,500 - ₹90,000 (Upon project initiation)
- **Milestone 1 (25%):** ₹70,500 - ₹90,000 (Upon completion of Phases 1-2)
- **Milestone 2 (35%):** ₹98,700 - ₹1,26,000 (Upon completion of Phase 3)
- **Milestone 3 (25%):** ₹70,500 - ₹90,000 (Upon completion of Phases 4-6)
- **Final Payment (15%):** ₹42,300 - ₹54,000 (Upon completion, testing & deployment)

**Payment Methods:**
- Bank Transfer (NEFT/RTGS/IMPS)
- UPI
- Cheque (subject to clearance)

**Payment Terms:**
- All payments are due within 7 days of invoice
- Late payment charges: 1.5% per month on overdue amounts
- Work will commence upon receipt of advance payment

### Monthly Operating Costs

**Recommended Setup: ₹4,050/month**

- Hosting: ₹2,000/month
- Email Service: ₹1,500/month
- Domain: ₹50/month
- Backup Storage: ₹500/month

*Note: Monthly costs are billed separately and payable directly to service providers or through us as per agreement.*

---

## SCOPE OF WORK - DETAILED

### What's Included

✅ Complete database design and implementation (PostgreSQL)  
✅ Full backend API development (FastAPI) with 18+ endpoints  
✅ Complete frontend development (Next.js) with 10+ pages  
✅ Payment gateway integration (Razorpay)  
✅ Email notification system with templates  
✅ Security hardening (rate limiting, validation, headers)  
✅ Production deployment configuration  
✅ Docker containerization (backend & frontend)  
✅ Nginx reverse proxy configuration  
✅ Database backup automation  
✅ Frontend production optimizations  
✅ Comprehensive deployment documentation  
✅ Production checklist and testing  
✅ Deployment support and handover  
✅ 30 days post-deployment support (bug fixes only)  
✅ API documentation (Swagger/OpenAPI)  
✅ Admin user manual

### What's NOT Included

❌ Domain name purchase (we can assist)  
❌ SSL certificate purchase (we'll use free Let's Encrypt)  
❌ Server/hosting setup (we'll provide configuration)  
❌ Third-party service subscriptions (Razorpay, email service)  
❌ Ongoing maintenance and updates (available separately)  
❌ Custom feature development beyond scope  
❌ Design changes or UI/UX modifications  
❌ Content creation or copywriting  
❌ Marketing or SEO services  
❌ Mobile app development

---

## TECHNICAL SPECIFICATIONS

### Technology Stack

**Frontend:**
- Next.js 14+ with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Hook Form for form handling
- Axios for API calls
- Zustand for state management
- Responsive design (mobile-first)

**Backend:**
- Python FastAPI framework
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication
- Alembic for database migrations
- Pydantic for data validation
- Bcrypt for password hashing

**Infrastructure:**
- Docker & Docker Compose
- Nginx reverse proxy
- Gunicorn + Uvicorn workers
- Automated backups
- Health check endpoints

### Database Schema

**Tables:**
- Users (authentication, roles, profiles)
- Room Types (categories, pricing)
- Rooms (inventory, availability)
- Room Amenities (features)
- Bookings (reservations, status)
- Services (hotel services)
- Payment Transactions (payment records)

**Features:**
- Proper foreign key relationships
- Indexes for performance
- Timestamps (created_at, updated_at)
- Soft delete support
- Enum types for status fields

### Security Features

- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection
- Security headers (XSS, CSRF protection)
- Password strength requirements
- JWT token-based authentication
- Request logging and monitoring
- SQL injection prevention
- XSS protection
- Role-based access control

### Performance Features

- Database connection pooling
- Frontend code splitting
- Image optimization
- Static asset caching
- Production-optimized builds
- Health check endpoints
- Lazy loading components
- API response caching (where applicable)

---

## DEPLOYMENT OPTIONS

### Option 1: Self-Hosted (Recommended)
- Full control over infrastructure
- Cost-effective for long-term
- Customizable and scalable
- **Setup:** We provide configuration, you manage server

### Option 2: Managed Hosting
- Easy deployment
- Automatic SSL
- Built-in monitoring
- **Setup:** We deploy to your chosen platform

### Option 3: Hybrid Approach
- Frontend on Vercel/Netlify
- Backend on managed hosting
- Database on managed service
- **Setup:** We configure all services

---

## POST-DEPLOYMENT SUPPORT

### Included Support (30 Days)

- Bug fixes and critical issues
- Deployment-related troubleshooting
- Configuration assistance
- Documentation clarifications
- Minor adjustments (within scope)

### Additional Support (Available Separately)

- **Monthly Maintenance:** ₹8,000-15,000/month
  - Security updates
  - Dependency updates
  - Performance monitoring
  - Backup verification
  - Minor bug fixes

- **Feature Development:** ₹2,500-6,000/hour
  - Custom features
  - UI/UX enhancements
  - Integration with third-party services
  - New functionality

- **Emergency Support:** ₹4,000-6,000/hour
  - Critical issue resolution
  - After-hours support
  - Priority response
  - System recovery

---

## TERMS & CONDITIONS

1. **Project Timeline:** Timeline is estimated and may vary based on client feedback and requirements changes. Delays in client approvals will extend the timeline accordingly.

2. **Scope Changes:** Any changes to the scope of work will be quoted separately and require written approval before implementation.

3. **Intellectual Property:** Upon full payment, all code, documentation, and intellectual property will be transferred to the client.

4. **Warranty:** We provide 30 days warranty for bug fixes related to delivered features. Warranty does not cover changes or additions to scope.

5. **Third-Party Services:** Client is responsible for setting up and maintaining third-party service accounts (Razorpay, email service, hosting). We will assist with configuration.

6. **Data Backup:** While we implement backup systems, client is ultimately responsible for data backup and recovery. We recommend regular backup verification.

7. **Cancellation:** If project is cancelled, payment for completed work is non-refundable. Work completed will be delivered to client.

8. **Confidentiality:** All project information will be kept confidential. We will not share code or project details with third parties.

9. **Force Majeure:** Delays due to circumstances beyond our control (natural disasters, third-party service outages, internet connectivity issues) are not our responsibility.

10. **Governing Law:** This agreement is governed by Indian law. Any disputes will be subject to the jurisdiction of [Your City] courts.

11. **Source Code:** Complete source code will be provided upon final payment. Code will be delivered via Git repository or ZIP file.

12. **Training:** Basic training on admin panel usage is included. Additional training sessions can be arranged at extra cost.

---

## NEXT STEPS

1. **Review & Approval:** Please review this quotation and approve the scope and costs.

2. **Project Initiation:** Upon approval and receipt of advance payment (25%), we will:
   - Set up project repository
   - Create detailed project timeline
   - Begin Phase 1 (Database Design)

3. **Communication:** We will provide weekly progress updates and maintain open communication throughout the project via:
   - Weekly status reports
   - Regular meetings (as needed)
   - Email/WhatsApp for quick queries

4. **Testing:** Client will be involved in testing phases to ensure requirements are met. Feedback will be incorporated promptly.

5. **Deployment:** Upon completion, we will assist with deployment and provide training on admin panel usage.

6. **Handover:** Complete source code, documentation, and credentials will be handed over upon final payment.

---

## CONTACT INFORMATION

**Developer/Company:** [Your Name/Company Name]  
**Email:** [Your Email]  
**Phone:** [Your Phone]  
**Address:** [Your Address]  
**Website:** [Your Website] (if applicable)

---

## ACCEPTANCE

I/We have read and understood the terms and conditions of this quotation and agree to proceed with the project as outlined.

**Client Signature:** _________________________  
**Date:** _________________________  
**Name:** _________________________  
**Designation:** _________________________  
**Company/Organization:** _________________________

**Developer Signature:** _________________________  
**Date:** _________________________  
**Name:** _________________________

---

**Thank you for considering our services. We look forward to working with you on this project and delivering a world-class hotel booking system for Shivashray Hotel.**

---

*This quotation is valid for 30 days from the date of issue. Prices are subject to change after the validity period.*

*For any queries or clarifications, please feel free to contact us.*

---

**Designed and developed by [workwithvijay.netlify.app](https://workwithvijay.netlify.app)**
