# ParkNow - Parking Marketplace Platform

## 🚗 Overview

ParkNow is a modern, production-ready parking marketplace that connects parking space hosts with drivers looking for convenient parking spots. Built with Next.js 14, Supabase, and Tailwind CSS, it provides a seamless booking experience with real-time search, email verification, and comprehensive user management.

## ✨ Features

### 🔍 **Smart Search & Discovery**
- **Real-time Location Search**: Find parking spaces near your destination
- **Interactive Map View**: Visual map with markers and property details
- **Advanced Filtering**: Price range, vehicle type, amenities, distance radius
- **NYC Sample Data**: Pre-populated with 20 real NYC parking locations

### 👥 **User Management & Authentication**
- **Role-based System**: Support for Hosts, Renters, and Both
- **Email Verification**: Automatic sign-in after email verification
- **Secure Authentication**: Supabase Auth with OTP and password options
- **Profile Management**: Comprehensive user profiles with role assignment

### 🏠 **Host Features**
- **Listing Management**: Create and manage parking space listings
- **Availability Calendar**: Set and update availability schedules
- **Earnings Dashboard**: Track income and booking analytics
- **Verification System**: Host verification and KYC integration

### 🚘 **Renter Features**
- **Smart Booking**: Instant booking with secure payment processing
- **Booking History**: Access to past and upcoming reservations
- **Saved Favorites**: Save preferred parking spaces
- **Route Integration**: Navigation to booked parking spots

### 📱 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional Styling**: Clean, modern interface with animations
- **Progressive Web App**: Installable PWA with offline capabilities
- **Accessibility**: WCAG compliant with screen reader support

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Database**: PostgreSQL with PostGIS for spatial queries
- **Authentication**: Supabase Auth with email verification
- **Maps**: Integration ready for Google Maps/Mapbox
- **Deployment**: Vercel ready with CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/karsangsangamesh-alt/parknow.git
cd parknow
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. **Set up the database**
- Create a new Supabase project
- Run the SQL schema from `supabase-schema.sql`
- Add sample data from `sample-data-development.sql`

5. **Start the development server**
```bash
npm run dev
```

6. **Visit the app**
- Landing page: http://localhost:3000
- Search page: http://localhost:3000/search
- Authentication: http://localhost:3000/auth

## 📁 Project Structure

```
parknow/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/                # App Router pages
│       │   ├── auth/          # Authentication pages
│       │   ├── search/        # Search functionality
│       │   ├── dashboard/     # User dashboard
│       │   └── globals.css    # Global styles
│       ├── components/        # React components
│       │   ├── auth/          # Auth components
│       │   ├── landing/       # Landing page components
│       │   ├── search/        # Search components
│       │   └── dashboard/     # Dashboard components
│       ├── lib/               # Utility libraries
│       │   └── supabase/      # Supabase client and auth
│       └── public/            # Static assets
├── packages/                  # Shared packages
├── infra/                    # Infrastructure configs
├── scripts/                  # Build and deployment scripts
└── README.md
```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL database with the following key tables:

- **profiles** - User profiles with role management
- **listings** - Parking space listings with spatial data
- **bookings** - Booking records and status tracking
- **reviews** - User reviews and ratings
- **payments** - Payment transaction records

## 🎨 Design System

Built with Tailwind CSS featuring:
- **Consistent Color Palette**: Blue primary, gray neutral tones
- **Professional Typography**: Inter font family
- **Component Library**: Reusable UI components
- **Responsive Breakpoints**: Mobile-first design approach
- **Animation Library**: Smooth transitions and micro-interactions

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server deployment**

### Environment Variables

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Sample Data

The project includes comprehensive sample data:
- **10 Host Profiles** with realistic business information
- **20 NYC Parking Listings** with actual coordinates
- **Spatial Data** for radius-based searches
- **Amenity System** with JSONB fields for flexibility

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the sample data and database schema

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Real-time chat between hosts and renters
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-city expansion
- [ ] Smart lock integration
- [ ] Corporate booking features

---

**Built with ❤️ for the parking industry**
