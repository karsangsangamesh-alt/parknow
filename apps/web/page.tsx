export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to ParkNow
        </h1>
        <p className="text-center text-lg mb-8">
          Find and book parking spots easily
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="border rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Find Parking</h3>
            <p className="text-gray-600">Search for available parking spots in your area</p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Book Instantly</h3>
            <p className="text-gray-600">Reserve your spot in just a few clicks</p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Easy Payment</h3>
            <p className="text-gray-600">Secure and convenient payment options</p>
          </div>
        </div>
      </div>
    </main>
  )
}
